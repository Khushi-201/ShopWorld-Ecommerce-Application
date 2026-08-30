package com.ecommerce.validator;

import com.ecommerce.Enum.OrderStatus;
import com.ecommerce.exception.InvalidStateException;

import java.util.Map;
import java.util.Set;

public class OrderStatusValidator {

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS = Map.of(
            OrderStatus.CREATED,   Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.SHIPPED,   Set.of(OrderStatus.DELIVERED),
            OrderStatus.DELIVERED, Set.of(OrderStatus.RETURNED),
            OrderStatus.CANCELLED, Set.of(),
            OrderStatus.RETURNED,  Set.of()
    );

    public static void validateTransition(OrderStatus from, OrderStatus to) {
        Set<OrderStatus> allowedTransitions = ALLOWED_TRANSITIONS.get(from);
        if (allowedTransitions == null || !allowedTransitions.contains(to)) {
            throw new InvalidStateException("Cannot transition order from " + from + " to " + to);
        }
    }
}
