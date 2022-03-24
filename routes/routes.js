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
const login = require("../controllers/login");
const homeController = require("../controllers/home")
const {paramsId, headerUserId} = require('../middlewares/objectId')
const { userAuth, isLogin } = require('../middlewares/auth');


module.exports = (app) => {

app.post('/user/login', login.userLogin);
app.post('/user/logout',[userAuth, isLogin], login.userLogout);
app.post('/user/registration', registerController.createUser);
app.get('/home',[userAuth, isLogin], homeController.home);
app.post('/upload',upload.single('image'),[userAuth, isLogin], homeController.upload);
app.get('/user',[userAuth, isLogin], registerController.getAllUser);
app.get('/user/:id', [userAuth, isLogin,paramsId], registerController.getUser);

app.use(error);

}


