require('dotenv').config();
var keys = require("./connection.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var chalk = require("chalk");

var connection = mysql.createConnection({
    host: keys.host,
    user: keys.user,
    password: keys.password,
    port: keys.port,
    database: "bamazon_db",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    menuOptionsSup();
});

// MENU ITEMS
function menuOptionsSup() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Please select an option:",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ])
        .then(function (response) {

            switch (response.choice) {
                case "View Product Sales by Department":
                    departmentSales();
                    break;
                case "Create New Department":
                    newDepartment();
                    break;
                case "Exit":
                    exit();
                    break;
            }
        })
}
// SALES BY DEPT
function departmentSales() {
    connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS total_products_sales, SUM(products.product_sales) - overhead_costs AS difference FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_name, department_id, overhead_costs", function (err, res) {
        
        var table = new Table({
            head: ["ID", "Department", "Over Head Costs", "Product Sales", "Total Profits"],
            colwidths: [10, 25, 25, 25, 25]
        })
        
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, "$" + res[i].overhead_costs.toFixed(2), "$" + res[i].total_products_sales.toFixed(2), "$" + res[i].difference])
        }
        console.log(table.toString());
        menuOptionsSup();
    })
}

// CREATE NEW DEPT
function newDepartment() {
    connection.query("SELECT * FROM departments", function (err, res) {
        
        var table = new Table({
            head: ["ID", "Department", "Over Head Costs"],
            colwidths: [10, 25, 25]
        })
        
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, "$" + res[i].overhead_costs.toFixed(2)])
        }
        console.log(table.toString());

        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What department would you like to create?"
            },
            {
                type: "input",
                name: "cost",
                message: "What is the over head cost of running this department?",
                validate: function (value) {
                    if (!isNaN(value)) {
                        return true;
                    }
                    else {
                        console.log(chalk.red("Please enter a number."));
                        return false;
                    }
                }
            },
        ]).then(function (response) {
            connection.query(
                "INSERT INTO departments SET ?",
                [{
                    department_name: response.name,
                    overhead_costs: response.cost,
                }],
                function (err, res) {
                    if (err) throw err
                    console.log(chalk.cyan(response.name + " has been added to the store."))
                    menuOptionsSup();
                }
            )
        })
    })
}

// QUIT
function exit() {
    connection.end();
    console.log("Thank you come again!");
}