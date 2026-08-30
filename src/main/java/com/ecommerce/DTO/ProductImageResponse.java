package com.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ProductImageResponse {
    private Long id;
    private String imageUrl;
    private boolean isPrimary;
}