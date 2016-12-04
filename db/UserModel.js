var db = require('mongoose');

var userSchema = new db.Schema({
        _id: db.Schema.Types.ObjectId,
        desc: String,
        email: String,
        img: String,
        ideas: [{ type: db.Schema.Types.ObjectId, ref: 'Ideas' }],
        skills: Array,
        name: String,
        url: String
    },
    {collection: 'users'});


module.exports = db.model('Users', userSchema);
