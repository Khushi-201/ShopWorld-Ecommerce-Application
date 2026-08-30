package com.ecommerce.Controller;

import com.ecommerce.DTO.OrderResponse;
import com.ecommerce.DTO.SellerResponse;
import com.ecommerce.Enum.OrderStatus;
import com.ecommerce.Service.AdminService;
import com.ecommerce.Service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final OrderService orderService;

    public AdminController(AdminService adminService, OrderService orderService) {
        this.adminService = adminService;
        this.orderService = orderService;
    }

    @GetMapping("/pending")
    public List<SellerResponse> pendingApplications() {
        return adminService.getPendingSellers();
    }

    @PostMapping("/{sellerId}/approve")
    public SellerResponse approve(@PathVariable Long sellerId) {
        return adminService.approveSeller(sellerId);
    }

    @PostMapping("/{sellerId}/reject")
    public SellerResponse reject(@PathVariable Long sellerId) {
        return adminService.rejectSeller(sellerId);
    }

    @PutMapping("/deliver/{orderId}")
    public OrderResponse deliverOrder(@PathVariable Long orderId){
        return orderService.updateStatus(orderId, OrderStatus.DELIVERED);
    }
}