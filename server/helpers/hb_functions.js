const exphbs = require('express-handlebars');
const handlebars = exphbs.create({ extname: '.hbs', });

handlebars.handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
});

handlebars.handlebars.registerHelper('url', function (str) {
    return str.trim().replace(/\s+/g, '_').toLowerCase();
});
handlebars.handlebars.registerHelper('short', function (str) {
    return str == 'United States' ? 'usa' :str.toLowerCase();
});

handlebars.handlebars.registerHelper('ucwords', function (str) {
    var arr = str.toLowerCase().split(' ');
    var strReturn = '';
    arr.forEach(function (v) {
        strReturn += v.charAt(0).toUpperCase() + v.slice(1, v.length) + ' ';
    });
    return strReturn;
});

handlebars.handlebars.registerHelper('getYear', function (str) {
    var strReturn = '';
    
    if (typeof str !== "undefined" && str !== null) {
        if (str.indexOf('-') !== -1) {
            var strArray = str.split('-');
            strReturn = '('+ strArray[2] +')';
        }
    }
    return strReturn;
});
handlebars.handlebars.registerHelper('checker', function (str) {
    if (typeof str !== "undefined" && str !== null) {
        if(str === 1)
            return 'checked';
    }
});

handlebars.handlebars.registerHelper('createTag', function (str) {
    var strReturn = '';
    if (typeof str !== "undefined" && str.length > 0) {
        if (str.indexOf(';') !== -1) {
            var strArray = str.split(';');
            for (var i = 0; i < strArray.length; i++) {
                strReturn += "<div class=\"tag\" data-value=\"" + strArray[i].replace(/\s+/g, '_').toLowerCase() + "\"><span class=\"tag-title\">" + strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1, strArray[i].length) + "</span></div>";
            }
        }
        else {
            strReturn ="<div class=\"tag\" data-value=\"" + str.replace(/\s+/g, '_').toLowerCase() + "\"><span class=\"tag-title\">" + str.charAt(0).toUpperCase() + str.slice(1, str.length) + "</span></div>";
        }
    }
    return strReturn;
});
handlebars.handlebars.registerHelper('getRating', function (str) {
    var strReturn = 
    '<input type="radio" id="star5" ' + (str === 5?'checked="checked"':'') +'name="rating_mobile" value="5">'+
    '<label class="full" for="star5" title="Awesome - 5 stars"></label>'+

    '<input type="radio" id="star4half" ' + (str === 4.5?'checked="checked"':'') +' name="rating_mobile" value="4 and a half">'+
    '<label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>'+

    '<input type="radio" id="star4" ' + (str === 4?'checked="checked"':'') +' name="rating_mobile" value="4">'+
    '<label class="full" for="star4" title="Pretty good - 4 stars"></label>'+

    '<input type="radio" id="star3half" ' + (str === 3.5?'checked="checked"':'') +'name="rating_mobile" value="3 and a half">'+
    '<label class="half" for="star3half" title="Meh - 3.5 stars"></label>'+

    '<input type="radio" id="star3" ' + (str === 3?'checked="checked"':'') +'name="rating" value="3">'+
    '<label class="full" for="star3" title="Meh - 3 stars"></label>'+

    '<input type="radio" id="star2half" ' + (str === 2.5?'checked="checked"':'') +'name="rating_mobile"value="2 and a half">'+
    '<label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>'+

    '<input type="radio" id="star2" ' + (str === 2?'checked="checked"':'') +'name="rating_mobile" value="2">'+
    '<label  class="full" for="star2" title="Kinda bad - 2 stars"></label>'+

    '<input type="radio" id="star1half" ' + (str === 1.5?'checked="checked"':'') +'name="rating_mobile" value="1 and a half">'+
    '<label class="half" for="star1half" title="Meh - 1.5 stars"></label>'+

    '<input type="radio" id="star1" ' + (str === 1?'checked="checked"':'') +'name="rating_mobile" value="1">'+
    '<label class="full" for="star1" title="Sucks big time - 1 star"></label>'+

    '<input type="radio" id="starhalf" ' + (str === 0.5?'checked="checked"':'') +'name="rating_mobile" value="half">'+
    '<label class="half" for="starhalf"  title="Sucks big time - 0.5 stars"></label>';
    return strReturn;
});

handlebars.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});