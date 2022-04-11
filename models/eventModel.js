const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    eventType: String,
    date: { type: Date, default: Date.now },
    inviteUsers: {
        type: [mongoose.Types.ObjectId],
        ref: 'User'
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    createdBy: mongoose.Types.ObjectId,
}, {timestamps: true});

const Event = mongoose.model('Event', eventSchema)
module.exports = Event;