const mysql = require('mysql');
const bcrypt = require("bcrypt")
const saltRounds = 10

require('dotenv').config();
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});


async function searchYears() {
  const range = (len, startWith = 0) => [...Array(len + startWith).keys()].slice(startWith);
  const getYears = (fromYear, nPrev, nNext) => range((nPrev + nNext - 1), fromYear - nPrev);
  return getYears(new Date().getFullYear(), 65, 2).reverse();
};

async function searchItems(type) {
  try {
    return await new Promise((resolve, reject) => {
     connection.query(
        "SELECT subitem,subitem2 FROM `categories` WHERE subitem <> '' and LOWER(main) = ? ORDER BY release_date DESC;",
        [type],
        (err, result) => {
          return err ? reject(err) : resolve(result);
        }
      );
    });
  } catch (error) {
  }
};


async function searchGenre(type) {
  try {
     return await new Promise((resolve, reject) => {
      var s =connection.query(
        "SELECT TRIM(if(locate(';',genre)=0,'',substring_index(genre, ';', 1))) as genre FROM ?? WHERE TRIM(if(locate(';',genre)=0,'',substring_index(genre, ';', 1))) <> '' GROUP BY(if(locate(';',genre)=0,'',substring_index(genre, ';', 1)));",
        [type],
        (err, result) => {
          return err ? reject(err) : resolve(result);
        }
      );
    });
  } catch (error) {
  }
}
async function searchTCGGenre(type) {
  try {  
    return await new Promise((resolve, reject) => {
      var s =connection.query(
        `SELECT rarity as genre FROM tcgcards GROUP BY rarity ORDER BY rarity ASC;` ,
        [type],
        (err, result) => {
          return err ? reject(err) : resolve(result);
        }
      );
    });
  } catch (error) {
  }
}

function setupItems(arr, type = 'other') {
  var returnItems = (type === 'other' ? '<option value="" selected="selected">All Types</option>' : '<option value="" selected="selected">All Platforms</option>') + '<optgroup label="Popular ' + (type === 'other' ? 'Types' : 'Platforms') + '">';
  var splitNum = 10;
  for (let step = 0; step < arr.length; step++) {
    var item = arr[step].subitem2.length > 0 ? arr[step].subitem2 : arr[step].subitem;
    returnItems += '<option value="' + item + '">' + item + '</option>';
    returnItems += step === splitNum - 1 ? '</optgroup><optgroup label="All ' + (type === 'other' ? 'Types' : 'Platforms') + '">' : '';

  };
  return returnItems + '</optgroup>';
}


String.prototype.ucwords = function () {
  var arr = this.toLowerCase().split(' ');
  var str = '';
  arr.forEach(function (v) {
    str += v.charAt(0).toUpperCase() + v.slice(1, v.length) + ' ';
  });
  return str;
};

function ucwords(str) {
  var arr = str.toLowerCase().split(' ');
  var str = '';
  arr.forEach(function (v) {
    str += v.charAt(0).toUpperCase() + v.slice(1, v.length) + ' ';
  });
  return str;
}

function getPrice() {
  return ' <strong>CIB</strong>: $61.80';
}

function getBreadcrumbs(req, res, next) {
  const urls = req.originalUrl.split('/');
  urls.shift();
  req.breadcrumbs = urls.map((url, i) => {
    return {
      breadcrumbName: (url === '' ? 'Home' : url.charAt(0).toUpperCase() + url.slice(1)),
      breadcrumbUrl: `/${urls.slice(0, i + 1).join('/')}`,
    };
  });
  next();
}

function validateTable(table) {
  switch (table.toLowerCase()) {
    case "games":
    case "books":
    case "videos":
    case "tcg":
    case "figures":
    case "music":
      return true;
    default:
      return false;

  }
}


async function getCoverImagePath(pageObject, itemId) {
  const coverPath = `./public/img/cover/${pageObject}_${itemId}.png`;
  try {
    await fs.access(coverPath);
    return `/img/cover/${pageObject}_${itemId}.png`;
  } catch (err) {
    return '/img/no-cover.png';
  }
}

function getDataReview(ratingData) {
  if (ratingData.length > 0) {
    return {
      review: ratingData[0].comments,
      rating: ratingData[0].total,
      options: JSON.parse('[' + ratingData[0].options.replace(/(\r\n|\n|\r)/gm, '') + ']')
    };
  }
  return {};
}
module.exports = { searchGenre,searchTCGGenre, searchItems, searchYears, setupItems, getPrice, getBreadcrumbs, validateTable,ucwords, getCoverImagePath,getDataReview}
