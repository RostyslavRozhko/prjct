var express = require('express');
var db = require('../db/api');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var User = require('../db/UserModel');

router.get('/', function(req, res, next) {
    var qu = req.query.search;
    var query = new RegExp(qu, "i");
    if (!query) {
        db.getAllUsers(function (err, partners) {
            if(err){
                console.log("Error")
            } else {
                res.render('partners-list', { title: 'Partners', partners: partners, authUser: req.user });
            }
        });
    } else {
        db.getSearchUsers(query, function (err, partners) {
            if (err) {
                console.log("Error")
            } else {
                res.render('partners-list', { title: 'Partners', partners: partners, authUser: req.user, query: qu });
            }
        });
    }

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

router.post("/edit/upload/image", function (req, res) {
    if(req.user) {
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
            var fstr = fs.createWriteStream(path.resolve(".") + '/public/files/' + filename);
            file.pipe(fstr);
            fstr.on('close', function () {
                db.updateUserImage(req.user._id, filename, function (err, data) {
                    if (err)
                        console.log(err);
                    else
                        res.redirect('/partners/' + req.user.url);
                })
            });
        });
    }
    else
        res.redirect("/")
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
