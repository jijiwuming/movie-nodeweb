var _ = require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Catetory = require('../models/catetory');


//detail page
exports.detail = function(req,res){
	var id = req.params.id;

	Movie.findById(id,function(err,movie) {
		if(err){
			console.log(err);
		}
		Comment
			.find({movie:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments) {
			res.render('detail',{
			title: '视频- ' + movie.title,
			movie: movie,
			comments:comments
			})
		})

		
		// res.render('detail',{
		// 	title: '视频- ' + movie.title,
		// 	movie: movie
		// })
	})
}

//admain page
exports.admain = function(req,res){
	Catetory
		.find({},function(err,catetories) {
			if(err){
				console.log(err);
			}
			res.render('admain',{
				title:'b站视频后台录入页',
				catetories:catetories,
				movie:{}
			})
		})
}

//admin update movie
exports.update = function(req,res) {
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie) {
			if(err){
					console.log(err);
				}
			Catetory.find({},function(err,catetories) {
				if(err){
					console.log(err);
				}
				res.render('admain',{
					title: 'b站视频后台更新页',
					movie: movie,
					catetories: catetories
				})
			})
		})
	}
}


//admin post movie
exports.new = function(req,res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(movieObj.page=='')movieObj.page=1;
	if(id){
		Movie.findById(id, function(err,movie) {
			if (err) {
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err,movie) {
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+ movie._id);
			})
		});
	}
	else{
		_movie = new Movie(movieObj);
		var catetoryId = _movie.catetory;
		_movie.save(function(err,movie) {
				if(err){
					console.log(err);
				}
				Catetory.findById(catetoryId,function(err,catetory) {
					catetory.movies.push(_movie._id);
					catetory.save(function(err,catetory) {
						res.redirect('/movie/'+ movie._id);						
					})
				})
		})
	}
}

//list page
exports.list = function(req,res){
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err);
		}
		res.render('list',{
			title:'视频列表页',
			movies:movies
		})
	})
	
}
//list delete item
exports.del = function(req,res) {
	var id=req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie) {
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		})
	}
}