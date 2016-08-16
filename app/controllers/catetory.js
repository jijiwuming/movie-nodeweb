var _ = require('underscore');
var Catetory = require('../models/catetory');
var Comment = require('../models/comment');

//catetory admain page
exports.new = function(req,res){
	res.render('catetory_admin',{
		title:'视频分类录入页',
		catetory:{}
	})
}

//admin post catetory
exports.save = function(req,res) {
	var _catetory = req.body.catetory;
	
	var catetory = new Catetory(_catetory);
	catetory.save(function(err,movie) {
			if(err){
				console.log(err);
			}
			res.redirect('/admin/catetory/list');
	})
	
}

//catetory list
exports.list = function(req,res){
	Catetory.fetch(function(err,catetories) {
		if(err) {
			console.log(err);
		}
		res.render('catetorylist',{
			title:'分类列表页',
			catetories: catetories
		})
	})
	
}