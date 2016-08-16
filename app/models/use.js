var mongoose = require('mongoose');
var UserSchema = require('../schemas/use');
var User = mongoose.model('User',UserSchema);

module.exports = User;