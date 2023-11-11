INSERT INTO department (name)
VALUES ('IT', 'Finance', 'Tax', 'Admin');

INSERT INTO role (title, salary, department_id)
VALUES
('Facilities Coordinator', 100000, 4),
('Administrative Assistant', 80000, 4),
('Data Scientist', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Bookkeper', 125000, 2),
('Tax Manager', 250000, 3),
('Tax Manager', 190000, 3);

INSERT INTO employee (first_name, last_name, title, role_id, manager_id)
VALUES
('Daenerys', 'Targaryen', 1, null),
('Jon', 'Snow', 2, null),
('Jamie', 'Lannister', 3, null),
('Arya', 'Stark', 4, null),
('Sansa', 'Stark', 5, null),
('Tyrion', 'Lannister', 6, null),
('Drogon', 'Targaryen', 7, null),
('Rhaegal', 'Targaryen', 8, null);