
// establishing dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');

require('dotenv').config()
// creating a database connection to make queries
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.PW,
    database: 'employee_tracker'

});
// when the app is initialized and the connection is successful the startPrompt function is called
db.connect(function (err) {
    if (err) throw err

    startPrompt();
});
// the startPrompt function uses the inquirer package to prompt users to interact with the database
function startPrompt() {
    inquirer.prompt([
        //selection of interactions
        { 
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: [
                'View All Employees?',
                'Add Employee?',
                'Update Employee?',
                'View All Roles?',
                'Add Role?',
                'View All Departments?',
                'Add Department?'
            ]
        }
        //the functions that correspond with the selection
    ]).then(function (val) {
        switch (val.choice) {
            case 'View All Employees?':
                viewEmployees();
                break;

            case 'Add Employee?':
                addEmployee();
                break;

            case 'Update Employee?':
                updateEmployee();
                break;

            case 'View All Roles?':
                viewRoles();
                break;

            case 'Add Role?':
                addRole();
                break;

            case 'View All Departments?':
                viewDepartments();
                break;

            case 'Add Department?':
                addDepartment();
                break;
        }
    })
}
//queries the database and returns data sets for all employees
function viewEmployees() {
    db.query('SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Job Title", d.name AS "Department", r.salary AS "Salary", CONCAT(m.first_name, " ", m.last_name) AS "Manager" FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;',

        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
//queries the database and returns data sets for all role
function viewRoles() {
    db.query('SELECT r.title AS "Job Title", r.id AS "Role ID", d.name AS "Department", r.salary AS "Salary" FROM role r JOIN department d ON r.department_id = d.id;',
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
//queries the database and returns data sets for all departments
function viewDepartments() {
    db.query('SELECT id AS "Department ID", name AS "Department Name" FROM department;',
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
// a function to select a role for an updated or added employee
let roleArray = [];
function selectRole() {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    })
    return roleArray;
}
// a function to select a manager for an added employee
let managerArray = [];
function selectManager() {
    db.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', function (err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managerArray.push(res[i].first_name);
        }
    })
    return managerArray;
}
// prompt to select data input for a new employee
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstname',
            type: 'input',
            message: 'Enter First Name'
        },
        {
            name: 'lastname',
            type: 'input',
            message: 'Enter Last Name'
        },
        {
            name: 'role',
            type: 'list',
            message: 'Choose Role',
            choices: selectRole()
        },
        {
            name: 'choice',
            type: 'rawlist',
            message: 'Select Manager',
            choices: selectManager()
        },
        // database query then adds the new employee to the "employee" table
    ]).then(function (val) {
        let roleId = selectRole().indexOf(val.role) + 1
        let managerId = selectManager().indexOf(val.choice) + 1
        db.query('INSERT INTO employee SET ?',
            {
                first_name: val.firstname,
                last_name: val.lastname,
                manager_id: managerId,
                role_id: roleId
            }, function (err) {
                if (err) throw err
                console.table(val)
                startPrompt()
            })
    })
}

function updateEmployee() {
    //query returns last name and role title of all employees, the inquirer prompts the user to select the employee data they'd like to update
    db.query('SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;', function (err, res) {
        if (err) throw err
        console.log(res);
        inquirer.prompt([{
            name: 'lastName',
            type: 'rawlist',
            choices: function () {
                let lastName = [];
                for (var i = 0; i < res.length; i++) {
                    lastName.push(res[i].last_name);
                }
                return lastName;
            },
            message: 'Employee last name:',
        },
        {
            name: 'role',
            type: 'rawlist',
            message: 'New title:',
            choices: selectRole()
        },
        // a database query updates the employees role title
        ]).then(function (val) {
            console.log(val);
            let roleId = selectRole().indexOf(val.role) + 1;
            db.query('UPDATE employee SET role_id = ? WHERE last_name = ?',
                [roleId, val.lastName],
                function (err) {
                    if (err) throw err
                    console.table(val)
                    startPrompt()
                });
        });
    });
}

function addRole() {
// database query to add new role
    db.query('SELECT id, name FROM department', function (err, res) {
        if (err) throw err;


        inquirer.prompt([
            {
                name: 'DepartmentId',
                type: 'list',
                message: 'Select Department:',
                choices: res.map(function (department) {
                    return {
                        name: department.name,
                        value: department.id
                    };
                })
            },
            {
                name: 'Title',
                type: 'input',
                message: 'Role Title:'
            },
            {
                name: 'Salary',
                type: 'input',
                message: 'Salary:'
            }
        ]).then(function (answers) {

            db.query(
                'INSERT INTO role SET ?',
                {
                    department_id: answers.DepartmentId,
                    title: answers.Title,
                    salary: answers.Salary
                },
                function (err) {
                    if (err) throw err;
                    console.log('Role added successfully!');
                    startPrompt();
                }
            );
        });
    });
}
// database query to add new department
function addDepartment() {

    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Add Department:'
        }
    ]).then(function (res) {
        db.query(
            'INSERT INTO department SET ?',
            {
                name: res.name
            },
            function (err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
}