const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title: {type:String, required: true},
    timestamp: {type: Date, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: {type:String, required: true}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;