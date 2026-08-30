package com.ecommerce.Controller;

import com.ecommerce.DTO.ProductImageResponse;
import com.ecommerce.Service.ProductImageService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/seller/products/{productId}/images")
public class ProductImageController {

    private final ProductImageService productImageService;

    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @PostMapping
    public List<ProductImageResponse> addImages(@PathVariable Long productId,
                                                @RequestParam("images") List<MultipartFile> images,
                                                Authentication authentication) {
        return productImageService.addImages(productId, images, authentication.getName());
    }

    @DeleteMapping("/{imageId}")
    public void removeImage(@PathVariable Long productId,
                            @PathVariable Long imageId,
                            Authentication authentication) {
        productImageService.removeImage(productId, imageId, authentication.getName());
    }

    @PutMapping("/{imageId}/primary")
    public ProductImageResponse setPrimary(@PathVariable Long productId,
                                           @PathVariable Long imageId,
                                           Authentication authentication) {
        return productImageService.setPrimary(productId, imageId, authentication.getName());
    }
}