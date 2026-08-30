package com.ecommerce.Controller;

import com.ecommerce.DTO.ProductRequest;
import com.ecommerce.DTO.ProductResponse;
import com.ecommerce.Entity.Product;
import com.ecommerce.Service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product addProduct(@RequestPart("product") @Valid ProductRequest request,
                              @RequestPart("images") List<MultipartFile> images,
                              Authentication authentication) {
        return productService.addProduct(request, images, authentication.getName());
    }

    @PutMapping("/{productId}")
    public ProductResponse updateProduct(@PathVariable Long productId,
                                         @Valid @RequestBody ProductRequest request,
                                         Authentication authentication) {
        return productService.updateProduct(productId, request, authentication.getName());
    }

    @DeleteMapping("/{productId}")
    public void removeProduct(@PathVariable Long productId, Authentication authentication) {
        productService.removeProduct(productId, authentication.getName());
    }

    @GetMapping("/search/{productId}")
    public ProductResponse searchProduct(@PathVariable Long productId) {
        return productService.getProduct(productId);
    }

    @GetMapping("/search/products")
    public List<ProductResponse> showProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/search/category")
    public List<ProductResponse> showProductsByCategory(@RequestParam Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/seller/name")
    public List<ProductResponse> searchProductsByName(@RequestParam String name, Authentication authentication) {
        return productService.searchProductsByName(name, authentication.getName());
    }

    @GetMapping("/seller/category")
    public List<ProductResponse> searchProductsByCategory(@RequestParam Long categoryId, Authentication authentication) {
        return productService.searchProductsByCategory(categoryId, authentication.getName());
    }

    @GetMapping("/seller/products")
    public List<ProductResponse> getMyProducts(Authentication authentication) {
        return productService.getProductsBySeller(authentication.getName());
    }
}
