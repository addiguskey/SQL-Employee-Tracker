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
          //structure each option as a function then call for it in swithc statement
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

//viw All Department- shows dep names and ids
const viewAllDept = async () => {
  try {
    const res = await query(`SELECT* FROM department ORDER BY id ASC`);
    console.table("\n", res, "\n");
    mainMenu();
  } catch (error) {
    console.error(err);
  }
};
//view all roles
const viewAllRoles = async () => {
  //try{ cosnt res= await query(`SELECT ...`) } catch(error){ console.error(err);}
  try {
    const res = await query(
      `SELECT role.id AS 'id', 
        role.title, 
        role.salary, 
        department.name AS 'department' 
        FROM role JOIN department 
        ON role.department_id = department.id 
        ORDER BY role.id ASC`
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
      `SELECT employee.id AS 'id', 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS 'department', 
        role.salary, 
        CONCAT (manager.first_name,' ', manager.last_name) AS 'manager name'
        FROM employee JOIN role ON role.id = employee.role_id 
        JOIN department ON department.id = role.department_id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id 
        ORDER BY employee.id ASC`
    );
    console.table("\n", res, "\n");
    mainMenu();
  } catch (err) {
    console.error(err);
  }
};

//add Department
const addDept = async () => {
  const answers = await inquirer.prompt([
    {
      name: "newDept",
      type: "input",
      message: "What is the name of the department you would like to add?",
    },
  ]);
  try {
    const response = await query(`INSERT INTO department SET ?`, {
      name: answers.newDept,
    });
    console.log(`\n ${answers.newDept} successfully added to database! \n`);
    mainMenu();
  } catch (error) {
    console.error(err);
  }
}; //end of addDept

//adding a role
const addRole = async () => {
  try {
    const res = await query(`SELECT * FROM department`);

    let deptList = res.map((department) => ({
      name: department.name,
      value: department.id,
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
    console.log(`\n ${answers.title} successfully added to database! \n`);
    mainMenu();
  } catch (err) {
    console.error(err);
  }
}; //end of addRole

//add Employees
const addEmp = async () => {
  try {
    const res = await query(`SELECT * FROM role`);

    let roleList = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const mang = await query(`SELECT * FROM employee`);

    let managerList = mang.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    const answers = await inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "empRole",
        type: "list",
        message: "What is the employee's role?",
        choices: roleList,
      },
      {
        name: "empManager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: managerList,
      },
    ]);
    const response = await query(`INSERT INTO employee SET ?`, {
      first_name: answers.first_name,
      last_name: answers.last_name,
      role_id: answers.empRole,
      manager_id: answers.empManager,
    });
    console.log(`\n ${answers.last_name} successfully added to database! \n`);
    mainMenu();
  } catch (err) {
    console.error(err);
  }
}; //end of addEmp

// updating employee role
const updateEmpRole = async () => {
  try {
    const res = await query(`SELECT * FROM role`);

    let roleList = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    const emp = await query(`SELECT * FROM employee`);

    let empList = emp.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    const answers = await inquirer.prompt([
      {
        name: "empList",
        type: "list",
        message: "Which employee would you like to update?",
        choices: empList,
      },
      {
        name: "empNewRole",
        type: "list",
        message: "Which role do you want to assign the selected employee?",
        choices: roleList,
      },
    ]);
    const response = await query(
      `UPDATE employee SET role_id = ${answers.empNewRole} WHERE employee.id = ${answers.empList}`
    );
    console.log(`\n Employee's role sucessfully updated !\n`);
    mainMenu();
  } catch (err) {
    console.error(err);
  }
};
//end of function updateEmpRole
