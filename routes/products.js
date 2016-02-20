var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Product = require('../models/product');

router.get('/', utils.ensureAuthenticated, function(req, res, next) {
  Product.getProductList(function (error, products) {
    if (error) {
      console.log(error);
    }
    res.json(products);
  });
});

module.exports = router;
