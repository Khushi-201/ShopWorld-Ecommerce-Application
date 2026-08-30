package com.ecommerce.Controller;

import com.ecommerce.DTO.LoginRequest;
import com.ecommerce.DTO.LoginResponse;
import com.ecommerce.DTO.RegisterRequest;
import com.ecommerce.Entity.User;
import com.ecommerce.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }
    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request){
        return authService.login(request);
    }

//    @PostMapping("/refresh")
//    private User refresh(String name, String password){
//
//    }

}
