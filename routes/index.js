var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

/* GET Members page */
router.get('/', utils.ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express', active_nav: 'home' });
});

module.exports = router;
