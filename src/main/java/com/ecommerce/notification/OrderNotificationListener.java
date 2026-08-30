package com.ecommerce.notification;

import com.ecommerce.Entity.Order;
import com.ecommerce.Event.OrderConfirmedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class OrderNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(OrderNotificationListener.class);
    private final EmailService emailService;

    public OrderNotificationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    @EventListener
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        Order order = event.getOrder();
        log.info("Handling OrderConfirmedEvent for order #{}", order.getId());

        try {
            String to = order.getUser().getEmail();
            String subject = "Order Confirmed - #" + order.getId();
            String body = "Hi " + order.getUser().getName() + ",\n\n"
                    + "Your order #" + order.getId() + " for ₹" + order.getTotalAmount()
                    + " has been confirmed.\n\nThank you for shopping with ShopWorld!";

            emailService.send(to, subject, body);
            log.info("Order confirmation email dispatched for order #{}", order.getId());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order #{}: {}",
                    order.getId(), e.getMessage(), e);
        }
    }
}