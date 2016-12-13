var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        desc: String,
        email: String,
        password: String,
        img: String,
        ideas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ideas' }],
        skills: Array,
        name: String,
        url: String,
        googleId: String
    },
    {collection: 'users'});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('Users', userSchema);
