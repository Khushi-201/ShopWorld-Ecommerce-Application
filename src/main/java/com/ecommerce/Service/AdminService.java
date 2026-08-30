package com.ecommerce.Service;

import com.ecommerce.DTO.SellerResponse;
import com.ecommerce.Entity.Seller;
import com.ecommerce.Enum.SellerStatus;
import com.ecommerce.Repository.SellerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {

    private final SellerRepository sellerRepository;

    public AdminService(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    public List<SellerResponse> getPendingSellers() {
        return sellerRepository.findByStatus(SellerStatus.PENDING).stream()
                .map(s -> new SellerResponse(s.getId(), s.getBusinessName(), s.getStatus(), s.getDescription()))
                .toList();
    }

    public SellerResponse approveSeller(Long sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller application not found"));
        seller.setStatus(SellerStatus.APPROVED);
        sellerRepository.save(seller);
        return new SellerResponse(seller.getId(), seller.getBusinessName(), seller.getStatus(), seller.getDescription());
    }

    public SellerResponse rejectSeller(Long sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller application not found"));
        seller.setStatus(SellerStatus.REJECTED);
        sellerRepository.save(seller);
        return new SellerResponse(seller.getId(), seller.getBusinessName(), seller.getStatus(), seller.getDescription());
    }
}