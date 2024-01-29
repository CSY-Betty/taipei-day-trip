show databases;
use tdtWeb;
select database();

CREATE TABLE bookings(
	id int AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    attraction_id INT,
    date DATE,
    time VARCHAR(255) NOT NULL,
    price INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (attraction_id) REFERENCES attractions(id)
    );
    
SELECT * FROM bookings;

TRUNCATE users;

DELETE FROM bookings WHERE user_id = 11 AND attraction_id = 2;