var mongoose = require('mongoose');

// Product Schema
var ProductSchema = mongoose.Schema({
  name: {
    type: String
  },
  price: {
    type: String
  },
  image: {
    type: String
  },
  stock_count: {
    type: String
  }
});

var Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.createProduct = function (product, callback) {
  product.save(callback);
};

module.exports.getProductList = function (callback) {
  Product.find();
};

module.exports.getProductByUserId = function (user_id, callback) {
  var query = {user_id: user_id};
  Product.find(query, callback);
};

module.exports.getProductById = function (id, callback) {
  Product.findById(id, callback);
};

module.exports.removeProduct = function (id, callback) {
  Product.find({_id: id}).remove(callback);
};
