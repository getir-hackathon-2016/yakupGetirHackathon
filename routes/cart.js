var express = require('express');
var router = express.Router();
var Product = require('../models/product');


router.get('/', function (req, res) {
  console.log("aaa");
  var cart = req.session.cart;
  var display_cart = {items: [], total: 0};
  var total = 0;

  for (var item in cart) {
    display_cart.items.push(cart[item]);
    total += (cart[item].qty * cart[item].price);
  }
  display_cart.total = total;

  res.json({cart: display_cart});
});

router.post('/:id', function (req, res) {
  var id = req.params.id;
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;

  Product.findOne({_id: id}, function (error, product) {
    if (error) {
      console.log(error);
    }
    if (cart[id]) {
      cart[id].qty += 1;
    }
    else {
      cart[id] = {
        _id: product._id,
        name: product.name,
        price: product.price,
        qty: 1
      }
    }
    res.json({cart: cart});
  })
});

module.exports = router;
