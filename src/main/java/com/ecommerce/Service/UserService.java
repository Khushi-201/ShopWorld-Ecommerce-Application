package com.ecommerce.Service;

import com.ecommerce.DTO.UserAccessResponse;
import com.ecommerce.DTO.UserProfileUpdateRequest;
import com.ecommerce.DTO.UserResponse;
import com.ecommerce.Entity.User;
import com.ecommerce.Repository.AdminRepository;
import com.ecommerce.Repository.SellerRepository;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final AdminRepository adminRepository;

    public UserService(UserRepository userRepository, SellerRepository sellerRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
        this.adminRepository = adminRepository;
    }

    public UserResponse getProfile(String email) {
        User user = getUser(email);
        return toResponse(user);
    }

    public UserResponse updateProfile(UserProfileUpdateRequest request, String email) {
        User user = getUser(email);
        user.setName(request.getName());
        user.setContactNo(request.getContactNo());
        userRepository.save(user);
        return toResponse(user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User does not exist"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getContactNo());
    }

    public UserAccessResponse checkAdmin(String email){
        User user = getUser(email);
        boolean isAdmin = adminRepository.existsByUserId(user.getId());
        String sellerStatus = sellerRepository.findByUserId(user.getId()).map(s -> s.getStatus().name()).orElse(null);
        return new UserAccessResponse(email, user.getName(), isAdmin, sellerStatus);
    }
}