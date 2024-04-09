require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/user');

router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findOne({
        where: {
            email: req.body.email
        }
    });
    if( !user ) return res.status(400).send('Invalid Email or Password.');

    const validUser = await bcrypt.compare(req.body.password, user.password);
    if( !validUser ) return res.status(400).send('Invalid Email or Password.');

    const token = jwt.sign({ id: user.id, username: user.user_name, isAdmin: user.is_admin }, process.env.JWT_PRIVATE_KEY , {expiresIn: 180});
    res.header('x-auth-token', token).status(200).send(token);
    
});


function validateAuth(req) {
    const AuthSchema = {
        email: Joi.string().required(),
        password: Joi.string().required()
    };

    return Joi.validate(req, AuthSchema);
}


module.exports = router;