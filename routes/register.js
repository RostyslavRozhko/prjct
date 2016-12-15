var express = require('express');
var passport = require('passport');
var User = require('../db/UserModel');
var mongoose  = require('../db/db');
var router = express.Router();

router.get('/', function(req, res) {
    if(req.user)
        res.redirect("/");
    else
        res.render('register', { title: 'Register'});
});

router.post('/', function(req, res, next) {
    var user = new User({
        _id:  mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password,
        name: req.body.username,
        url: req.body.username.replace(/\s/g,'').toLowerCase(),
        desc: req.body.description,
        img:null,
        chats: [{ messages: "585198a0b3930e18c0bd0000", to: "584feb58484a5a26d0a5ac29" }]
    });
    user.save(function (err) {
        return err
            ? next(err)
            : req.logIn(user, function (err) {
            return err
                ? next(err)
                : res.redirect('/');
        });
    });
});

module.exports = router;