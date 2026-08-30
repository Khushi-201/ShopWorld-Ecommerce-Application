CREATE TABLE sellers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,

    CONSTRAINT fk_seller_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);