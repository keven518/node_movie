var express = require('express');
var path = require('path');  //静态文件路径
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');
var _ = require('underscore');
var settings = require('./settings');
var port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var app = express();

mongoose.connect(settings.url);

app.set('views', './views/pages');  //视图文件路径
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({
	secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  resave: false,
  saveUninitialized: true,
	store: new mongoStore({
		url: settings.url,
		collection: 'session'
	})
}));

if ('development' === app.get('env')) {
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}


// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));  //可以使res.body显示
require('./config/routes')(app);
app.listen(port);
app.locals.moment = require('moment');  //向jade:userlist.jade中'#{moment'传方法
app.use(express.static(path.join(__dirname, 'public')));  //静态文件目录

console.log('kv started on port ' + port);

