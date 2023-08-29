show databases;
use tdtweb;
select database();

CREATE TABLE attractions(
	id int PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    description VARCHAR(255),
    address VARCHAR(255),
    transport VARCHAR(255),
    mrt VARCHAR(255),
    lat int,
    lng int,
    images,
    
);

RENAME DATABASE tdtweb to tdtWeb;