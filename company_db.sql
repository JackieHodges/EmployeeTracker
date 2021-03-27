DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT, 
	department_name VARCHAR (30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT, 
	title VARCHAR (30) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL,
    INDEX department_ind (department_id),
    FOREIGN KEY (department_id)
		REFERENCES department(id)
        ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL,
    INDEX role_ind (role_id),
	FOREIGN KEY (role_id)
		REFERENCES role(id)
        ON DELETE CASCADE,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (department_name) VALUES 
("Human Resources"),
("IT"),
("Accounting");

INSERT INTO role (title, salary, department_id) VALUES
("HR Buisness Partner", 100000, 1),
("HR Associate", 70000, 1),
("HR Intern", 50000, 1),
("Product Manger", 150000, 2),
("Senior Developer", 110000, 2),
("Junior Developer", 85000, 2),
("Senior Accountant", 110000, 3),
("Accountant", 90000, 3),
("Accounting Intern", 65000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Jackie", "Hodges", 6, 2),
("Bryce", "Pederson", 7, 3);