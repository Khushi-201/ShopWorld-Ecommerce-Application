package com.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;

@Getter @AllArgsConstructor
public class WishlistItemResponse {
    private Long productId;
    private String productName;
    private BigDecimal price;
    private boolean inStock;
}