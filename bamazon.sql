DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
product_name  VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
product_sales DECIMAL(10,2) NOT NULL DEFAULT 0.00,
PRIMARY KEY(item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (393917,"KitchenAid Mixer", "Home and Kitchen", 239.99, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Samsung - 65" Class - LED - 7 Series',"TV and Home Theater", 699.99, 125);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Aquaman Blu Ray", "Movies TV Shows and Music", 14.99, 215);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Venom Blu Ray", "Movies TV Shows and Music", 15.99, 112);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Fantastic Beasts Blu Ray", "Movies TV Shows and Music", 14.99, 48);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("iRobot - Roomba 690 App-Controlled Robot Vacuum", "Vacuum Cleaners & Floor Care", 229.99, 40);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Samsung - 65" Class - LED - Q80 Series', "TV and Home Theater", 1999.99, 25);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Apple Watch S4 44mm Space Black Stainless Steel", "Computers and other Technology", 799.00, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Apple - 12.9" iPad Pro New with Wi-Fi + Cellular', "Computers and other Technology", 14.99, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Jurassic World: Fallen Kingdom Blu Ray", "Movies TV Shows and Music", 19.99, 35);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Tag", "Movies TV Shows and Music", 9.99, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Crazy Rich Asians", "Movies TV Shows and Music", 9.99, 45);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("A Night at the Opera", "Movies TV Shows and Music", 4.99, 15);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Duck Soup", "Movies TV Shows and Music", 14.99, 10);

SELECT * FROM products;

CREATE TABLE departments (
department_id INTEGER(10) NOT NULL auto_increment ,
department_name  VARCHAR(50) NOT NULL,
overhead_costs  DECIMAL(10,2),
-- total_sales DECIMAL(10,2),
PRIMARY KEY(department_id)
);

INSERT INTO departments(department_name, overhead_costs) VALUES ("Home and Kitchen", 150000);
INSERT INTO departments(department_name, overhead_costs) VALUES ("TV and Home Theater", 100000);
INSERT INTO departments(department_name, overhead_costs) VALUES ("Movies TV Shows and Music", 250000);
INSERT INTO departments(department_name, overhead_costs) VALUES ("Computers and other Technology", 1000000);
INSERT INTO departments(department_name, overhead_costs) VALUES ("Vacuum Cleaners & Floor Care", 1000000);

-- ALTER TABLE products ADD COLUMN product_sales DOUBLE(10,2) DEFAULT 0.00 AFTER stock_quantity;



SELECT * FROM departments;

-- update department  set total_sales = (select sum(total_sales) from department d inner join products p on d.department_name= p.department_name); --

-- profut =  sales - over head cost --

-- select dept_id, department_name, over_ hesd product sales , totalsales -ovcost as total profit join on p and d on dept name  grp by dept name -- 

-- "update products p, department d set d.total_sales =? where p.item_id=? and d.department_name = p.department_name"; --
