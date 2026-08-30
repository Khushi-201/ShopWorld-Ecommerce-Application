package com.ecommerce.Controller;

import com.ecommerce.DTO.UserAccessResponse;
import com.ecommerce.DTO.UserProfileUpdateRequest;
import com.ecommerce.DTO.UserResponse;
import com.ecommerce.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse getProfile(Authentication authentication) {
        return userService.getProfile(authentication.getName());
    }

    @PutMapping
    public UserResponse updateProfile(@Valid @RequestBody UserProfileUpdateRequest request,
                                      Authentication authentication) {
        return userService.updateProfile(request, authentication.getName());
    }

    @GetMapping("/access")
    public UserAccessResponse checkAdmin(Authentication authentication){
        return userService.checkAdmin(authentication.getName());
    }
}