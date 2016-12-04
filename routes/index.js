var express = require('express');
var router = express.Router();
var mongoose = require('../db/api');

/* GET home page. */
router.get('/', function(req, res, next) {
  mongoose.getIndexIdeas(function (err, ideas) {
    if(err){
      console.log("Error")
    } else {
      res.render('index', { title: 'Ideas', ideas: ideas });
    }
  });
});

module.exports = router;
