/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// use path modle
var path = require('path');

// use other modle
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// add markdown.js
var marked = require('marked');
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });

var fs = require('fs');

// use routes modle
var routes = require('./routes/index');

// create a new express server
var app = express();


// Express 程序配置  
//app.configure(function(){  
  app.set('views', path.join(__dirname + '/views'));  
  app.set('view engine', 'ejs');  

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, 'public')));
//  app.use(express.static(__dirname + '/public'));  
//}); 


// use routes modle
  routes(app);


module.exports = app;
