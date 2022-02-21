const { check, validationResult } = require("express-validator");

const Event = require('../models/eventModel');
const User = require("../models/userModel");

module.exports = {
    async createEvent(req, res) {
        await check('title')
            .trim()
            .isLength({ min: 4, max: 30 })
            .withMessage('Title should be 4 till 30 characters').run(req);
        await check('eventType')
            .notEmpty()
            .withMessage('Enter the event type')
            .run(req)
        await check('price')
            .isNumeric()
            .isInt({ min: 1 })
            .withMessage('Price should greater then zero').run(req);
        await check('_id').custom(async (id,{req}) => {
            const user = await User.findById(req.user._id)
           
            if (!user)
                throw new Error('User is not exist')
            return true;
        }).run(req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors);
        const { title, description, inviteUsers, price,eventType} = req.body;
        const author = req.user._id;
       
        let event = new Event({
            title,
            description,
            eventType,
            price,
            author,
            inviteUsers,
            
        })
        event = await event.save();
        res.send(event)
    },

    async deletedEvent(req, res){
        const eventId = req.params.id;
        const userId= req.user._id;;
        let event = await Event.findById(eventId)
        if (!event) return res.status(404).send('Event is not found')
       if(event.user.toString() !== userId)  return res.status(401).send('No authorization');
         event = await Event.findByIdAndDelete(eventId)
        if(!event) return res.status(404).send('Event is not found')
        res.status(204).send('');
    }
}