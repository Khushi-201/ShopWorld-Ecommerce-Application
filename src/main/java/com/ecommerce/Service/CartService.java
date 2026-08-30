package com.ecommerce.Service;

import com.ecommerce.DTO.CartItemRequest;
import com.ecommerce.DTO.CartResponse;
import com.ecommerce.Entity.Cart;
import com.ecommerce.Entity.CartItem;
import com.ecommerce.Entity.Product;
import com.ecommerce.Entity.User;
import com.ecommerce.Repository.CartItemRepository;
import com.ecommerce.Repository.CartRepository;
import com.ecommerce.Repository.ProductRepository;
import com.ecommerce.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository, CartItemRepository cartItemRepository){
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public CartResponse getCart(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User does not exist"));
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Cart do not exist"));
        return toResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(CartItemRequest request, String email){
        Cart cart = getOrCreateCart(email);
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new RuntimeException("Product do not exist"));
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        CartItem existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);
        int newTotalQuantity = (existing != null ? existing.getQuantity() : 0) + request.getQuantity();

        if (newTotalQuantity > product.getQuantity()) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }

        if (existing != null) {
            existing.setQuantity(newTotalQuantity);
            cartItemRepository.save(existing);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }
        return toResponse(cart);
    }

    @Transactional
    public CartResponse updateQuantity(Long productId, Integer quantity, String email){
        if (quantity <= 0) {
            return removeFromCart(productId, email);
        }
        Cart cart = getOrCreateCart(email);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(),productId).orElseThrow(() -> new RuntimeException("CartItem do not exist"));
        if (quantity > item.getProduct().getQuantity()) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse removeFromCart(Long productId, String email){
        CartResponse cartResponse = getCart(email);
        Cart cart = cartRepository.findById(cartResponse.getCartId()).orElseThrow(()->new RuntimeException("Cart do not exist"));
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(),productId).orElseThrow(() -> new RuntimeException("CartItem do not exist"));
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    private Cart getOrCreateCart(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User does not exist"));
        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
        return cart;
    }

    private CartResponse toResponse(Cart cart){
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartResponse.Item>items1 =  new ArrayList<>();
        for(CartItem cartItem: items){
            CartResponse.Item item = new CartResponse.Item(
                    cartItem.getProduct().getId(),
                    cartItem.getProduct().getName(),
                    cartItem.getProduct().getPrice(),
                    cartItem.getQuantity()
            );
            items1.add(item);
        }
        CartResponse cartResponse = new CartResponse(cart.getId(), items1);
        return cartResponse;
    }

}
