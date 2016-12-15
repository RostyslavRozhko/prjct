var Ideas = require('./IdeaModel');
var Users = require('./UserModel');
var Chats = require('./ChatModel');
var mongoose = require('./db');

var onErr = function(err,callback){
    mongoose.connection.close();
    callback(err);
};

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

exports.getSearchUsers = function (query, callback) {
    Users.find({skills: query})
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
    Users.findOne({_id:user1, "chats.to": user2})
        .exec(function (err, user) {
            if(err){
                onErr(err,callback);
            }else if(user){
                console.log(user);
                console.log("user found");
                user.chats.forEach(function (one) {
                    console.log(one.to, user2);
                    if(one.to+"" == user2+"") {
                        console.log(one.messages);
                        callback(null, one.messages);
                    }
                });
            } else {
                console.log("user not found");
                console.log(1, user1, user2);
                createChat(user1, user2, function (err, chatId) {
                    if(err)
                        console.log(err);
                    else {
                        console.log(chatId);
                        callback(null, chatId)
                    }
                })
            }
        });
};

var createChat = function (user1, user2, callback) {
    console.log(2, user1, user2);
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
            callback(null, chatId);
        }

    });


    function addChatToUser(user1, user2, chatId) {
        console.log(3,user1, user2);
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
                    ;
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

exports.getMessages = function(chatId, callback){
    Chats.findOne({'_id': chatId})
        .populate('messages.author', 'name img url')
        .exec(function (err, chat) {
            if(err)
                onErr(err,callback);
            else
                callback(null, chat);
        })


};

exports.findLocalUser = function (username, password, callback) {
    Users.findOne({ email : username},function(err,user){
        return err
            ? callback(err)
            : user
            ? password === user.password
            ? callback(null, user)
            : callback(null, false, { message: 'Incorrect password.' })
            : callback(null, false, { message: 'Incorrect username.' });
    });
};

exports.findOrCreateGoogleUser = function (accessToken, refreshToken, profile, done) {
    Users.findOne({ 'googleId' : profile.id }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
            // if a user is found, log them in
            return done(null, user);
        } else {
            // if the user isnt in our database, create a new user
            var newUser = new Users();

            // set all of the relevant information
            newUser._id  = mongoose.Types.ObjectId();
            newUser.googleId = profile.id;
            newUser.name  = profile.displayName;
            newUser.url = profile.displayName.replace(/\s/g,'').toLowerCase()+"g";
            newUser.email = profile.emails[0].value;
            newUser.img = profile.photos[0].value+"0";
            newUser.chats = [{ messages: "585198a0b3930e18c0bd0000", to: "584feb58484a5a26d0a5ac29" }];

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
    });
};
