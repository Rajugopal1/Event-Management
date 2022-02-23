const express=require("express");
const bodyParser=require("body-parser");
const JWT = require("jsonwebtoken");
const mongoose= require("mongoose");
const app= express();

const error = require('./middlewares/error')
const registerController = require('./controllers/register');
const login = require("./controllers/login");
const {paramsId, headerUserId} = require('./middlewares/objectId')
const { userAuth, isLogin } = require('./middlewares/auth');
const event = require('./controllers/events')
const eventDashBoard = require('./controllers/eventDashboard');




app.use(bodyParser.json())
app.use(express())
app.use(bodyParser.urlencoded(
    {
        extended:true
    }
))

app.post('/user/login', login.userLogin);
app.post('/user/registration', registerController.createUser);
app.get('/user', registerController.getAllUser);
app.get('/user/:id', registerController.getUser);

/**Events */
app.post('/event', [userAuth, isLogin], event.createEvent);
app.delete('/event/:id', [userAuth, isLogin,paramsId], event.deletedEvent);

/**Event Dashboard */
app.get('/event/byuser', [userAuth, isLogin,  headerUserId], eventDashBoard.getEventsByUserID);
app.get('/event/invitations', [userAuth, isLogin, headerUserId], eventDashBoard.invitations);
app.get('/event', eventDashBoard.getAllEvents);
app.get('/event/:id', [userAuth, isLogin, paramsId],eventDashBoard.getEventById);





app.listen((5000), () => {
    console.log("Listening on port 5000")
})

//create connection to connect to mongoDb:
let db = mongoose.connect('mongodb://localhost:27017/EventManagement',{});


 db = mongoose.connection;
//test the connection
db.on('error',()=>console.log("error in connecting to database"))
db.once('open',()=>console.log("connected to database"))

app.use(error);