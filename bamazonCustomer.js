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
    displayAll();
});

function displayAll() {
    // Table Setup
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new Table({
            head: ["ID", "Product", "Department", "Price", "Quanity"],
            colwidths: [10, 50, 50, 10, 15]
        })
        // Looping through table columns and push data to table
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + parseFloat(res[i].price).toFixed(2), res[i].stock_quantity])
        }
        console.log(table.toString());
        choice();
    })
}

function choice() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "What is the ID number of the item you would like to purchase?",
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
            name: "amount",
            message: "How much would you like to buy?",
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
            var quantityDemand = parseInt(response.amount);
            var IDinput = response.itemID;
            order(IDinput, quantityDemand);
        })
}

function order(itemID, amount) {
    connection.query("Select * FROM products WHERE item_id = " + itemID, function (err, res) {
        if (err) throw err;
        if (res[0].stock_quantity >= amount) {
        
            var customerPrice = amount * res[0].price;
            console.log(chalk.cyan("\nThank you for completing your order. The total cost is $" + customerPrice.toFixed(2) + ".\n"));
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: res[0].stock_quantity - amount,
                        product_sales: res[0].product_sales + customerPrice
                    },
                    {
                        item_ID: itemID
                    }
                ],function (err, res){
                    if (err) throw err;
                })
            morePurchases();
        }
        else {
            console.log(chalk.cyan("\nInsufficient quantity, sorry we do not have enough " + res[0].product_name.toUpperCase() + " in stock to complete your order!\n"));
            morePurchases();
        };
    

    });
};

function morePurchases() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to continue shopping?",
            name: "purchases"
        }
    ])
        .then(function (response) {
            if (response.purchases) {
                displayAll();
            }
            else {
                exit();
            }
        });
};

function exit() {
    connection.end();
    console.log(chalk.blue("\nThank you for shopping at THE BAMAZON STORE. Thank you come again!\n"));
}