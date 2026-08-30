package com.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class CartResponse {
    private Long cartId;
    private List<Item> items;

    @Getter
    @AllArgsConstructor
    public static class Item {
        private Long productId;
        private String productName;
        private BigDecimal priceAtPurchase;
        private int quantity;
    }
}