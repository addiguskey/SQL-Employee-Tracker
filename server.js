const inquirer = require("inquirer");
const mysql = require("mysql2");
const fs = require("fs");
const util = require("util");
const consTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "udon",
    database: "office_db",
  },
  console.log(`Connected to the office_db database.`)
);
const query = util.promisify(db.query).bind(db);
mainMenu();

//put the initial promts in a function
function mainMenu() {
  inquirer
    .prompt([
      {
        name: "mainMenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
          //structure each option as a function then call for it in swithc/if statement
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update Employee Role",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.mainMenu) {
        case "View All Departments":
          viewAllDept();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmp();
          break;
        case "Add a Department":
          addDept();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmp();
          break;
        case "Update Employee Role":
          updateEmpRole();
          break;
        case "Quit":
          db.end();
          console.log(
            "\n You have exited the employee management program. Have a Great Day! \n"
          );
          return;
        default:
          break;
      }
    });
}
//async await
//viw All Department- shows dep names and ids
const viewAllDept = async () => {
  try {
    const res = await query(`SELECT* FROM department ORDER BY d_id ASC`);
    console.table("\n", res, "\n");
    mainMenu();
  } catch (error) {
    console.error(err);
  }
};
//view all roles
const viewAllRoles = async () => {
  // query(
  //   `SELECT role.r_id AS 'id', role.title, role.salary, department.d_name AS 'department' FROM role JOIN department ON role.department_id = department.d_id ORDER BY role.r_id ASC`,
  //   (err, res) => {
  //     if (err) throw err;
  // console.table("\n", res, "\n");
  // mainMenu();
  //   }
  // );
  //try{ cosnt res= await query(`SELECT ...`) } catch(error){ console.error(err);}
  try {
    const res = await query(
      `SELECT role.r_id AS 'id', role.title, role.salary, department.d_name AS 'department' FROM role JOIN department ON role.department_id = department.d_id ORDER BY role.r_id ASC`
    );
    console.table("\n", res, "\n");
    mainMenu();
  } catch (err) {
    console.error(err);
  }
};
//view all employes
const viewAllEmp = async () => {
  try {
    const res = await query(
      `SELECT employee.e_id AS 'id', employee.first_name, employee.last_name, role.title, department.d_name AS 'department', role.salary, manager_id AS 'manager' FROM employee, role, department WHERE department.d_id = role.department_id AND role.r_id = employee.role_id ORDER BY employee.e_id ASC`
    );
    console.table("\n", res, "\n");
    mainMenu();
  } catch (err) {
    console.error(err);
  }
  // db.query(
  //   `SELECT employee.e_id AS 'id', employee.first_name, employee.last_name, role.title, department.d_name AS 'department', role.salary, manager_id AS 'manager' FROM employee, role, department WHERE department.d_id = role.department_id AND role.r_id = employee.role_id ORDER BY employee.e_id ASC`,
  //   (err, res) => {
  //     if (err) throw err;
  //     console.table("\n", res, "\n");
  //     mainMenu();
  //   }
  // );
};

//add Department
const addDept = async () => {
  //  try{ const res= await query(`SELECT ...`) } catch(error){ console.error(err);}
  const response = await inquirer.prompt([
    {
      name: "newDept",
      type: "input",
      message: "What is the name of the department you would like to add?",
    },
  ]); //end of prompt
  //db.query gets replaced to const res = await query()
  try {
    const res = await query(`INSERT INTO department SET ?`, {
      d_name: response.newDept,
    });
    console.log(`\n ${res.newDept} successfully added to database! \n`);
    viewAllDept();
    mainMenu();
  } catch (error) {
    console.error(err);
  }
};

//       );
// } //end of function addDept

const addRole = async () => {
  try {
    const res = await query(`SELECT * FROM department`);

    let deptList = res.map((department) => ({
      name: department.d_name,
      value: department.d_id,
    }));
    const answers = await inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the name of the role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the role?",
      },
      {
        name: "deptName",
        type: "list",
        message: "What department does this role belong to?",
        choices: deptList,
      },
    ]);
    const response = await query(`INSERT INTO role SET ?`, {
      title: answers.title,
      salary: answers.salary,
      department_id: answers.deptName,
    });
    console.log(`\n ${response.title} successfully added to database! \n`);
    mainMenu();
  } catch (err) {
    console.error(err);
  }
};
//end of function addRole
// function addEmp() {} //end of function addEmp

// function updateEmpRole() {} //end of function updateEmpRole
