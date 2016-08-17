var express = require('express');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
//var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
//上传文件框架，可以是一个文件也可以是多个文件
var multer = require('multer');
var logger = require('morgan');

var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/mydb';

mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
	fs
	 .readdirSync(path)
	 .forEach(function(file) {
	 	var newPath = path + '/' +file;
	 	var stat = fs.statSync(newPath);
	 	if(stat.isFile()){
	 		if(/(.*)\.(js|coffee)/.test(file)){
	 			require(newPath)
	 		}
	 	}
	 	else if(stat.isDirectory()){
	 		walk(newPath);
	 	}
	 })
}
walk(models_path);

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(serveStatic('bower_components'));
app.use(cookieParser());
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: true,
  	saveUninitialized: true
}));

var env = process.env.NODE_ENV || 'development';
if('development' === env){
	app.set('showStackError',true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}


require('./config/routes')(app)

app.locals.moment = require('moment');
app.listen(port);
// 初始数据录入
// var tmp = new Movie({
// 	doctor:"Travel Days",
// 	title:"岁月成碑",
// 	language:"中文",
// 	country:"中国",
// 	summary:"岁月成碑/——地球往事/月见草，覆了风霜，/离群之鸟犹自彷徨。/紫丁香，散遗世芬芳，/逆着风荣枯一场。/告别土壤，白桦再难生长。/植根星海，又能否重获青苍？/每夜放逐信仰，四光年之外去流浪——/纵躯壳埋葬，灵魂自由释放。/霓虹中，错落影像，/满城声色褪去喧嚷。/废墟上，余碑文几行，/未铭记何谈淡忘。/血色夕阳，温热化作苍凉。/林海莽莽，天穹下宛若尘芒。/此间彼方流浪，分不清决绝和迷惘，/风又过山岗，而梦已泛黄。/思绪弥散跌落未知远方， /故事已无人再讲，/谁读身前天外满眼炎凉，/才启示星辰深处的异象。/于绝境之中，许拯救祈望， /幽暗深林虚掩之下，或仍藏涅槃微光。 /命运何种模样，毋须想，/随时间，尽归于沧桑",
// 	flash:"2782004",
// 	poster:"http://pic.xiami.net/tmpimg/847/55d85c9f4f5934975.jpg",
// 	year:2015,
//	page:2
// })
// tmp.save(function(err) {
// 	console.log(err);
// })

console.log('started');

