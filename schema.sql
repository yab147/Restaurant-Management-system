DROP DATABASE IF EXISTS `resturant_db`;
CREATE DATABASE `resturant_db`;
USE `resturant_db`;

CREATE TABLE `users` (
  `userId` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `role` VARCHAR(20) NOT NULL,
  `avatar` VARCHAR(255)
);

CREATE TABLE `restaurant_tables` (
  `tableId` INT AUTO_INCREMENT PRIMARY KEY,
  `number` INT NOT NULL UNIQUE,
  `capacity` INT NOT NULL,
  `status` ENUM('available', 'occupied', 'reserved', 'cleaning') DEFAULT 'available'
);

CREATE TABLE `menu_categories` (
  `categoryId` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(50)
);

CREATE TABLE `menu_items` (
  `itemId` INT AUTO_INCREMENT PRIMARY KEY,
  `categoryId` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `availability` BOOLEAN DEFAULT TRUE,
  `image` VARCHAR(255),
  `prepTime` INT,
  `isPopular` BOOLEAN DEFAULT FALSE,
  `isSpicy` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`categoryId`) REFERENCES `menu_categories`(`categoryId`)
);

CREATE TABLE `orders` (
  `orderId` INT AUTO_INCREMENT PRIMARY KEY,
  `tableId` INT,
  `tableNumber` INT,
  `customerId` INT,
  `customerName` VARCHAR(100) NOT NULL,
  `waiterId` INT,
  `waiterName` VARCHAR(100),
  `type` ENUM('dine-in', 'takeaway', 'delivery') NOT NULL,
  `status` ENUM('pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled') DEFAULT 'pending',
  `orderDate` DATETIME NOT NULL,
  `totalAmount` DECIMAL(10, 2) NOT NULL,
  `notes` TEXT,
  FOREIGN KEY (`tableId`) REFERENCES `restaurant_tables`(`tableId`),
  FOREIGN KEY (`waiterId`) REFERENCES `users`(`userId`)
);

CREATE TABLE `order_items` (
  `orderItemId` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `itemId` INT NOT NULL,
  `itemName` VARCHAR(100) NOT NULL,
  `quantity` INT NOT NULL,
  `unitPrice` DECIMAL(10, 2) NOT NULL,
  `subTotal` DECIMAL(10, 2) NOT NULL,
  `notes` TEXT,
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`) ON DELETE CASCADE,
  FOREIGN KEY (`itemId`) REFERENCES `menu_items`(`itemId`)
);

CREATE TABLE `payments` (
  `paymentId` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `method` ENUM('cash', 'card', 'mobile') NOT NULL,
  `status` ENUM('pending', 'completed', 'refunded') DEFAULT 'pending',
  `paymentDate` DATETIME NOT NULL,
  `transactionId` VARCHAR(100),
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`)
);

CREATE TABLE `reservations` (
  `reservationId` INT AUTO_INCREMENT PRIMARY KEY,
  `customerName` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `dateTime` DATETIME NOT NULL,
  `guests` INT NOT NULL,
  `tableId` INT,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  FOREIGN KEY (`tableId`) REFERENCES `restaurant_tables`(`tableId`)
);

CREATE TABLE `ingredients` (
  `ingredientId` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `threshold` DECIMAL(10, 2) NOT NULL
);

-- Insert initial admin user to ensure login works
INSERT INTO `users` (`name`, `email`, `password`, `phone`, `role`) VALUES
('Admin User', 'admin@holy.et', 'admin123', '+251912345678', 'admin'),
('Abrsh', 'abrsh@email.com', 'Abrsh1234', '+251912345679', 'admin');
