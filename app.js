require('dotenv').config();
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
var https = require('https');
var fs = require("fs");
require('./server/helpers/hb_functions');
const routes = require('./server/routes/default');


const app = express();
const port = process.env.PORT || 5000;
const handlebars = exphbs.create({ extname: '.hbs', });

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static('public'));
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(
    session({
      secret: "some secret",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 30 minutes in milliseconds
      rolling: true
  }));

  String.prototype.ucwords = function () {
    var arr = this.toLowerCase().split(' ');
    var str = '';
    arr.forEach(function (v) {
      str += v.charAt(0).toUpperCase() + v.slice(1, v.length) + ' ';
    });
    return str;
  };

     
app.use('/', routes);

https.createServer({key: fs.readFileSync("server.key"),cert: fs.readFileSync("server.crt"),},app).listen(port, () => console.log(`Listening on port ${port}`));
