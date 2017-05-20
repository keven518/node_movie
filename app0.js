var express = require('express');
var path = require('path');  //静态文件路径
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

app.set('views', './views/pages');  //视图文件路径
app.set('view engine', 'jade');
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.listen(port);

console.log('imooc started on port ' + port);

// index page
app.get('/', function(req, res, next) {
	res.render('index', {
		title: 'kv 首页',
		movies: [{
			title: '机械战警',
			_id: 1,
			poster: 'http://www.qq.com'
		},{
			title: '机械战警',
			_id: 2,
			poster: 'http://www.qq.com'
		},{
			title: '机械战警',
			_id: 3,
			poster: 'http://www.qq.com'
		},{
			title: '机械战警',
			_id: 4,
			poster: 'http://www.qq.com'
		},{
			title: '机械战警',
			_id: 5,
			poster: 'http://www.qq.com'
		},{
			title: '机械战警',
			_id: 6,
			poster: 'http://www.qq.com'
		}]
	});
});

// detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;
	res.render('index', {
		title: 'kv 详情页' + id,
		movies: {
			doctor: '柯文问',
			country: '美国',
			title: '机械战警',
			year: 2014,
			poster: 'http://www.qq.com',
			language: '英语',
			flash: 'http://www.baidu.com',
			summary: 'asdfaf阿斯顿发送到发送到发送到发送到发送到放弃而伟大法师法师。'
		}
	})
});

// admin page
app.get('/admin/movie', function(req, res) {
	res.render('detail', {
		title: 'kv 后台录入页',
		movies: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
});

// list page
app.get('/admin/list', function(req, res) {
	res.render('list', {
		title: 'kv 列表页',
		movies: [{
			title: 'jixi',
			_id: 1,
			doctor: 'kwen',
			country: 'mg',
			year: 2014,
			poster: 'http://www.qq.com',
			language: 'yingyu',
			flash: 'http://www.baidu.com'
		}]
	})
});