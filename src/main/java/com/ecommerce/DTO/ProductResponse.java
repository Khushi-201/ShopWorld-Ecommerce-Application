package com.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class ProductResponse {

    private Long productId;
    private String name;
    private Long categoryId;
    private String categoryName;
    private Long sellerId;
    private String sellerBusinessName;
    private Integer quantity;
    private BigDecimal price;
    private String description;
    private List<ProductImageResponse> images;
}