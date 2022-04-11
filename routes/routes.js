const express=require("express");
const bodyParser=require("body-parser");
const session = require('express-session');
const JWT = require("jsonwebtoken");
const mongoose= require("mongoose");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const app= express();

const error = require('../middlewares/error')
const registerController = require('../controllers/register');
const eventController = require('../controllers/events');
const eventDashboard = require('../controllers/eventDashboard');
const login = require("../controllers/login");
const {paramsId, headerUserId} = require('../middlewares/objectId')
const { userAuth, isLogin } = require('../middlewares/auth');


module.exports = (app) => {

app.post('/user/login', login.userLogin);
app.post('/user/logout',[userAuth, isLogin], login.userLogout);
app.post('/user/registration', registerController.createUser);
app.get('/user',[userAuth, isLogin], registerController.getAllUser);
app.get('/user/:id', [userAuth, isLogin,paramsId], registerController.getUser);

//Events
app.post('/event', [userAuth, isLogin], eventController.createEvent);
app.get('/event', [userAuth, isLogin], eventDashboard.getAllEvents);
app.get('/event/byuser', [userAuth, isLogin], eventDashboard.getEventsByUserID);
app.get('/event/invitations', [userAuth, isLogin], eventDashboard.invitations);
app.get('/event/list', [userAuth, isLogin], eventDashboard.list);
app.get('/event/:id', [userAuth, isLogin], eventDashboard.getEventById);
app.get('/eventdetails/:id', [userAuth, isLogin], eventDashboard.eventDetails);
app.patch('/event/:id', [userAuth, isLogin], eventController.updateEvent);
app.delete('/event/:id', [userAuth, isLogin],eventController.deletedEvent);

app.use(error);

}


