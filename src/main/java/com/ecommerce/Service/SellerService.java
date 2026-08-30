package com.ecommerce.Service;

import com.ecommerce.DTO.SellerRequest;
import com.ecommerce.DTO.SellerResponse;
import com.ecommerce.Entity.Seller;
import com.ecommerce.Entity.User;
import com.ecommerce.Repository.SellerRepository;
import com.ecommerce.Repository.UserRepository;
import com.ecommerce.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import com.ecommerce.Enum.SellerStatus;

import java.time.LocalDateTime;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    public SellerService(SellerRepository sellerRepository, UserRepository userRepository){
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
    }
    public SellerResponse apply(SellerRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (sellerRepository.existsByUserId(user.getId())) {
            throw new RuntimeException(
                    "Seller application already exists for this user");
        }

        Seller seller = new Seller();

        seller.setUser(user);
        seller.setBusinessName(request.getBusinessName());
        seller.setBusinessType(request.getBusinessType());
        seller.setBusinessAddress(request.getBusinessAddress());
        seller.setDescription(request.getDescription());

        seller.setStatus(SellerStatus.PENDING);
        seller.setCreatedAt(LocalDateTime.now());

        sellerRepository.save(seller);
        return new SellerResponse(seller.getId(), seller.getBusinessName(), seller.getStatus(), seller.getDescription());
    }

    public String showStatus(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller application not found"));
        return seller.getStatus().toString();
    }
}
