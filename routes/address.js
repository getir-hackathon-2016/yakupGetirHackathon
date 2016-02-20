var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Address = require('../models/address');

router.get('/', utils.ensureAuthenticated, function(req, res, next) {
  Address.getAddressByUserId(req.user._id,function (error, addresses) {
    if (error) {
      console.log(error);
    }
    res.json(addresses);
  });
});

router.post('/', utils.ensureAuthenticated, function(req, res, next) {
  var title = req.body.title;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var address = new Address({
    title: title,
    latitude: latitude,
    longitude: longitude,
    user_id: req.user._id
  });
  console.log(address);
  Address.createAddress(address, function (error, address) {
    if (error) {
      console.log(error);
    }
    res.json(address);
  });
});

router.delete('/:id', function (req, res, next) {
  var id = req.params.id;

  Address.removeAddress(id, function (error, article) {
    if (error) {
      console.log(error);
    }
    res.location('/index');
    res.redirect('/index');
  });
});

module.exports = router;
