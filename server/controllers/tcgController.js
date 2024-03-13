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
  
  
var pageObject = 'tcg';




// View Users
exports.main = (req, res) => {
    let searchItems = searchGenre = searchYears = '';

    (async () => {
        searchItems = await functions.searchItems(pageObject);
        searchGenre = await functions.searchTCGGenre(pageObject);
        searchYears =  functions.searchYears(pageObject);
    })();
    connection.query(
        sql_f.getQuery(pageObject,'main'),
        [],
        (err, rows) => {
            if (!err) {

                var data = {};
                rows.forEach((row, index) => {
                    var own = Number.isInteger(row.own) ? parseInt(row.own) : 0;
                    var total = Number.isInteger(row.total) ? parseInt(row.total) : 0;
                    var percentage = ((100 / total) * own).toFixed(2);
                    data[index] = {
                        main: pageObject,
                        name: row.subitem,
                        url: row.url,
                        total: total,
                        own: own,
                        percentage: Number(percentage) ? percentage : 0
                    }
                });

                var breadcrumbs = { main: pageObject };
                var searchOptions = functions.setupItems(searchItems,'other');
                res.render('itemMainTCG', {pageObject, data, searchOptions, searchGenre, searchYears, breadcrumbs });
            } else {
                console.log(err);
            }
        });
}

exports.viewbrand = (req, res) => {
    var brand = req.params.brand.trim();

    let searchItems = searchGenre = searchYears = '';

    (async () => {
        searchItems = await functions.searchItems(pageObject);
        searchGenre = await functions.searchTCGGenre(pageObject);
        searchYears =  functions.searchYears(pageObject);
    })();
    var s = connection.query(
        sql_f.getQuery(pageObject,'brand'),
        [
            brand
        ],
        (err, rows) => {

            var data = {};
            rows.forEach((row, index) => {
                data[index] = {
                    main: pageObject,
                    name: row.name,
                    brand: row.type,
                    date_released: row.date_released,
                    setid: row.setid,
                    abbreviation: row.abbreviation,
                    image_symbol: row.image_symbol,
                    card_count: row.card_count,
                    secret_count: row.secret_count,
                    variant_count: row.variant_count,
                    own: row.own,
                    percentage: row.percentage,
                    total: row.total
                }
            });
            
            var datapercent = '';
            var breadcrumbs = { main: pageObject, brand: brand };
            var searchOptions = functions.setupItems(searchItems,'other');
            res.render('itemMainTCG', {pageObject, data, datapercent, searchOptions, searchGenre, searchYears, breadcrumbs });


        });
}

exports.viewSet = (req, res) => {
    let searchItems = searchGenre = searchYears = '';

    (async () => {
        searchItems = await functions.searchItems(pageObject);
        searchGenre = await functions.searchTCGGenre(pageObject);
        searchYears =  functions.searchYears(pageObject);
    })();
    var brand = req.params.brand.trim();
    var type = req.params.type.trim();

    connection.query(
        sql_f.getQuery(pageObject,'set'),
        [
            brand, type
        ],
        (err, rows) => {
            if (!err) {
                var data = {};
                var datapercent = {};

                var subid = 0;
                rows.forEach((row, index) => {
                    if (row.is_variant == 1) {
                        data[row.card_number]['variants'][subid] =
                        {
                            cid:row.cid,
                            cardid: row.cardid,
                            name: row.card_variant,
                            setid: row.setid,
                            own: row.own
                        };
                        subid++;
                    }
                    else {
                        subid = 0;
                        data[row.card_number] = {
                            name: row.name,
                            main: pageObject,
                            image: row.image,
                            cardid: row.cardid,
                            sub: brand,
                            nestedsub: row.abbreviation,
                            release_date: row.release_date,
                            set_name: row.set_name,
                            card_variant: row.card_variant,
                            card_number: row.card_number,
                            setid: row.setid,
                            variants: {},
                            cid:row.cid,
                            own: row.own
                        }
                    }
                });
                var breadcrumbs = { main: pageObject, sub: brand, nestedsub: type };
                var searchOptions = functions.setupItems(searchItems,'tcg');
                res.render('itemListTCG', { pageObject,datapercent, data, searchOptions, searchGenre, searchYears, breadcrumbs });
            } else {
                console.log(err);
            }
        });
}
