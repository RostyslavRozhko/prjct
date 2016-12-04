var express = require('express');
var db = require('../db/api');
var router = express.Router();

router.get('/', function(req, res, next) {
    db.getAllIdeas(function (err, ideas) {
        if(err){
            console.log("Error")
        } else {
            res.render('ideas-list', { title: 'Ideas', ideas: ideas });
        }
    });

});

router.get('/:id', function (req, res, next) {
   var id = req.params.id;
    db.getIdeaByName(id, function (err, idea) {
        if(err){
            console.log("Error")
        } else {
            res.render('idea', { title: idea.title, idea: idea });
        }
    });
});

module.exports = router;
