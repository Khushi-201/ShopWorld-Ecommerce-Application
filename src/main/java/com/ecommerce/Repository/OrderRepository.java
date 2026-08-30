package com.ecommerce.Repository;

import com.ecommerce.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    boolean existsByDeliveryAddressId(Long addressId);
}
