var express = require('express');
var router = express.Router();
var mongoose = require('../db/api');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {

  mongoose.getIndexIdeas(function (err, ideas) {
    if(err){
      console.log("Error")
    } else {
      res.render('index', { title: 'Main page', ideas: ideas, authUser: req.user});
    }
  });
});

router.get('/ping', function(req, res){
  res.status(200).send("pong!");
});

module.exports = router;
