var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    index: true
  },
  password: {
    type: String,
    require: true,
    bcrypt: true
  },
  email: {
    type: String
  },
  name: {
    type: String
  }
});

var User = module.exports= mongoose.model('User', UserSchema);

module.exports.createUser = function (new_user, callback) {
  bcrypt.hash(new_user.password, 10, function (error, hash) {
    if (error) throw error;
    new_user.password = hash;
    new_user.save(callback);
  });
};

module.exports.getUserByUsername = function (username, callback) {
  var query = {username: username};
  User.findOne(query, callback);
};


module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.comparePassword = function (password, hash, callback) {
  bcrypt.compare(password, hash, function (error, is_match) {
    if (error) return callback(error);
    callback(null, is_match);
  })
};
