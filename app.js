

const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');

require('dotenv').config()

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.PW,
    database: 'employee_tracker'

});

db.connect(function(err) {
    if (err) throw err
    console.log('connected');
    startPrompt();
});

function startPrompt() {
    inquirer.prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: [
            'View All Employees?',
            'View All Employees By Role?',
            'View All Employees By Department?',
            'Update Employee?',
            'Add Employee?',
            'Add Role?',
            'Add Department?'
        ]
    }
    ]).then(function(val) {
        switch (val.choice) {
            case 'View All Employees?':
                viewEmployees();
                break;

            case 'View All Employees By Role?':
                viewRoles();
                break;
                
            case 'View All Employees By Department?':
                viewDepartments();
                break;
            case 'Update Employee':
                updateEmployee();
                break;
            case 'Add Role':
                updateRole();
                break;
            case 'Add Department':
                addDepartment();
                break;                
        }
    })
}

function viewEmployees() {
    db.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS Manager FROM employee INNER JOIN role on role.id = employee.role.id INNER JOIN department on department.id = role.department_id LEFT JOIN employee ON employee.manager_id = id;',
    )
}

function viewDepartments() {
    db.query('SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;',
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}