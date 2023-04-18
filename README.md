
# Employee Tracker

This is a command line application built using Node.js and MySQL to manage employee data, including their roles, salaries, departments, and managers. The app allows users to view, update, and add employee data in the database.

- Table of Contents
- Installation
- Usage
- Features
- Database Schema
- Dependencies
- Contributing
- License
- Installation
- To use this app, you will need to have Node.js and MySQL installed on your machine. You can follow these steps to install and set up the app:

Clone the repository to your local machine.
Navigate to the cloned directory in your terminal.
Run npm install to install the dependencies.
Create a MySQL database using the provided schema (see Database Schema).
Update the connection object in the db.js file with your MySQL database connection details.
Run node app.js to start the application.

## Repository

<https://github.com/Anthony-A-Perez/employeeTracker>

## Demo

<https://drive.google.com/file/d/1S5WGXFiSF1yaqkjCdESx9db0aWOebDA2/view>

## Usage

The Employee Tracker is a command line app that provides the following functionalities:

- View employees, roles, departments, and managers.
- Update employee roles.
- Add new employees, roles, and departments.

The app uses inquirer to prompt the user for input and MySQL queries to interact with the database. Users can navigate through the different functionalities using the command line prompts.

## Features

The Employee Tracker app provides the following features:

- View employees: Displays a formatted table of employee data, including employee IDs, first names, last names, job titles, departments, salaries, and managers.
- Update employee roles: Allows users to select an employee and update their role from a list of available roles.
- Update employee managers: Allows users to select an employee and update their manager from a list of available managers.
- View roles: Displays a formatted table of role data, including role IDs, titles, departments, and salaries.
- View departments: Displays a formatted table of department data, including department IDs and names.
- Add employee: Prompts users to enter employee details such as first name, last name, role, and manager, and adds the employee to the database.
- Add role: Prompts users to enter role details such as title, salary, and department, and adds the role to the database.
- Add department: Prompts users to enter department details such as name, and adds the department to the database.

## Database Schema

The Employee Tracker app uses the following database schema:

- department table with columns:
  - id (INT, primary key, auto-increment)
  - name (VARCHAR(20))

- role table with columns:
  - id (INT, primary key, auto-increment)
  - title (VARCHAR(20))
  - salary (DECIMAL)
  - department_id (INT, foreign key referencing department.id)

- employee table with columns:
  - id (INT, primary key, auto-increment)
  - first_name (VARCHAR(20))
  - last_name (VARCHAR(20))
  - manager_id (INT, foreign key referencing employee.id)
  - role_id (INT, foreign key referencing role.id)
