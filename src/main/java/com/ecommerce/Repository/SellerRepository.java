package com.ecommerce.Repository;

import com.ecommerce.Entity.Seller;
import com.ecommerce.Enum.SellerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    List<Seller> findByStatus(SellerStatus status);

    @Query("Select s FROM Seller s where s.user.email = :email")
    Optional<Seller> findByUserEmail(String email);
}
