var express = require('express');
var router = express.Router();
var mongoose = require('../db/api');
var passport = require('passport');


router.get('/', function(req, res, next) {
    res.render('messages', { title: 'Messages', authUser: req.user});
});


module.exports = router;
