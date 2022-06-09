INSERT INTO department (name)
VALUES  ("Admin"),
        ("Sales"),
        ("Accounting"),
        ("Coorporate");

INSERT INTO role (title, salary, department_id)
VALUES  ("Regional Manager", 90000, 1), 
        ("Receptionist", 45000, 1), 
        ("Sales Lead", 80000, 2), 
        ("Salesperson", 75000, 2), 
        ("Account Manager", 75000, 3), 
        ("Accountant", 72000, 3), 
        ("VP of Sales", 100000, 4), 
        ("CFO", 300000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Michael", "Scott", 1, NULL), 
        ("Pam", "Beesly", 2, 1),
        ("Dwight", "Schrute", 3, 1),
        ("Jim", "Halpert", 4, 1),
        ("Oscar", "Martinez", 5, 1),
        ("Angela", "Martin", 6, 1),
        ("Jan", "Levinson", 7, NULL), 
        ("David", "Wallace", 8, NULL);