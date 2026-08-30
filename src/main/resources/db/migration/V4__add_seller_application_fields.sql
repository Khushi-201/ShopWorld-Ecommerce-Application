ALTER TABLE sellers
    ADD COLUMN business_type VARCHAR(50) NOT NULL,
    ADD COLUMN phone_number VARCHAR(20) NOT NULL,
    ADD COLUMN business_address VARCHAR(255) NOT NULL,
    ADD COLUMN description VARCHAR(500),
    ADD COLUMN created_at DATETIME NOT NULL;