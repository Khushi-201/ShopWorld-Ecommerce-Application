package com.ecommerce.DTO;

import com.ecommerce.Enum.SellerStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SellerResponse {

    private Long sellerId;
    private String businessName;
    private SellerStatus status;
    private String message;
}
