-- creatin users tables of users to store basic information
-- table name edge_device
CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_created VARCHAR(255) NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

-- CREATING TABLE FOR THE USER ADDRESS 
CREATE TABLE addresses (
  address_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id INT,
  phone_number VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  country VARCHAR(200) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE
  SET
    NULL
);


CREATE TABLE otps (
  otp_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id INT,
  email VARCHAR(200) NOT NULL,
  otp VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET  NULL
 
)