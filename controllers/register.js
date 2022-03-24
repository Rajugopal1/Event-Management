const { check, validationResult } = require('express-validator');
const User = require('../models/userModel')

const validationInput = async (req) => {

    await check('city')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('city should be 3 to 20 characters').run(req);
    await check('qualification')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('qualification should be 3 to 20 characters').run(req);
    await check('userName')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("'userName should be 3 to 20 characters'")
        .custom(async userName => {
            const registerUser = await User.findOne({ userName });
            if (registerUser) throw new Error('User is already register');
        })
        .run(req);
    await check('password')
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage('Password should be 6 to 20 characters').run(req)
    await check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw new Error('Password confirmation does not match password');
            return true;
        }).run(req)

}

module.exports = {
    async createUser(req, res) {
        try {
            await validationInput(req);
            const errors = validationResult(req)

            if (!errors.isEmpty()) return res.status(400).send(errors)
            let registerUser = req.body;
            registerUser.password = await User.createPassword(registerUser.password)
            registerUser = await User.create(registerUser)
            return res.send({
                _id: registerUser._id,
                userName: registerUser.userName,
                password: registerUser.password,
                qualification: registerUser.qualification,
                city: registerUser.city,
                phoneNumber: registerUser.phoneNumber,
            })
        } catch (error) {
            res.status(400).send(`The user is not register because of this error ${error}`)
        }
    },
    async getAllUser(req, res) {
        try {
    
            const user = await User.find()
            if (!user) return res.status(404).send('Not exist');
            res.send(user)
        } catch (error) {
            res.status(400).send(`The user is not register because of this error ${error}`)
        }
    },
    async getUser(req, res) {
        try {
    
            const id = req.params.id;
            const user = await User.findById(id)
            if (!user) return res.status(404).send('Not exist');
            res.send(user)
        } catch (error) {
            res.status(400).send(`The user is not register because of this error ${error}`)
        }
    }
}


