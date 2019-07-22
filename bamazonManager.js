require('dotenv').config();
var keys = require("./keys.js");
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
    menuOptions();
});

// MENU ITEMS
function menuOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Please select a task from the options below:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ])
        .then(function (response) {
            switch (response.options) {
                case "View Products for Sale":
                    displayAll();
                    break;
                case "View Low Inventory":
                    displayInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "Exit":
                    exit();
                    break;
            }
        })
}

// PRODUCTS FOR SALE
function displayAll() {

    connection.query("SELECT * FROM products", function (err, res) {
        // Table column headings and widths Setup Functions
        var table = new Table({
            head: ["ID", "Product", "Department", "Price", "Quanity"],
            colwidths: [10, 50, 50, 10, 15]
        })
        
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + parseFloat(res[i].price).toFixed(2), res[i].stock_quantity])
        }
        console.log(table.toString());
        menuOptions();
    })
}
// CRITICAL INVENTORY ITEMS
function displayInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        
        var table = new Table({
            head: ["ID", "Product", "Department", "Price", "Quanity"],
            colwidths: [10, 25, 25, 10, 14]
        })
       
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + parseFloat(res[i].price).toFixed(2), res[i].stock_quantity])
        }
        console.log(table.toString());
        menuOptions();
    })
}

// ADD ITEMS INVENTORY
function addInventory() {
    inquirer.prompt([
        {
            name: "addID",
            type: "input",
            message: "What item would you like to add stock to?"
        },
        {
            name: "addQ",
            type: "input",
            message: "How much would you like to add to the stock quantity?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                else {
                    console.log(chalk.red("Please enter a number."));
                    return false;
                }
            }
        }
    ]).then(function (response) {
        
        connection.query("SELECT * FROM products", function (err, res) {
            var chosenItem;
            
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(response.addID)) {
                    chosenItem = res[i];
                }
            }
            
            var updatedStock = parseInt(chosenItem.stock_quantity) + parseInt(response.addQ);
            console.log(chalk.magenta("\nYour item is restocked.\n"));
            
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: updatedStock
            }, {
                item_id: response.addID
            }], function (err, res) {
                if (err) throw err;
                else {
                    menuOptions();
                }
            });
        });
    });
};

// NEW PRODUCT ADDITIONS
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "What product would you like to add?"

        },
        {
            type: "list",
            name: "productDepartment",
            message: "Which department does the product belong to?",
            choices: ["Home and Kitchen", "TV and Home Theater", "Movies TV Shows and Music", "Computers and other Technology", "Vacuum Cleaners & Floor Care", "Other"]
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of the product?",
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
        {
            type: "input",
            name: "quantity",
            message: "How much quantity would you like to add?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                else {
                    console.log(chalk.red("Please enter a number."));
                    return false;
                }
            }
        }
    ])
        .then(function (response) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: response.productName,
                    department_name: response.productDepartment,
                    price: response.price,
                    stock_quantity: response.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Item successfully added");
                    displayAll();
                }
            );
        })
}

// QUIT
function exit() {
    connection.end();
    console.log("Thank you come again!");
}
