module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/users/login');
  }
}

module.exports.ensureAnonymous = function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    return next();
  }
}
