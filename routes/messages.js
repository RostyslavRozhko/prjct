var express = require('express');
var router = express.Router();
var db = require('../db/api');
var passport = require('passport');



router.get('/', function(req, res) {
    if(!req.user){
        res.redirect("/login")
    } else {
        db.getChats(req.user._id, function (err, data) {
            if (err)
                console.log(err);
            else {
                console.log(JSON.stringify(data, null, 4));
                res.render('messages', {title: 'Messages', authUser: req.user, chats: data[0]});
            }
        });
    }
});

router.get("/:id", function (req, res) {
    if(!req.user){
        res.redirect("/login")
    } else {
        var id = req.params.id;
        db.getChatsById(id, function (err, chat) {
            if (err)
                console.log(err);
            else {
                db.getChats(req.user._id, function (err, data) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(JSON.stringify(chat, null, 4));
                        res.render('messages-chat', {title: 'Messages', authUser: req.user, chats: data[0], chat: chat});
                    }
                });
            }
        })
    }
});

router.post("/send", function (req, res) {
    var messageBody = {
        author: req.user._id,
        body: req.body.body
    }
    db.postMessage(req.body.id, messageBody, function (err, data) {
        if(err)
            console.log(err);
        else {
            res.redirect('/messages/'+req.body.id);
        }
    })
});


module.exports = router;
