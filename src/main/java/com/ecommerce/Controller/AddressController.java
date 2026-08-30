package com.ecommerce.Controller;

import com.ecommerce.DTO.AddressRequest;
import com.ecommerce.DTO.AddressResponse;
import com.ecommerce.Service.AddressService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public List<AddressResponse> getMyAddresses(Authentication authentication) {
        return addressService.getMyAddresses(authentication.getName());
    }

    @PostMapping
    public AddressResponse addAddress(@Valid @RequestBody AddressRequest request, Authentication authentication) {
        return addressService.addAddress(request, authentication.getName());
    }

    @PutMapping("/{addressId}")
    public AddressResponse updateAddress(@PathVariable Long addressId,
                                         @Valid @RequestBody AddressRequest request,
                                         Authentication authentication) {
        return addressService.updateAddress(addressId, request, authentication.getName());
    }

    @DeleteMapping("/{addressId}")
    public void deleteAddress(@PathVariable Long addressId, Authentication authentication) {
        addressService.deleteAddress(addressId, authentication.getName());
    }
}