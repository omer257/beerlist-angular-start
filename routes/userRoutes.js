var express = require('express');
var router = express.Router();
var Account = require("../models/UserModel");
var passport = require('passport');

router.post('/register', function(req, res, next) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err, user) {
    if (err) {
      console.log('Error registering!', err);
      return next(err);
    }
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      res.send(req.user.username);
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.send(req.user.username)
});

router.get('/currentuser', function(req, res) {
  if (req.user) {
    res.send(req.user.username)
  } else {
    res.send(null)
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  res.send('Logged Out');
});

module.exports = router
