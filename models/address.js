var mongoose = require('mongoose');

// Address Schema
var AddressSchema = mongoose.Schema({
  title: {
    type: String
  },
  latitude: {
    type: String,
    require: true
  },
  longitude: {
    type: String,
    require: true
  },
  user_id: {
    type: String
  }
});

var Address = module.exports= mongoose.model('Address', AddressSchema);

module.exports.createAddress = function (address, callback) {
  address.save(callback);
};

module.exports.getAddressList = function (callback) {
  Address.find();
};

module.exports.getAddressByUserId = function (user_id, callback) {
  var query = {user_id: user_id};
  Address.find(query, callback);
};

module.exports.getAddressById = function (id, callback) {
  Address.findById(id, callback);
};

module.exports.removeAddress = function (id, callback) {
  Address.find({_id: id}).remove(callback);
};
