package com.ecommerce.Service;

import com.ecommerce.DTO.ProductImageResponse;
import com.ecommerce.Entity.Product;
import com.ecommerce.Entity.ProductImage;
import com.ecommerce.Entity.Seller;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedActionException;
import com.ecommerce.Repository.ProductImageRepository;
import com.ecommerce.Repository.ProductRepository;
import com.ecommerce.Repository.SellerRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final S3Service s3Service;

    public ProductImageService(ProductImageRepository productImageRepository,
                               ProductRepository productRepository,
                               SellerRepository sellerRepository,
                               S3Service s3Service) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
        this.sellerRepository = sellerRepository;
        this.s3Service = s3Service;
    }

    @Transactional
    @CacheEvict(value = "products", key = "#productId")
    public List<ProductImageResponse> addImages(Long productId, List<MultipartFile> images, String email) {
        Product product = getOwnedProduct(productId, email);

        boolean hasExistingImages = !productImageRepository.findByProductId(productId).isEmpty();

        for (MultipartFile file : images) {
            String url = s3Service.uploadFile(file);
            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(url);
            image.setPrimary(!hasExistingImages && images.indexOf(file) == 0);
            productImageRepository.save(image);
        }

        return productImageRepository.findByProductId(productId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "products", key = "#productId")
    public void removeImage(Long productId, Long imageId, String email) {
        getOwnedProduct(productId, email);

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        if (!image.getProduct().getId().equals(productId)) {
            throw new UnauthorizedActionException("Image does not belong to this product");
        }

        long remainingCount = productImageRepository.findByProductId(productId).size();
        if (remainingCount <= 1) {
            throw new IllegalStateException("Product must have at least one photo");
        }

        s3Service.deleteFile(image.getImageUrl());
        productImageRepository.delete(image);

        if (image.isPrimary()) {
            productImageRepository.findByProductId(productId).stream()
                    .findFirst()
                    .ifPresent(next -> {
                        next.setPrimary(true);
                        productImageRepository.save(next);
                    });
        }
    }

    @Transactional
    @CacheEvict(value = "products", key = "#productId")
    public ProductImageResponse setPrimary(Long productId, Long imageId, String email) {
        getOwnedProduct(productId, email);

        productImageRepository.findByProductId(productId).forEach(img -> {
            if (img.isPrimary()) {
                img.setPrimary(false);
                productImageRepository.save(img);
            }
        });

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));
        image.setPrimary(true);
        productImageRepository.save(image);

        return toResponse(image);
    }

    private Product getOwnedProduct(Long productId, String email) {
        Seller seller = sellerRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new UnauthorizedActionException("You do not own this product");
        }

        return product;
    }

    private ProductImageResponse toResponse(ProductImage image) {
        return new ProductImageResponse(image.getId(), image.getImageUrl(), image.isPrimary());
    }
}