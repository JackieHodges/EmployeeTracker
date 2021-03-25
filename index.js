const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
let departmentOptions = [];
let roleOptions = [];

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
                    createEmployee();
                    break;
                case "Add Department":
                    console.log("Add Department selected");
                    addDepartment();
                    break;
                case "Add Role":
                    console.log("Add Role selected");
                    addRole();
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

const createEmployee = () => {
    inquirer
        .prompt([{
            name: 'employeeFirstName',
            type: 'input',
            message: 'What is the first name of the new employee?',
        },
        {
            name: 'employeeLastName',
            type: 'input',
            message: 'What is the last name of the new employee?',
        },
        {
            name: 'employeeDepartment',
            type: 'input',
            message: 'What is the department of the new employee?',
        },
        {
            name: 'employeeRole',
            type: 'input',
            message: 'What is the role of the new employee?',
        },
        {
            name: 'employeeManager',
            type: 'input',
            message: 'Who is the manager of the new employee?',
        }])
        .then((answer) => {
            let query2 = connection.query("SELECT id FROM role WHERE title = ?", [answer.employeeRole], (err, res) => {
                let query = "INSERT INTO employee SET ?";
                connection.query(query,
                    [
                        {
                            first_name: answer.employeeFirstName,
                            last_name: answer.employeeLastName,
                            role_id: res[0].id
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log("New Employee Added");
                        start();
                    }
                )
            });
        })
};

const addDepartment = () => {
    inquirer
        .prompt({
            name: 'addedDepartment',
            type: 'input',
            message: 'What is the name of the department you would like to add?',
        })
        .then((answer) => {
            let query = "INSERT INTO department SET ?"
            connection.query(query, { department_name: answer.addedDepartment }, (err, res) => {
                if (err) throw err;
                console.log(answer.addedDepartment + " has been added.");
                start();
            })
        })
};

connection.connect((err) => {
    if (err) throw err;
    console.log("Successful connection");
    start();
});
