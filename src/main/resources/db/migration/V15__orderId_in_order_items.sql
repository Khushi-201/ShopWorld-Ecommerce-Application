ALTER TABLE order_items
    ADD COLUMN order_id BIGINT NOT NULL AFTER id;

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE;