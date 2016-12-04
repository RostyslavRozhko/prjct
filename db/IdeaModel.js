var db = require('mongoose');

var ideaSchema = new db.Schema({
        _id: db.Schema.Types.ObjectId,
        author: { type: db.Schema.Types.ObjectId, ref: 'Users' },
        longDesc: String,
        shortDesc: String,
        skills: Array,
        title: String,
        url: String
    },
    { collection: 'ideas' });

module.exports = db.model('Ideas', ideaSchema);
