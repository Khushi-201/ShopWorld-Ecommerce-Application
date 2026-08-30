package com.ecommerce.Controller;

import com.ecommerce.DTO.SellerRequest;
import com.ecommerce.DTO.SellerResponse;
import com.ecommerce.Service.SellerService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seller")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }
    @PostMapping("/apply")
    public SellerResponse applyAsSeller(@Valid  @RequestBody SellerRequest request, Authentication authentication){
        return sellerService.apply(request, authentication.getName());
    }

    @GetMapping("/seller/status/me")
    public String showMyStatus(Authentication authentication){
        return sellerService.showStatus(authentication.getName());
    }
}
