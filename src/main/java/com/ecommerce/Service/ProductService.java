package com.ecommerce.Service;

import com.ecommerce.DTO.ProductRequest;
import com.ecommerce.DTO.ProductResponse;
import com.ecommerce.DTO.ProductImageResponse;
import com.ecommerce.Entity.Category;
import com.ecommerce.Entity.Product;
import com.ecommerce.Entity.ProductImage;
import com.ecommerce.Entity.Seller;
import com.ecommerce.Enum.SellerStatus;
import com.ecommerce.Repository.CategoryRepository;
import com.ecommerce.Repository.ProductImageRepository;
import com.ecommerce.Repository.ProductRepository;
import com.ecommerce.Repository.SellerRepository;
import com.ecommerce.exception.InvalidStateException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final S3Service s3Service;

    public ProductService(ProductRepository productRepository,
                          SellerRepository sellerRepository,
                          CategoryRepository categoryRepository,
                          ProductImageRepository productImageRepository,
                          S3Service s3Service){
        this.productRepository = productRepository;
        this.sellerRepository = sellerRepository;
        this.categoryRepository = categoryRepository;
        this.s3Service = s3Service;
        this.productImageRepository = productImageRepository;
    }

    @CacheEvict(value = "productsBySeller", key = "#email")
    public Product addProduct(ProductRequest request, List<MultipartFile> images, String email){
        Seller seller = getApprovedSeller(email);

        if (images == null || images.isEmpty()) {
            throw new InvalidStateException("At least one product photo is required");
        }

        boolean duplicate = productRepository.existsBySellerIdAndNameIgnoreCase(
                seller.getId(), request.getName());
        if (duplicate) {
            throw new RuntimeException("You already have a product with this name");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setCategoryId(category);
        product.setSeller(seller);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setDescription(request.getDescription());

        productRepository.save(product);

        for (int i = 0; i < images.size(); i++) {
            String url = s3Service.uploadFile(images.get(i));
            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(url);
            image.setPrimary(i == 0); // first uploaded image is primary
            productImageRepository.save(image);
        }

        return product;
    }

    private Seller getApprovedSeller(String email){
        Seller existingSeller = sellerRepository.findByUserEmail(email)
                .orElseThrow(()-> new RuntimeException("Seller do not exist for this email!"));
        if (existingSeller.getStatus() != SellerStatus.APPROVED) {
            throw new RuntimeException("Your seller account is not approved yet");
        }
        return existingSeller;
    }

    @Caching(evict = {
            @CacheEvict(value = "products", key = "#productId"),
            @CacheEvict(value = "productsBySeller", key = "#email")
    })
    public ProductResponse updateProduct(Long productId, ProductRequest request, String email) {
        Seller seller = getApprovedSeller(email);
        Product product = getOwnedProduct(productId, seller);

        if (!product.getName().equalsIgnoreCase(request.getName())) {
            boolean duplicate = productRepository
                    .existsBySellerIdAndNameIgnoreCase(seller.getId(), request.getName());
            if (duplicate) {
                throw new RuntimeException("You already have a product with this name");
            }
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategoryId(category);

        productRepository.save(product);
        return toResponse(product);
    }

    @Caching(evict = {
            @CacheEvict(value = "products", key = "#productId"),
            @CacheEvict(value = "productsBySeller", key = "#email")
    })
    public void removeProduct(Long productId, String email) {
        Seller seller = getApprovedSeller(email);
        Product product = getOwnedProduct(productId, seller);

        List<ProductImage> images = productImageRepository.findByProductId(productId);
        for (ProductImage image : images) {
            s3Service.deleteFile(image.getImageUrl());
        }

        productRepository.delete(product);
    }

    private Product getOwnedProduct(Long productId, Seller seller) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("You do not own this product");
        }

        return product;
    }

    @Cacheable(value = "productsBySeller", key = "#email")
    public List<ProductResponse> getProductsBySeller(String email) {
        Seller seller = getApprovedSeller(email);
        return productRepository.findBySellerId(seller.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Cacheable(value = "products")
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ProductResponse toResponse(Product product) {
        List<ProductImageResponse> images = productImageRepository.findByProductId(product.getId()).stream()
                .map(img -> new ProductImageResponse(img.getId(), img.getImageUrl(), img.isPrimary()))
                .toList();

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getCategoryId().getId(),
                product.getCategoryId().getName(),
                product.getSeller().getId(),
                product.getSeller().getBusinessName(),
                product.getQuantity(),
                product.getPrice(),
                product.getDescription(),
                images
        );
    }

    @Cacheable(value = "products", key = "#productId")
    public ProductResponse getProduct(Long productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product do not exist"));
        return toResponse(product);
    }

    public List<ProductResponse> searchProductsByName(String name, String email) {
        Seller seller = getApprovedSeller(email);
        return productRepository.findBySellerIdAndNameContainingIgnoreCase(seller.getId(), name)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId_Id(categoryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> searchProductsByCategory(Long categoryId, String email) {
        Seller seller = getApprovedSeller(email);
        return productRepository.findBySellerIdAndCategoryId_Id(seller.getId(), categoryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}
