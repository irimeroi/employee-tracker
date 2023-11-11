const inquirer = require('inquirer');

inquirer
.prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'userChoices',
        choices: ['View all departments', 'View all roles', 'View all employees',
        'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    }, {
        type: 'input',
        message: '',
        name: '',
    }, {
        type: 'input',
        message: '',
        name: '',
    }, {
        type: 'input',
        message: '',
        name: '',
    }, {
        type: 'input',
        message: '',
        name: '',
    }, 
]).then(function (answer) {
    console.log(answer);
});