const mysql = require('mysql');
const functions = require('../helpers/functions.js');
const sql_f = require('../helpers/sql_functions.js');
const fs = require("fs");
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




//Home Page
exports.view = (req, res) => {
  try {
    const username = req.session.username;
    const queries = [
      sql_f.getQuery('books', 'last10'), sql_f.getQuery('games', 'last10'), sql_f.getQuery('videos', 'last10'), sql_f.getQuery('music', 'last10'),
    ];

    connection.query(
      queries.join(''),
      [username, username, username, username]
      , function (err, results) {
        if (!err) {
          var data = {
            books: results[0],
            games: results[1],
            videos: results[2],
            music: results[3]
          };
          res.render('home', { data });
        } else {
          console.log(err);
          res.redirect('/');
        }
      });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};


//Main Object Page
exports.main = (req, res) => {
  const username = req.session.username;
  const pageObject = req.params.object;
  //Check if Object is in Path
  if (!functions.validateTable(req.params.object)) {
    res.redirect('/');
  }
  else{
  let searchItems = searchGenre = searchYears = '';

  (async () => {
    searchItems = await functions.searchItems(pageObject);
    searchGenre = await functions.searchGenre(pageObject);
    searchYears = await functions.searchYears(pageObject);
  })();

  connection.query(
    sql_f.getQuery(pageObject, 'percent_main') +
    sql_f.getQuery(pageObject, 'percent_sub'),
    [
      username, '0',
      username, '0'
    ],
    (err, rows) => {
      if (!err) {
        var datapercent = {
          main: pageObject,
          title: functions.ucwords(pageObject),
          brand: rows[0][0].brand,
          system: rows[0][0].gsystem,
          release_date: rows[0][0].release_date,
          region: {
            usa: rows[0][0].usa,
            japan: rows[0][0].japan,
            europe: rows[0][0].europe,
            asia: rows[0][0].asia,
            australia: rows[0][0].australia,
            korea: rows[0][0].korea
          },
          finished: rows[0][0].finished,
          total: rows[0][0].total,
          price: rows[0][0].price,
          percentage: rows[0][0].percentage,
          userid: rows[0][0].userid
        };

        var data = {};
        rows[2].forEach((row, index) => {
          data[index] = {
            name: functions.ucwords(row.type),
            main: pageObject,
            sub: row.type,
            release_date: row.release_date,
            region: {
              usa: row.usa,
              japan: row.japan,
              europe: row.europe,
              asia: row.asia,
              australia: row.australia,
              korea: row.korea
            },
            finished: row.finished,
            total: row.total,
            price: row.price,
            percentage: row.percentage,
            userid: row.userid
          }
        });
        var breadcrumbs = { main: pageObject };
        var searchOptions = functions.setupItems(searchItems);
        res.render('itemMain', { pageObject, data, searchOptions, searchGenre, searchYears, datapercent, breadcrumbs });
      } else {
        console.log(err);
        res.redirect('/');
      }
    });
  }
}

//View Sub Type
exports.viewtype = (req, res) => {
  if (req.session && req.session.username) 
    next();
  
  const username = req.session.username;
  const pageObject = req.params.object;
  const type = req.params.type.replace(/_/g, ' ');
  const item = req.params.id;

  //Check if Object is in Path
  if (!functions.validateTable(req.params.object)) {
    res.redirect('/');
  }
  else{
  let searchItems = searchGenre = searchYears = '';
  (async () => {
    searchItems = await functions.searchItems(pageObject);
    searchGenre = await functions.searchGenre(pageObject);
    searchYears = functions.searchYears(pageObject);
  })();

  connection.query(
    sql_f.getQuery(pageObject, 'type') +
    sql_f.getQuery(pageObject, 'percent_type'),
    [
      type, username,
      type, username
    ],
    (err, rows) => {
      if (!err) {
        var datapercent = {
          //cost: !isNaN(parseFloat(rows[0][0].cost).toFixed(2)) ? parseFloat(rows[0][0].cost).toFixed(2) : 0,
          type: functions.ucwords(rows[0][0].type),
          release_date: rows[0][0].release_date,
          usa: rows[0][0].usa,
          japan: rows[0][0].japan,
          europe: rows[0][0].europe,
          asia: rows[0][0].asia,
          australia: rows[0][0].australia,
          korea: rows[0][0].korea,
          finished: rows[0][0].finished,
          total: rows[0][0].total,
          percentage: rows[0][0].percentage,
        };


        var data = {};
        rows[1].forEach((row, index) => {
          data[index] = {
            id: row.id,
            name: row.name,
            main: pageObject,
            sub: row.type,
            release_date: row.release_date,
            region: row.region,
            region_icon: row.region == 'United States' ? 'usa' : row.region,
            finished: row.completed.toLowerCase(),
            total: row.total,
            price: row.price,
            percentage: row.percentage,
            userid: row.userid
          }
        });
        var breadcrumbs = { main: pageObject, sub: type };
        var searchOptions = functions.setupItems(searchItems);
        res.render('itemList', { pageObject, data, searchOptions, searchGenre, searchYears, datapercent, breadcrumbs });
      } else {
        console.log(err);
        res.redirect('/');
      }
    });
  }
}


//View lected Item
exports.viewitem = (req, res) => {
  const username = req.session.username;
  const pageObject = req.params.object;
  const type = req.params.type;
  const item = req.params.id;

  //Check if Object is in Path
  if (!functions.validateTable(req.params.object)) {
    res.redirect('/');
  }
  else{
  let searchItems = searchGenre = searchYears = '';
  (async () => {
    searchItems = await functions.searchItems(pageObject);
    searchGenre = await functions.searchGenre(pageObject);
    searchYears = functions.searchYears(pageObject);
  })();

  connection.query(
    sql_f.getQuery(pageObject, 'item') +
    sql_f.getQuery(pageObject, 'item_rating'),
    [
      username, item, 0,
      type, item, username
    ],
    (err, row) => {
      if (!err) {
        var data = {
          id: row[0][0].id,
          name: row[0][0].name,
          main: pageObject,
          sub: row[0][0].type,
          release_date: row[0][0].release_date,
          region: row[0][0].region,
          publisher: row[0][0].publisher,
          genre: row[0][0].genre,
          secondary_type: '',
          secondary: '',
          region_icon: row[0][0].region == 'United States' ? 'usa' : row[0][0].region,
          finished: row[0][0].completed,
          total: row[0][0].total,
          price: row[0][0].price,
          percentage: row[0][0].percentage,
          userid: row[0][0].userid,
          cover_img: fs.existsSync('./public/img/cover/' + pageObject + '_' + row[0][0].id + '.png') ? '/img/cover/' + pageObject + '_' + row[0][0].id + '.png' : '/img/no-cover.png'
        };
        var dataReview = {};
        if (row[2].length > 0) {
          dataReview = {
            review: row[2][0].comments,
            rating: row[2][0].total,
            options: JSON.parse('[' + row[2][0].options.replace(/(\r\n|\n|\r)/gm, "") + ']')
          };
        }
        var breadcrumbs = { main: pageObject, sub: data.sub };
        var searchOptions = functions.setupItems(searchItems);
        res.render('itemView', { pageObject, data, dataReview, searchOptions, searchGenre, searchYears, breadcrumbs });
      } else {
        console.log(err);
        res.redirect('/');
      }
    });
  }
}
