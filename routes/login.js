var express = require('express');
var passport = require('passport');
var User = require('../db/UserModel');
var router = express.Router();



router.get('/', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/', passport.authenticate('local'), function(req, res, next) {
    passport.authenticate('local',
        function(err, user, info) {
            return err
                ? next(err)
                : user
                ? req.logIn(user, function(err) {
                return err
                    ? next(err)
                    : res.redirect('/');
            })
                : res.redirect('/');
        }
    )(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;