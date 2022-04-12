const Event = require('../models/eventModel');
const mongoose = require('mongoose');
module.exports = {
    async getEventById(req, res) {

        try{
            const id = mongoose.Types.ObjectId(req.params.id)
            const event = await Event.findById(id)
            if (!event) return res.status(404).send('not found')
            res.status(200).send(event)
        }
       catch(error){
           res.status(400).send(`The event is not found because of this error ${error}`)
       }
    },
    async getAllEvents(req, res) {
        try {
            const events = await Event.find()
            if (!events) return res.status(404).send('not found')
            res.send(events)

        }
        catch (error) {
            res.status(400).send(`The event is not found because of this error ${error}`)
        }
    },

    async getEventsByUserID(req, res) {
        const user_id = req.user._id;
        console.log(user_id);
        const query = { author: user_id }
        try {
            const events = await Event.find(query);
        res.send(events)

        }
        catch(error){
            res.status(400).send(`The event is not found because of this error ${error}`)
        }
        
    },

    async invitations(req, res) {
        const userId = req.user._id;
        console.log(userId);
        const query = { inviteUsers: userId }
        try {
            const events = await Event.find(query);
        res.status(200).send(events)

        }
        catch(error){
            res.status(400).send(`The event invitations is not shown because of this error ${error}`)
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
                  ...(Title && { title: { $regex: new RegExp(Title, 'i') } }),
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
        catch(error){
            res.status(400).send(`The event list is not shown because of this error ${error}`)
        }
    },
    async eventDetails(req, res) {
        const eventId = req.params.id;
        try {
            const event = await Event.findById(eventId).populate('inviteUsers', '-password').exec();
            if (!event) return res.status(404).send('not found');
            res.status(200).send(event)
    }
    catch(error){
        res.status(400).send(`The event details is not shown because of this error ${error}`)
    }

    }        
        

}