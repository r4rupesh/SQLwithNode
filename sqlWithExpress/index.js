const express = require("express"); // require express.
const app = express(); //Store express in app variable.
const { faker } = require("@faker-js/faker"); // require faker.
const mysql = require("mysql2"); //require sql;
const overRide = require("method-override");
app.set("view engine", "ejs"); //set view engine.
const path = require("path"); //path package.
const exp = require("constants");
app.use(overRide("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
const port = 8080; //intialized port.

//build connection between node and sql.
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "faker_data",
  password: "Bihar@123",
});

// let data = []; //data of fakers.
//Data extract to fakers.
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};
//loop for 100 data.
// for(let i =1; i<=100;i++){
//     console.log(data.push(getRandomUser()));
// }

//insert data into sql.
// let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// try {
//     connection.query(q,[data],(err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });
// } catch (err) {
//     console.log(err);
// }
//app is listen.
app.listen(port, () => {
  console.log("app is listening on 8080");
});
//home route.
app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("error.....");
  }
});

//Show route.
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      // console.log(result);
      res.render("show.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("error.....");
  }
});
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("error.....");
  }
});

//Update Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: newFormUser, password: formPass } = req.body;
  console.log(req.body);
  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `UPDATE user SET username ='${newFormUser}'  WHERE id ='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("error.....");
  }
});
app.get("/user/add", (req, res) => {
  console.log("add route is working");
  res.render("add.ejs");
});

app.post("/user/add", (req, res) => {
  let { id, username, email, password } = req.body;
  let q = `INSERT INTO user (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}');`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log(err);
    res.send("error.....");
  }
  res.redirect("/user");

});
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("error.....");
  }
  // res.render("delete.ejs");
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (password != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `DELETE FROM user WHERE id ='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("error.....");
  }
});