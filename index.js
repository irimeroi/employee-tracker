const inquirer = require('inquirer');
const db = require('./db/connection');
require("console.table");

// allows async await
const utils = require('util');
db.query = utils.promisify(db.query);

// starts the program
function startApp() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'userChoice',
                choices:
                    ['View all departments',
                        'View all roles',
                        'View all employees',
                        'View employees by manager',
                        'View employees by department',
                        'View budget by department',
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update an employee role',
                        'Update an employee manager',
                        'Delete a department',
                        'Delete a role',
                        'Delete an employee',
                        'Quit'],
            }]).then((answer) => {
                switch (answer.userChoice) {
                    case 'View all departments':
                        viewAllDepartments()
                        break;
                    case 'View all roles':
                        viewAllRoles()
                        break;
                    case 'View all employees':
                        viewAllEmployees()
                        break;
                    case 'View employees by manager':
                        employeesByManager()
                        break;
                    case 'View employees by department':
                        employeesByDepartment()
                        break;
                    case 'View budget by department':
                        sumSalaries()
                        break;
                    case 'Add a department':
                        addDepartment()
                        break;
                    case 'Add a role':
                        addRole()
                        break;
                    case 'Add an employee':
                        addEmployee()
                        break;
                    case 'Update an employee role':
                        updateEmployee()
                        break;
                    case 'Update an employee manager':
                        updateManagers()
                        break;
                    case 'Delete a department':
                        deleteDeparment()
                        break;
                    case 'Delete a role':
                        deleteRole()
                        break;
                    case 'Delete an employee':
                        deleteEmployee()
                        break;
                    case 'Quit':
                        db.end();
                }
            })
};

async function viewAllDepartments() {
    const viewDept = await db.query("SELECT * FROM department");
    console.table(viewDept);
    startApp();
}

async function viewAllRoles() {
    const viewRoles = await db.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id");
    console.table(viewRoles);
    startApp();
};

async function viewAllEmployees() {
    const viewEmpl = await db.query(`SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", role.title, department.name AS department, role.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`);
    console.table(viewEmpl)
    startApp();
};

async function employeesByManager () {
    const byManager = await db.query(`SELECT concat(employee.first_name, " ", employee.last_name) AS employee, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.manager_id IS NOT NULL`);
    console.table(byManager)
    startApp();
 };


 async function employeesByDepartment() {
    const byDepartment = await db.query(`SELECT employee.id, concat(employee.first_name, " ", employee.last_name) AS employee, department.name AS department, role.title AS role FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`);
    console.table(byDepartment)
    startApp();
 };

async function sumSalaries() {
    const allDeptSum = await db.query('SELECT role.department_id AS id, department.name AS name, SUM(role.salary) AS budget FROM department LEFT JOIN role ON department.id = role.department_id GROUP BY department.id');
    console.table(allDeptSum);
    startApp();
};

async function addDepartment() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the name of new deparment',
            name: 'deptName',
        }
    ])
    await db.query("INSERT INTO department (name) VALUES (?)", [answer.deptName])
    console.log('Department succesfully added!');
    startApp();
};

async function addRole() {
    const departments = await db.query("SELECT id AS value, name AS name FROM department");
    const { roleName, roleSalary, roleDept } = await inquirer
    .prompt([
        {
            type: 'input',
            message: 'Please enter the name of the new role',
            name: 'roleName',
        }, {
            type: 'input',
            message: 'Please enter the salary for the new role',
            name: 'roleSalary',
        }, {
            type: 'list',
            message: 'Please select which department the new role belongs to',
            name: 'roleDept',
            choices: departments,
        }, 
    ]);
    await db.query("INSERT INTO role (title, salary, department_id) values (?,?,?)", [roleName, roleSalary, roleDept]);
    console.log('Role succesfully added!');
    startApp();
}

async function addEmployee() {
    const roleName = await db.query("SELECT id AS value, title AS name FROM role");
    const managerName = await db.query("SELECT id AS value, concat(first_name,' ',last_name) AS name FROM employee");
    managerName.push({ value: null, name: 'No manager'});
    const answer = await inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the employee\'s first name',
            name: 'firstName',
        }, {
            type: 'input',
            message: 'Please enter the employee\'s last name',
            name: 'lastName',
        }, {
            type: 'list',
            message: 'Please enter the employee\'s role',
            name: 'emplRole',
            choices: roleName,
        }, {
            type: 'list',
            message: 'Please enter the employee\'s manager',
            name: 'emplManager',
            choices: managerName,
        }
    ])
    const managerId = answer.emplManager === 'No manager' ? null : answer.emplManager;
    await db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [answer.firstName, answer.lastName, answer.emplRole, managerId]);
    console.log('Employee succesfully added!');
    startApp();
};

async function updateEmployee() {
    const allEmployees = await db.query("SELECT id AS value, concat (first_name, ' ', last_name) AS name FROM employee");
    const allRoles = await db.query("SELECT id AS value, title AS name FROM role");
    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'Please choose which employee you would like to update',
            name: 'updtEmployee',
            choices: allEmployees,
        }, {
            type: 'list',
            message: 'Please choose the employee\'s new role:',
            name: 'newRole',
            choices: allRoles,
        }
    ]);
    await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.newRole, answer.updtEmployee]);
    console.log('Employee succesfully updated!');
    startApp();
};

async function updateManagers() {
    const employees = await db.query("SELECT id AS value, concat(first_name,' ',last_name) AS name FROM employee");
    const allManagers = await db.query("SELECT id AS value, concat(first_name,' ',last_name) AS name FROM employee");
    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'Please select an employee',
            name: 'employeesNames',
            choices: employees,
        }, {
            type: 'list',
            message: 'Please select a new manager',
            name: 'managersNames',
            choices: allManagers,
        }
    ]);
    await db.query("UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?", [answer.managersNames, answer.employeesNames]);
    console.log('Manager succesfully updated!');
    startApp();
};

async function deleteDeparment() {
    const allDepartments = await db.query('SELECT id AS value, department.name FROM department');
    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'Please select which department you would like to delete',
            name: 'deleteDept',
            choices: allDepartments,
        }
    ]);
    await db.query("DELETE FROM department WHERE id = ?", [answer.deleteDept]);
    console.log('Department succesfully deleted!');
    startApp();
};

async function deleteRole() {
    const allRoles = await db.query('SELECT id AS value, title AS name FROM role');
    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'Please select which role you would like to delete',
            name: 'deleteRole',
            choices: allRoles,
        }
    ]);
    await db.query("DELETE FROM role WHERE id = ?", [answer.deleteRole]);
    console.log('Role succesfully deleted!');
    startApp();
};

async function deleteEmployee() {
    const allEmpl = await db.query(`SELECT id AS value, concat (first_name, ' ', last_name) AS name FROM employee`);
    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'Please select which employee you would like to delete',
            name: 'deleteEmpl',
            choices: allEmpl,
        }
    ]);
    await db.query("DELETE FROM employee WHERE id = ?", [answer.deleteEmpl]);
    console.log('Employee succesfully deleted!');
    startApp();
};

startApp();