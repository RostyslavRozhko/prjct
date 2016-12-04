var Ideas = require('./IdeaModel');
var Users = require('./UserModel');

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
                console.log(JSON.stringify(idea, null, 4));
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
                console.log(JSON.stringify(user, null, 4));
                callback(null, user);
            }
        })
};