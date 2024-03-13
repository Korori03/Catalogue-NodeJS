const mysql = require('mysql');
const functions = require('../helpers/functions.js');
const sql_f = require('../helpers/sql_functions.js');
const fs = require("fs");
const bcrypt = require("bcrypt")

const session = require('express-session');




// Connection Pool
let connection = mysql.createPool({
  connectionLimit: 10,
  acquireTimeout: 10000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});




//View lected Item
exports.login = (req, res) => {
  res.render('login');
}


//View lected Item
exports.auth = (req, res) => {

  const username = req.body.username;
  const password = req.body.password

  var hash = bcrypt.hashSync(password, 10);
  const dcryptPassword = bcrypt.compareSync(password, hash); // this one was incorrect
  if (username && dcryptPassword) {
   var s = connection.query('SELECT password FROM accounts WHERE username = ?', [username], 
      (error, fields)=> {
        var phash = fields[0].password;
        if (bcrypt.compareSync(password, phash)) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/');
      } else {
          res.send('Incorrect Email and/or Password!');
      }           
      res.end();
      });
  } else {
      res.send('Please enter Username and Password!');
      res.end();
  }
}
