package com.ecommerce.DTO;

import com.ecommerce.Enum.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<Item> items;

    @Getter
    @AllArgsConstructor
    public static class Item {
        private Long productId;
        private String productName;
        private int quantity;
        private BigDecimal priceAtPurchase;
    }
}
