const Event = require('../models/eventModel');
const mongoose = require('mongoose');
module.exports = {
    async getEventById(req, res) {
        const id = mongoose.Types.ObjectId(req.params.id)
        const event = await Event.findById(id)
        if (!event) return res.status(404).send('not found')
        res.send(event)
    },
    async getAllEvents(req, res) {
        const query = req.params
        const events = await Event.find();
        res.send(events)
    },

    async getEventsByUserID(req, res) {
        const user_id = req.user._id;
        console.log(user_id);
        const query = { author: user_id }
        try {
            const events = await Event.find(query);
        res.send(events)

        }
        catch(e){
            res.send(e);
        }
        
    },

    async invitations(req, res) {
        const user_id = req.user._id;
        console.log(user_id);
        const query = { inviteUsers: user_id }
        try {
            const events = await Event.find(query);
        res.send(events)

        }
        catch(e){
            res.send(e);
        }
        
    },

}