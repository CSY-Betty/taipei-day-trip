show databases;
use tdtWeb;
select database();

CREATE TABLE users(
	id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
    );
    
SELECT * FROM users;

TRUNCATE users;
