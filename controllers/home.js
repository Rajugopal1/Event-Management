const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const image = require("../models/imagesModel");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports = {
    async home(req, res) {
        try {
        const userID = req.user._id;
        let role= '';
        const imageData = await image.find()
        const userData = await User.findOne({
        ...(role && { role: 'ADMIN' || 'GUESTUSER' }),
       }).select('-password').select('-role');
        res.send({userData : userData, imageData : imageData});
    }
        catch (err) {
            res.send({"message" :err.message})
        }
            
    },

    async upload (req, res){
        let upload = req.body;
        const userID = req.user._id;
        const fileName = req.file.filename;
        try{
           const userData = await User.findOne({_id: userID})
           if(userData.role === 'ADMIN'){
            const uploadData = await image.create({...upload, image: fileName});
            res.send({
                _id : uploadData._id,
                image: uploadData.image
            })
           }
            
        }
        catch(e){
            res.send({"message": e.message})
        }

    }
}