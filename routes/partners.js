var express = require('express');
var db = require('../db/api');
var router = express.Router();

router.get('/', function(req, res, next) {
    db.getAllUsers(function (err, partners) {
        if(err){
            console.log("Error")
        } else {
            res.render('partners-list', { title: 'Partners', partners: partners, authUser: req.user });
        }
    });

});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    db.getPartnerByName(id, function (err, partner) {
        if(err){
            console.log("Error")
        } else {
            res.render('profile', {title: id, partner: partner, authUser: req.user})
        }
    });

});

module.exports = router;
