var User = require('../models/use');

//signup
exports.signup = function(req,res) {
	var _user = req.body.user;
	//req.param('user')通用方式
	User.findOne({name: _user.name},function(err,user) {
		if(err){
			console.log(err);
		}
		if(user){
			console.log('error:'+ user+'#');
			return res.redirect('/signin');
		}
		else{		
		// console.log('signup'+_user.name);	
			user = new User(_user);
			user.save(function(err,user) {
				if(err){
					console.log(err);
				}
				// console.log(user);
				res.redirect('/');
			})
		}
	})
}

//signin
exports.signin = function(req,res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name},function(err,user) {
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup');
		}

		user.comparePassword(password,function(err,isMatch) {
			if(err) {console.log(err)}
			if(isMatch){
				console.log('user'+user);
				req.session.user = user;
				console.log('go out'+req.session.user);
				return res.redirect('/');
			}else{
				console.log('password error');
				return res.redirect('/signin');
			}
		})
	});
}

//showSignup
exports.showSignup = function(req,res) {
	res.render('signup',{
			title:'注册页面'
	})
}

//showSignin
exports.showSignin = function(req,res) {
	res.render('signin',{
			title:'登录页面'
	})
}

//logout
exports.logout = function(req,res) {
	delete req.session.user
	// delete app.locals.user
	res.redirect('/');
}

//user list page
exports.userlist = function(req,res){
	User.fetch(function(err,users) {
		if(err) {
			console.log(err);
		}
		res.render('userlist',{
			title:'用户列表页',
			users:users
		})
	})
	
}

// midware user signinRequired
exports.signinRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		res.redirect('/signin');
	}
	next();	
}

// midware user adminRequired
exports.adminRequired = function(req,res,next){
	var user = req.session.user;
	console.log(user.role)
	if(user.role <= 10){
		res.redirect('/signin');
	}
	next();	
}