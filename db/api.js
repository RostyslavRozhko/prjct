var Ideas = require('./IdeaModel');
var Users = require('./UserModel');
var Chats = require('./ChatModel');
var mongoose = require('./db');

exports.getAllIdeas = function (callback) {
    Ideas.find({})
        .populate('author')
        .sort('-createAt')
        .exec(function (err, ideas) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, ideas);
            }
        })
};

exports.getSearchIdeas = function (query, callback) {
    Ideas.find({skills: query})
        .populate('author')
        .sort('-createAt')
        .exec(function (err, ideas) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, ideas);
            }
        })
};


exports.getIndexIdeas = function (callback) {
    Ideas.find({})
        .limit(3)
        .populate('author')
        .sort('-createAt')
        .exec(function (err, posts) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, posts);
            }
        })
};

exports.getIdeaByName = function (name, callback) {
    Ideas.findOne({url: name})
        .populate('author')
        .exec(function (err, idea) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, idea);
            }
        })
};

exports.getAllUsers = function (callback) {
    Users.find({})
        .sort('-createAt')
        .exec(function (err, users) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, users);
            }
        })
};

exports.getPartnerByName = function(name, callback){
    Users.findOne({url: name})
        .populate('ideas')
        .exec(function (err, user) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, user);
            }
        })
};

exports.getChats = function (user, callback) {
    Users.find({_id: user})
        .select("chats")
        .populate("chats.to", "name img")
        .populate("chats.messages")
        .exec(function (err, user) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, user);
            }
        })

};

exports.getChatsById = function (id, callback) {
    Chats.findOne({_id: id})
        .populate('messages.author', 'name img url')
        .exec(function (err, chat) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, chat);
            }
        })
};

exports.searchChat = function (user1, user2, callback) {
    Users.findOne({_id:user1, chats: user2})
        .exec(function (err, ideas) {
            if(err){
                onErr(err,callback);
            }else{
                callback(null, ideas);
            }
        });
};

exports.createChat = function (user1, user2, callback) {
    var chatId = mongoose.Types.ObjectId();
    var chat = new Chats({
        _id: chatId
    });
    chat.save(function(err){
        if(err)
            onErr(err,callback);
        else{
            addChatToUser(user1, user2, chatId);
            addChatToUser(user2, user1, chatId);
        }

    });


    function addChatToUser(user1, user2, chatId) {
        Users.findOneAndUpdate(
            {'_id': user1},
            { $push: {
                chats: {
                    to: user2,
                    messages: chatId
                }
            }},
            {safe: true, upsert: true, new : true},
            function(err, model) {
                if(err){
                    onErr(err,callback);
                } else {
                    callback(null, model);
                }
            }
        );

    }
};

exports.postMessage = function(chatId, message, callback){
    Chats.findOneAndUpdate(
        {'_id': chatId},
        { $push: {
            messages: {
                author: message.author,
                body: message.body
            }
        }},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if(err){
                onErr(err,callback);
            } else {
                callback(null, model);
            }
        }
    );
};