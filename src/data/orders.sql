show databases;
use tdtWeb;
select database();

CREATE TABLE orders(
	id int AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    user_id INT,
    order_description TEXT NOT NULL,
    contact VARCHAR(255) NOT NULL,
    payment_status VARCHAR(255) DEFAULT '未付款' NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );
        
ALTER TABLE orders MODIFY COLUMN payment_status VARCHAR(255) DEFAULT '未付款' NOT NULL;
ALTER TABLE orders MODIFY COLUMN order_description TEXT NOT NULL;
SELECT * FROM orders;

UPDATE orders SET payment_status = '已付款' WHERE order_id = 20231003154038;
DROP TABLE orders;