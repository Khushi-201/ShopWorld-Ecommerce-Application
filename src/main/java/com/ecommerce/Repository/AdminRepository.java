package com.ecommerce.Repository;

import com.ecommerce.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByUserId(Long userId);
}
