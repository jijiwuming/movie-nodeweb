var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
//index page
exports.index = function(req,res){
	Catetory
		.find({})
		.populate({path:'movies',options:{limit:5}})
		.exec(function(err,catetories) {		
				if(err) {
					console.log(err);
				}

				res.render('index', {
					title: '视频库',
					catetories: catetories
				})	
		})	
}
//search
exports.search = function(req,res) {
	var catId = req.query.cat;
	var q = req.query.q;
	var page = Number(req.query.p) || 0;
	var count = 2;
	var index = page * count;
	if(catId){
		Catetory
			.find({_id:catId})
			.populate({
				path:'movies'
				// options:{
				// 	limit: count,
				// 	skip: index
				// }
			})
			.exec(function(err,catetories) {		
					if(err) {
						console.log(err);
					}
					var catetory = catetories[0] || {}
					var movies = catetory.movies || [];
					var results = movies.slice(index, index+count);

					res.render('results', {
						title: '结果列表',
						keyword: catetory.name,
						currentPage: (page+1),
						query: 'cat='+catId,
						totalPage: Math.ceil(movies.length/2),
						movies: results
					})	
			})
	}else{
		Movie
			.find({title: new RegExp(q+'.*','i')})
			.exec(function(err,movies) {		
					if(err) {
						console.log(err);
					}
					var results = movies.slice(index, index+count);

					res.render('results', {
						title: '结果列表',
						keyword: q,
						currentPage: (page+1),
						query: 'q='+q,
						totalPage: Math.ceil(movies.length/count),
						movies: results
					})	
			})
	}
}
