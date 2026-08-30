package com.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserAccessResponse {

    private String email;
    private String name;
    private boolean isAdmin;
    private String sellerStatus;
}
