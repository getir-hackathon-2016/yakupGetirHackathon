var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

var utils = require('../utils/utils');

var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', utils.ensureAnonymous, function(req, res, next) {
  res.render('register', {active_nav: 'register' });
});

router.get('/login', utils.ensureAnonymous, function(req, res, next) {
  res.render('login', {active_nav: 'login' });
});

router.post('/register', utils.ensureAnonymous, upload.single('profile_image'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Check for  Image field
  if (req.file) {
    console.log('Uploading File...');
    var profile_image_original_name = req.file.originalname;
    var profile_image_name = req.file.name;
    var profile_image_mime = req.file.mimetype;
    var profile_image_path = req.file.path;
    var profile_image_ext = req.file.extension;
    var profile_image_size = req.file.size;
  }
  else {
    var profile_image_name = 'noimage.png';
  }

  // Validation
  req.checkBody('name', 'Name fields is required').notEmpty();
  req.checkBody('email', 'Email fields is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username fields is required').notEmpty();
  req.checkBody('password', 'Password fields is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors){
    res.render('register', {
      active_nav: 'register',
      errors: errors,
      name: name,
      email: email,
      username: username
    });
  }
  else {
    var new_user = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profile_image: profile_image_name
    });

    // Create User
    User.createUser(new_user, function (error, user) {
      if (error) throw error;
      console.log(user);
    });

    // Flash Message
    req.flash('success', 'Registration completed successfully');
    res.location('/');
    res.redirect('/');
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function (error, user) {
      if (error) throw error;
      if (!user) {
        console.log('Unknown User');
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, function(error, is_match){
        if(error) throw error;
        if(is_match){
          return done(null, user);
        } else {
          console.log('Invalid Password');
          return done(null, false, {message:'Invalid Password'});
        }
      });
    });
  }
));


router.post('/login', utils.ensureAnonymous, passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: 'Invalid username or password'
}), function (req, res) {
  console.log('Authentication successful.');
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', function (req, res, next) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
})

module.exports = router;
