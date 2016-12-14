var db = require('mongoose');

var chatsSchema = new db.Schema({
    _id: db.Schema.Types.ObjectId,
    messages: [
            {
                author: {type: db.Schema.Types.ObjectId, ref: 'Users'},
                date: { type : Date, default: Date.now },
                body: String
            }
        ]
    },
    { collection: 'chats' });

module.exports = db.model('Chats', chatsSchema);
