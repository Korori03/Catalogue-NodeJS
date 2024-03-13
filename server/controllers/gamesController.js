const mysql = require('mysql');
const fs = require("fs");
const functions = require('../helpers/functions.js');
const sql_f = require('../helpers/sql_functions.js');
const session = require('express-session');

// Connection Pool
let connection = mysql.createPool({
  connectionLimit : 10,
  acquireTimeout  : 10000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});


var pageObject = 'games';

// View Users
exports.main = (req, res) => {
  const username =req.session.username;
  
  let searchItems = searchGenre = searchYears = '';
  (async () => {
    searchItems = await functions.searchItems(pageObject);
    searchGenre = await functions.searchGenre(pageObject);
    searchYears = functions.searchYears(pageObject);
  })();
  connection.query(
    sql_f.getQuery(pageObject,'percent_main') +
      sql_f.getQuery(pageObject,'percent_sub'),
    [
      username, '0',
      username, '0'
    ],
    (err, rows) => {
      if (!err) {
        var datapercent = {
          main: pageObject,
          title: 'Video Game',
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
            name: row.brand,
            main: pageObject,
            sub: row.brand,
            nestedsub: row.gsystem,
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
        var searchOptions = functions.setupItems(searchItems, 'other');
        res.render('itemMain', {pageObject, data, searchOptions, searchGenre, searchYears, datapercent, breadcrumbs });
      } else {
        console.log(err);
        res.redirect('/');
      }
    });
}

exports.viewbrand = (req, res) => {
  const username =req.session.username;
  const brand = req.params.brand.replace(/_/g, ' ').trim();
  let searchItems = searchGenre = searchYears = '';
  (async () => {
    searchItems = await functions.searchItems(pageObject);
    searchGenre = await functions.searchGenre(pageObject);
    searchYears = functions.searchYears(pageObject);
  })();
  connection.query(
    sql_f.getQuery(pageObject,'percent_brand') +
    sql_f.getQuery(pageObject,'brand'),
    [
      brand, username,
      brand, username
    ],
    (err, rows) => {
      if (!err) {

        var datapercent = {
          main: rows[0][0].type,
          title: rows[0][0].type,
          brand: rows[0][0].type,
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
        rows[1].forEach((row, index) => {
          data[index] = {
            main: pageObject,
            name: row.gsystem,
            brand: row.brand,
            system: row.gsystem,
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
        var searchOptions = functions.setupItems(searchItems, pageObject);
        res.render('itemMain', {pageObject, data, datapercent, searchOptions, searchGenre, searchYears, breadcrumbs });

      } else {
        console.log(err);
        res.redirect('/');
      }
    });
}

exports.viewsystem = (req, res) => {
  const username =req.session.username;
  var brand = req.params.brand.replace(/_/g, ' ').trim();
  var system = req.params.system.replace(/_/g, ' ').trim();
  let searchItems = searchGenre = searchYears = '';
  (async () => {
    searchItems = await functions.searchItems(pageObject);
    searchGenre = await functions.searchGenre(pageObject);
    searchYears = functions.searchYears(pageObject);
  })();

  connection.query(
    sql_f.getQuery(pageObject,'percent_system') +
    sql_f.getQuery(pageObject,'system'),
    [
      brand, system, username,
      brand, system, username
    ],
    (err, rows) => {

      if (!err) {
        var data = {};
        var datapercent = {
          cost: !isNaN(parseFloat(rows[0][0].cost).toFixed(2)) ? parseFloat(rows[0][0].cost).toFixed(2) : 0,
          type: rows[0][0].gsystem,

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

        rows[1].forEach((row, index) => {
          data[index] = {
            id: row.id,
            name: row.name,
            main: pageObject,
            sub: row.brand,
            nestedsub: row.gsystem,
            release_date: row.release_date,
            region_icon: row.region == 'United States' ? 'usa' : row.region,
            region: row.region,
            finished: row.completed.toLowerCase(),
            total: row.total,
            price: row.price,
            percentage: row.percentage,
            userid: row.userid
          }
        });
        var breadcrumbs = { main: pageObject, sub: brand, nestedsub: system };
        var searchOptions = functions.setupItems(searchItems, pageObject);
        res.render('itemList', { pageObject,datapercent, data, searchOptions, searchGenre, searchYears, breadcrumbs });
      } else {
        console.log(err);
        res.redirect('/');
      }
    });
}

exports.viewitem = (req, res) => {
  const username =req.session.username;
  var item = req.params.id;
  let searchItems = searchGenre = searchYears = '';
  (async () => {
    searchItems = await functions.searchItems(pageObject);
    searchGenre = await functions.searchGenre(pageObject);
    searchYears = functions.searchYears(pageObject);
  })();
  connection.query(
    sql_f.getQuery(pageObject,'item') +
    sql_f.getQuery(pageObject,'item_rating'),
    [
      username, item, 0,
      username,item, username
    ],
    (err, row) => {
      if (!err) {
        var data = {
          id: row[0][0].id,
          name: row[0][0].name,
          main: pageObject,
          sub: row[0][0].brand,
          nestedsub: row[0][0].gsystem,
          release_date: row[0][0].release_date,
          genre: row[0][0].genre,
          publisher: row[0][0].publisher,
          secondary_type: 'Developer:',
          secondary: row[0][0].secondary,
          region_icon: row[0][0].region == 'United States' ? 'usa' : row[0][0].region,
          region: row[0][0].region,
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

        var breadcrumbs = { main: pageObject, sub: data.sub, nestedsub: data.nestedsub };

        var searchOptions = functions.setupItems(searchItems, pageObject);
        res.render('itemView', {pageObject, data, dataReview, searchOptions, searchGenre, searchYears, breadcrumbs });
      } else {
        console.log(err);
        res.redirect('/');
      }
    });
}