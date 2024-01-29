show databases;
CREATE DATABASE tdtWeb;
use tdtWeb;
select database();


CREATE TABLE attractions(
	id int PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    transport TEXT,
    mrt VARCHAR(255),
    lat FLOAT,
    lng FLOAT,
    images JSON
);

SELECT * FROM attractions;

-- 修改欄位格式 
ALTER TABLE attractions MODIFY COLUMN images JSON;

-- 清空資料
TRUNCATE TABLE attractions;


SELECT mrt, COUNT(name) AS acctraction_count 
FROM attractions 
GROUP BY mrt 
ORDER BY acctraction_count DESC
LIMIT 40;