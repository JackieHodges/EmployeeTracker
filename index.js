const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: process.env.PASSWORD,
    database: 'company_db',
});

const start = () => {
    inquirer
        .prompt({
            name: 'wantTo',
            type: 'list',
            message: 'What would you like to do?',
            choices: ["View All Employees", "View All Employees by Department", "Add Employee", "Add Department", "Add Role", "Update Employee Role", "Exit"],
        })
        .then((answer) => {
            switch (answer.wantTo) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Employees by Department":
                    console.log("See all employees by department");
                    employeeByDepartment();
                    break;
                case "Add Employee":
                    console.log("Add Employee selected");
                    break;
                case "Add Department":
                    console.log("Add Department selected");
                    break;
                case "Add Role":
                    console.log("Add Role selected");
                    break;
                case "Update Employee Role":
                    console.log("Update employee role selected");
                    break;
                case "Exit":
                    connection.end();
            }
        });
};

const viewAllEmployees = () => {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary FROM role JOIN employee ON employee.role_id = role.id JOIN department ON department.id = role.department_id;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });    
};

const employeeByDepartment = () => {
    inquirer
        .prompt({
            name: 'chosenDepartment',
            type: 'input',
            message: 'Which Department would you like to view the employees of?',
        })
        .then((answer) => {
            let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name FROM role JOIN employee ON employee.role_id = role.id JOIN department ON department.id = role.department_id WHERE ?"
            connection.query(query, { department_name: answer.chosenDepartment }, (err, res) => {
                if (err) throw err;
                console.table(res);
                start();
            })
        })    
};

connection.connect((err) => {
    if (err) throw err;
    console.log("Successful connection");
    start();
});
