package com.ecommerce.Service;

import com.ecommerce.DTO.WishlistItemResponse;
import com.ecommerce.DTO.WishlistRequest;
import com.ecommerce.Entity.Product;
import com.ecommerce.Entity.User;
import com.ecommerce.Entity.WishlistItem;
import com.ecommerce.Repository.ProductRepository;
import com.ecommerce.Repository.UserRepository;
import com.ecommerce.Repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public List<WishlistItemResponse> addToWishlist(WishlistRequest request, String email) {
        User user = getUser(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product does not exist"));

        boolean alreadyExists = wishlistRepository.existsByUserIdAndProductId(user.getId(), product.getId());
        if (!alreadyExists) {
            WishlistItem item = new WishlistItem();
            item.setUser(user);
            item.setProduct(product);
            item.setAddedAt(LocalDateTime.now());
            wishlistRepository.save(item);
        }

        return getWishlist(email);
    }

    @Transactional
    public List<WishlistItemResponse> removeFromWishlist(Long productId, String email) {
        User user = getUser(email);
        WishlistItem item = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not in wishlist"));

        wishlistRepository.delete(item);
        return getWishlist(email);
    }

    public List<WishlistItemResponse> getWishlist(String email) {
        User user = getUser(email);
        return wishlistRepository.findByUserId(user.getId()).stream()
                .map(item -> new WishlistItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getProduct().getQuantity() > 0))
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User does not exist"));
    }
}