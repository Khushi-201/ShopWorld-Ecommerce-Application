package com.ecommerce.Controller;

import com.ecommerce.DTO.CartItemRequest;
import com.ecommerce.DTO.CartResponse;
import com.ecommerce.Service.CartService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponse getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping("/items")
    public CartResponse addToCart(@RequestBody CartItemRequest request, Authentication authentication) {
        return cartService.addToCart(request, authentication.getName());
    }

    @PutMapping("/items/{productId}")
    public CartResponse updateQuantity(@PathVariable Long productId,
                                       @RequestParam int quantity,
                                       Authentication authentication) {
        return cartService.updateQuantity(productId, quantity, authentication.getName());
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse removeFromCart(@PathVariable Long productId, Authentication authentication) {
        return cartService.removeFromCart(productId, authentication.getName());
    }
}