package com.ecommerce.Repository;

import com.ecommerce.Entity.SubOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubOrderRepository extends JpaRepository<SubOrder, Long> {
    Optional<SubOrder> findById(Long subOrderId);
    List<SubOrder> findBySellerId(Long sellerId);

}
