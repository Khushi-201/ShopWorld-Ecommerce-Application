package com.ecommerce.Controller;

import com.ecommerce.DTO.OrderRequest;
import com.ecommerce.DTO.OrderResponse;
import com.ecommerce.Service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrderDetails(@PathVariable Long orderId, Authentication authentication){
        return orderService.getOrderDetails(orderId, authentication.getName());
    }

    @PostMapping
    public OrderResponse placeOrder(@RequestBody OrderRequest request, Authentication authentication){
        return orderService.placeOrder(request, authentication.getName()); //current cart converted to order
    }

    @PutMapping("/cancel/{orderId}")
    public OrderResponse cancelOrder(@PathVariable Long orderId, Authentication authentication){
        return orderService.cancelOrder(orderId, authentication.getName());
    }

    @PutMapping("/return/{orderId}")
    public OrderResponse returnOrder(@PathVariable Long orderId, Authentication authentication){
        return orderService.returnOrder(orderId, authentication.getName());
    }

    @GetMapping
    public List<OrderResponse> getMyOrders(Authentication authentication){
        return orderService.getMyOrders(authentication.getName());
    }

}
