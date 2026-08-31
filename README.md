# ShopWorld

ShopWorld is a full-stack ecommerce application built for a multi-role marketplace flow: customer, seller, and admin. The system allows users to browse products, add items to a cart, place orders, manage addresses, and lets sellers manage inventory and product listings. Admins can review seller applications and monitor the platform.

## High-Level Architecture

The project follows a layered architecture with a React frontend and a Spring Boot backend connected to MySQL and Redis.

### Backend
- Java 17
- Spring Boot 3 / Spring Security
- Spring Data JPA
- JWT-based authentication
- Flyway for database migrations
- Redis for caching and performance improvement
- AWS S3 for product image upload/storage
- SMTP mail service for order confirmations

### Frontend
- React + Vite
- Axios for API communication
- React Router for navigation
- Tailwind CSS for styling
- localStorage-based JWT handling for session persistence

### Data and persistence
- MySQL database for core business data
- Flyway to manage schema migrations
- Redis cache for frequently used data
- Separate logical tables for users, admins, sellers, products, categories, cart, orders, and addresses

### Role-based design
The app does not use a single user role column. Instead, role is derived from related tables:
- Admins are identified through the admin table by user_id
- Sellers are identified through the sellers table and their status
- Customers are regular users without seller/admin records

This keeps the auth model flexible and avoids storing a hardcoded role in the user record.

## Technology Stack

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- Redis
- Flyway
- JWT (jjwt)
- AWS SDK for S3
- Jakarta Mail / SMTP

### Frontend
- React
- Vite
- Axios
- React Router DOM
- Tailwind CSS
- JWT decode utility

## Project Workflow

### 1. User Workflow
- User registers and logs in
- JWT token is created and stored in browser storage
- User can browse products, view categories, and search catalog items
- User can add products to cart, select delivery address, and place order
- User can view orders and details
- User can manage their profile and addresses

### 2. Seller Workflow
- Seller applies through the seller registration flow
- Admin reviews the seller request
- Approved seller can upload and manage products
- Seller can update stock and product details
- Seller can view their own product list and category-based filtering
- Seller can view and manage order-related activity for their products

### 3. Admin Workflow
- Admin logs in with elevated authority
- Admin reviews pending seller applications
- Admin approves or rejects sellers
- Admin may manage platform-level operations in the admin dashboard
- Admin authority is enforced by Spring Security using the derived admin role

### 4. Order Lifecycle
- Customer adds items to cart
- Customer selects a saved address
- Order is created from cart items
- Products are checked against available stock
- Order item totals are calculated and saved
- Order confirmation email is triggered for the customer
- Order can be retrieved later from the user’s order list

## Directory Structure

- backend service: Spring Boot app in the root project folder
- frontend: React app in the frontend folder
- src/main/java: Java backend classes
- src/main/resources/db/migration: Flyway schema scripts
- src/main/resources/application.yaml: Spring app config
- frontend/src: React pages, components, routes, and API wrappers

## Prerequisites

Before running the project, make sure you have:
- Java 17+
- Maven
- MySQL server running
- Redis server running
- Node.js and npm installed
- A Gmail app password for SMTP if mail is enabled

## Environment Configuration

Create and configure your environment variables before running the backend, especially for SMTP and any secret values:

Windows PowerShell:

```powershell
$env:MAIL_USERNAME="your_admin_email@gmail.com"
$env:MAIL_PASSWORD="your_16_char_gmail_app_password"
```

The app reads SMTP credentials from environment variables or Spring config to avoid committing secrets in source control.

## Run the Backend

From the project root:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
./mvnw.cmd spring-boot:run
```

The backend usually runs on:
- http://localhost:8081

## Run the Frontend

From the frontend folder:

```bash
npm install
npm run dev
```

The frontend usually runs on:
- http://localhost:5173

## Database Setup

Make sure MySQL is running and the database exists. The project uses Flyway migrations automatically, so schema updates are applied on application startup.

Example database config in application.properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

## Redis Setup

Redis should be running and reachable by the backend. The app is configured to use Redis for caching.

## Notes

- Product images are handled via AWS S3
- Security uses JWT with role-based access control
- Public product listing endpoints are separate from seller-specific and admin-specific routes
- The app uses Flyway for database evolution and safer schema management

## Future Improvements

- Full payment integration
- Better recommendation engine
- More advanced analytics dashboard
- Advanced search indexing
- Discount and coupon engine
- Real-time notifications and messaging

## Summary

ShopWorld is a complete ecommerce marketplace with a buyer, seller, and admin lifecycle. It combines a modern React frontend with a secure Spring Boot backend, persistent data management in MySQL, Redis-based caching, and mail-based order notifications.

