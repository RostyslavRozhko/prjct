var express = require('express');
var db = require('../db/api');
var router = express.Router();
var User = require('../db/UserModel');

router.get('/', function(req, res, next) {
    db.getAllUsers(function (err, partners) {
        if(err){
            console.log("Error")
        } else {
            res.render('partners-list', { title: 'Partners', partners: partners, authUser: req.user });
        }
    });

});

router.get('/:id', function (req, res) {
    var id = req.params.id;
    db.getPartnerByName(id, function (err, partner) {
        if(err){
            console.log("Error")
        } else {
            res.render('profile', {title: partner.name, partner: partner, authUser: req.user})
        }
    });

});

router.get('/:id/post', function (req, res, next) {
    var id = req.params.id;
    db.getPartnerByName(id, function (err, partner) {
        if(err){
            console.log("Error")
        } else {
            if(req.user && partner._id+"" == req.user._id+"")
                res.render('postidea', {title: partner.name, partner: partner, authUser: req.user})
            else
                res.redirect('/partners/'+id);
        }
    });
});

router.post('/edit', function (req, res) {
    var data  = req.body;

    User.findOneAndUpdate(
        {'_id': req.user._id},
        { $set: {
            desc: data.desc,
            name: data.name,
            skills: data.skills
        }},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if(err){
                console.log(err)
            } else {
                res.send({success: true});
            }
        }
    );
});

module.exports = router;
