package com.ecommerce.Service;

import com.ecommerce.DTO.OrderRequest;
import com.ecommerce.DTO.OrderResponse;
import com.ecommerce.Entity.Address;
import com.ecommerce.Entity.Order;
import com.ecommerce.Entity.OrderItem;
import com.ecommerce.Entity.Product;
import com.ecommerce.Entity.CartItem;
import com.ecommerce.Entity.Seller;
import com.ecommerce.Entity.User;
import com.ecommerce.Entity.Cart;
import com.ecommerce.Entity.SubOrder;
import com.ecommerce.Enum.OrderStatus;
import com.ecommerce.Event.OrderConfirmedEvent;
import com.ecommerce.Repository.*;
import com.ecommerce.exception.ConflictException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.validator.OrderStatusValidator;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SubOrderRepository subOrderRepository;
    private final AddressRepository addressRepository;
    private final ApplicationEventPublisher eventPublisher;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        SubOrderRepository subOrderRepository,
                        AddressRepository addressRepository,
                        ApplicationEventPublisher eventPublisher) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.subOrderRepository = subOrderRepository;
        this.addressRepository = addressRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request, String email) {
        User user = getUser(email);

        if (request == null || request.getAddressId() == null) {
            throw new RuntimeException("Please select a delivery address");
        }

        Address deliveryAddress = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Delivery address not found"));

        if (!deliveryAddress.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("This address does not belong to the logged-in user");
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Map<Seller, List<CartItem>> itemsBySeller = cartItems.stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller()));
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(deliveryAddress);
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal orderTotal = BigDecimal.ZERO;

        for (Map.Entry<Seller, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Seller seller = entry.getKey();
            List<CartItem> sellerItems = entry.getValue();

            SubOrder subOrder = new SubOrder();
            subOrder.setOrder(order);
            subOrder.setSeller(seller);
            subOrder.setStatus(OrderStatus.CREATED);

            BigDecimal subTotal = BigDecimal.ZERO;

            for (CartItem cartItem : sellerItems) {
                Product product = cartItem.getProduct();

                if (cartItem.getQuantity() > product.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setSubOrder(subOrder);
                orderItem.setProduct(product);
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPriceAtPurchase(product.getPrice());
                subOrder.getOrderItems().add(orderItem);

                product.setQuantity(product.getQuantity() - cartItem.getQuantity());
                try {
                    productRepository.save(product);
                } catch (ObjectOptimisticLockingFailureException e) {
                    throw new ConflictException("Please try again! Stock might have changed while processing your order for: " + product.getName());
                }

                subTotal = subTotal.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            }

            subOrder.setSubtotal(subTotal);
            order.getSubOrders().add(subOrder);
            orderTotal = orderTotal.add(subTotal);
        }

        order.setTotalAmount(orderTotal);
        orderRepository.save(order);

        cartItemRepository.deleteAll(cartItems);
        cart.getItems().clear();

        eventPublisher.publishEvent(new OrderConfirmedEvent(this, order));
        return toResponse(order);
    }

    public List<OrderResponse> getMyOrders(String email) {
        User user = getUser(email);
        return orderRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse getOrderDetails(Long orderId, String email) {
        Order order = getOwnedOrder(orderId, email);
        return toResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, String email) {
        Order order = getOwnedOrder(orderId, email);

        if (order.getStatus() != OrderStatus.CREATED && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException("Order can no longer be cancelled");
        }

        restockItems(order);
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return toResponse(order);
    }

    @Transactional
    public OrderResponse returnOrder(Long orderId, String email) {
        Order order = getOwnedOrder(orderId, email);

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Only delivered orders can be returned");
        }

        restockItems(order);
        order.setStatus(OrderStatus.RETURNED);
        orderRepository.save(order);
        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long subOrderId, OrderStatus newStatus) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sub-order not found"));

        OrderStatusValidator.validateTransition(subOrder.getStatus(), newStatus);

        subOrder.setStatus(newStatus);
        subOrderRepository.save(subOrder);
        return toResponse(subOrder.getOrder());
    }

    private void restockItems(Order order) {
        order.getSubOrders().stream()
                .flatMap(so -> so.getOrderItems().stream())
                .forEach(item -> {
                    Product product = item.getProduct();
                    product.setQuantity(product.getQuantity() + item.getQuantity());
                    productRepository.save(product);
                });
    }

    private Order getOwnedOrder(Long orderId, String email) {
        User user = getUser(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You do not own this order");
        }

        return order;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User does not exist"));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.Item> items = order.getSubOrders().stream()
                .flatMap(so -> so.getOrderItems().stream())
                .map(i -> new OrderResponse.Item(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getPriceAtPurchase()))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items
        );
    }

}