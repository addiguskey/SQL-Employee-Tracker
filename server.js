const inquirer = require("inquirer");
const mysql = require("mysql2");
const fs = require("fs");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "udon",
    databse: "books_db",
  },
  console.log(`Connected to the books_db database.`)
);

// db.query("SELECT COUNT(id) AS ", function (err, results) {
//   console.log(results);
// });

// db.query(
//   "SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section",
//   function (err, results) {
//     console.log(results);
//   }
// );

inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employees",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
    name: "mainMenu",
  },
]);
