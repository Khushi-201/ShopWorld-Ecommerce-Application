package com.ecommerce.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerRequest {

    @NotBlank
    private String businessName;

    private String businessType;

    private String businessAddress;

    private String description;
}