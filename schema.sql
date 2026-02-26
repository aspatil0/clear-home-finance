-- SQL schema for SocietyHub app

CREATE TABLE societies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL
);

CREATE TABLE maintenance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  societyId INT NOT NULL UNIQUE,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  charges JSON NOT NULL DEFAULT ('[]'),
  dueDay INT NOT NULL DEFAULT 15,
  FOREIGN KEY (societyId) REFERENCES societies(id)
);

CREATE TABLE flats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  flatNumber VARCHAR(255) NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  area INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  societyId INT,
  FOREIGN KEY (societyId) REFERENCES societies(id)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin','admin','treasurer','resident') NOT NULL,
  societyId INT,
  flatNumber VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);


CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceNumber VARCHAR(32) NOT NULL UNIQUE,
  flatId INT NOT NULL,
  societyId INT NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  status ENUM('Unpaid', 'Paid', 'Overdue') NOT NULL DEFAULT 'Unpaid',
  dueDate DATE NOT NULL,
  paidDate DATE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (flatId) REFERENCES flats(id),
  FOREIGN KEY (societyId) REFERENCES societies(id)
);