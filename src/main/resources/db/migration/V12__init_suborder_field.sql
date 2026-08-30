CREATE TABLE sub_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_sub_orders_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_orders_seller FOREIGN KEY (seller_id) REFERENCES sellers(id)
);

ALTER TABLE order_items DROP FOREIGN KEY fk_order_items_order;
ALTER TABLE order_items DROP COLUMN order_id;
ALTER TABLE order_items ADD COLUMN sub_order_id BIGINT NOT NULL;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_sub_order
    FOREIGN KEY (sub_order_id) REFERENCES sub_orders(id) ON DELETE CASCADE;

ALTER TABLE orders DROP COLUMN status;
ALTER TABLE orders ADD COLUMN shipping_address VARCHAR(500) NOT NULL;