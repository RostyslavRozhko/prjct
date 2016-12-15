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
        db.getChats(req.user._id, function (err, data) {
            if (err)
                console.log(err);
            else {
                res.render('messages-chat', {title: 'Messages', authUser: req.user, chatId: id, chats: data[0]});
            }
        });
    }
});

router.post('/getMessages', function (req, res) {
    var chatId = req.body.id;
    db.getMessages(chatId, function (err, data) {
        if(err)
            console.log();
        else {
            console.log(data);
            res.send({messages: data.messages});
        }
    })
});

router.post("/send", function (req, res) {
    var messageBody = {
        author: req.user._id,
        body: req.body.body
    };

    db.postMessage(req.body.chatId, messageBody, function (err, data) {
        if(err)
            console.log(err);
        else {
            res.send({success: true});
        }
    })
});

router.post('/createChat/', function (req, res) {
    var id = req.body.href;
    db.searchChat(id, req.user._id, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send({url: data});
        }
    })
});


module.exports = router;
