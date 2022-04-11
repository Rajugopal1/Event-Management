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
        const userId = req.user._id;
        console.log(userId);
        const query = { inviteUsers: userId }
        try {
            const events = await Event.find(query);
        res.send(events)

        }
        catch(e){
            res.send(e);
        }
        
    },

    async list(req, res) {
        const query = req.query;
        const Title = req.query.title;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const newEndDate = new Date(
            new Date(endDate).getFullYear(),
            new Date(endDate).getMonth(),
            new Date(endDate).getDate() + 1,
          );
        const queryObj = {
            createdAt: {
                $gte: new Date(startDate),
                $lt: newEndDate,
            }
        };
        try {
            if (!query.page) {
                query.page = 1;
              }
              const totalRecords = await Event.find().count().exec();
              const skip = (query.page - 1) * query.limit;
              const events = await Event.find({
                  ...(Title && { title: Title }),
                    ...(queryObj && queryObj),
                  
                })
            .populate('author', 'userName')
            .sort({createdAt:-1})
            .skip(Number(skip))
            .limit(Number(query.limit))
            .exec();
    
            res.send({
                results:events, 
                total: events.length,
                totalRecords: totalRecords,
                page: query.page,
                limit: query.limit,})
        }
        catch(error) {
            res.send(error);

        }
    },
    async eventDetails(req, res) {
        const eventId = req.params.id;
        const event = await Event.findById(eventId).populate('inviteUsers');
        if (!event) return res.status(404).send('not found');
        res.send(event)

    }        
        

}