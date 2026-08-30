package com.ecommerce.Repository;

import com.ecommerce.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findBySellerId(Long sellerId);
    boolean existsBySellerIdAndNameIgnoreCase(Long sellerId, String name);
    List<Product> findBySellerIdAndNameContainingIgnoreCase(Long sellerId, String name);
    List<Product> findBySellerIdAndCategoryId_Id(Long sellerId, Long categoryId);
    List<Product> findByCategoryId_Id(Long categoryId);
    Optional<Product> findById(Long productId);
}
