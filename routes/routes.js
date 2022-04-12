const error = require('../middlewares/error')
const registerController = require('../controllers/register');
const eventController = require('../controllers/events');
const eventDashboard = require('../controllers/eventDashboard');
const login = require("../controllers/login");
const {paramsId, headerUserId} = require('../middlewares/objectId')
const { userAuth, isLogin } = require('../middlewares/auth');
const { verifyRoles } = require('../middlewares/auth');
const roles_list = require('../config/roles');


module.exports = (app) => {

app.post('/user/login', login.userLogin);
app.post('/user/logout',[userAuth, isLogin], login.userLogout);
app.post('/user/changepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.changePassword);
app.post('/user/resetpassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.resetPassword);
app.post('/user/updatepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.updatePassword);
app.post('/user/registration', registerController.createUser);
app.get('/user',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getAllUser);
app.get('/user/:id', [userAuth, isLogin,paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getUser);

//Events
app.post('/event', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventController.createEvent);
app.get('/event', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.getAllEvents);
app.get('/event/byuser', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.getEventsByUserID);
app.get('/event/invitations', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.invitations);
app.get('/event/list', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.list);
app.get('/event/:id', [userAuth, isLogin,paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.getEventById);
app.get('/eventdetails/:id', [userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.eventDetails);
app.patch('/event/:id', [userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventController.updateEvent);
app.delete('/event/:id', [userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventController.deletedEvent);

app.use(error);

}


