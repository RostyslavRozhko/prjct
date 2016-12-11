var express = require('express');
var db = require('../db/api');
var router = express.Router();
var mongoose = require('../db/db');
var Idea = require('../db/IdeaModel');
var User = require('../db/UserModel');

router.get('/', function(req, res, next) {
    var qu = req.query.search;
    var query = new RegExp(qu, "i");
    if (!query) {
        db.getAllIdeas(function (err, ideas) {
            if (err) {
                console.log("Error")
            } else {
                res.render('ideas-list', {title: 'Ideas', ideas: ideas, authUser: req.user});
            }
        });
    } else {
        db.getSearchIdeas(query, function (err, ideas) {
            if (err) {
                console.log("Error")
            } else {
                res.render('ideas-list', {title: 'Ideas', ideas: ideas, authUser: req.user, query: qu});
            }
        });
    }

});

router.get('/:id', function (req, res, next) {
   var id = req.params.id;
    db.getIdeaByName(id, function (err, idea) {
        if(err){
            console.log("Error")
        } else {
            res.render('idea', { title: idea.title, idea: idea, authUser: req.user });
        }
    });
});

router.post('/post', function (req, res) {
    var body = req.body;
    var idea_id = mongoose.Types.ObjectId();
    var user_id = body.author;
    var url = body.title.replace(/\s/g,'').toLowerCase();

    var idea = new Idea({
        _id: idea_id,
        url: url,
        title: body.title,
        shortDesc: body.shortDesc,
        longDesc: body.longDesc,
        skills: body.skills,
        author: req.user._id
    });

    console.log("idea", idea);

    idea.save(function (err) {
        if(err){
            console.log(err);
        }
    });

    User.findOneAndUpdate(
        {'_id': req.user._id},
        { $push: { "ideas": idea_id}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if(err){
                console.log(err)
            } else {
                res.send({url: "/partners/"+req.user.url});
            }
        }
    );
});

module.exports = router;
