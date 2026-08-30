package com.ecommerce.Controller;

import com.ecommerce.DTO.WishlistItemResponse;
import com.ecommerce.DTO.WishlistRequest;
import com.ecommerce.Service.WishlistService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<WishlistItemResponse> getWishlist(Authentication authentication) {
        return wishlistService.getWishlist(authentication.getName());
    }

    @PostMapping("/items")
    public List<WishlistItemResponse> addToWishlist(@RequestBody WishlistRequest request,
                                                    Authentication authentication) {
        return wishlistService.addToWishlist(request, authentication.getName());
    }

    @DeleteMapping("/items/{productId}")
    public List<WishlistItemResponse> removeFromWishlist(@PathVariable Long productId,
                                                         Authentication authentication) {
        return wishlistService.removeFromWishlist(productId, authentication.getName());
    }
}