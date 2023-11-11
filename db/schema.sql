DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    -- decimal for monetary data
    salary DECIMAL (6, 0),
    department_id INT,
    -- references the PK from the department table
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT,
    -- references the employee table
    manager_id INT REFERENCES employee(id) ON DELETE SET NULL,
    -- references the PK from the role table
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);

-- employee table needs a self join because the manager is a reference to the employee table
-- when showing departments = no join
-- to show roles = join to make sure no one sees the dept id

