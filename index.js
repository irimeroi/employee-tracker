const inquirer = require('inquirer');
const db = require('./db/connection');
require("console.table");

// allows asyn await
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
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update an employee role',
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
                    case 'Add a department':
                        addDepartment()
                        break;
                    case 'Add a role':
                        addRole()
                        break;
                }
            })
};

async function viewAllDepartments() {
    const viewDept = await db.query("SELECT * FROM department");
    console.table(viewDept);
    startApp();
}

async function viewAllRoles() {
    const viewRoles = await db.query("SELECT role.id, role.title, role.salary, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id");
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
}

async function addDepartment() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the name of new deparment',
            name: 'deptName',
        }
    ])
    const addDept = await db.query("INSERT INTO department (name) VALUES (?)", [answer.deptName])
    startApp();
};

async function addRole() {
    const departments = await db.query("select id as value, name as name from department");
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
    console.log('Heyyy it is working');
    startApp();
}

startApp();


// SELECT employee.first_name, manager.first_name FROM employee LEFT JOIN employee AS manager ON employee.manager_id = manager.id;