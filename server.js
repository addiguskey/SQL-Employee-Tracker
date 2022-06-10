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
mainMenu();

//put the initial promts in a function
function mainMenu() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: [
        //structure each option as a function then call for it in swithc/if statement
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
}
//async await
function viewAllEmp() {
  //db.query
}

function addEmp() {}

function updateEmpRole() {}

functoin;
// db.query("SELECT COUNT(id) AS ", function (err, results) {
//   console.log(results);
// });

// db.query(
//   "SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section",
//   function (err, results) {
//     console.log(results);
//   }
// );
