const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/user');

const pickData = [
    'id',
    'full_name',
    'email',
    'phone',
    'user_name',
    'user_status',
    'is_admin',
    'createdAt',
    'updatedAt'
];


router.get('/me', auth, async (req, res) => {
    const user = await UserModel.findByPk(req.user.id);

    var pickData = [
        'user_name',
        'id',
        'full_name',
        'email',
        'phone',
        'createdAt',
        'updatedAt',
        'user_status',
        'is_admin'
    ];

    res.status(200).send(_.pick(user, pickData));
})

router.get('/', async (req, res) => {
    try {
        const users = await UserModel.findAll({
            attributes: pickData
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(404).send(error.message);
    }
})


router.get('/:id', async (req, res) => {
    const user = await UserModel.findByPk(req.params.id);
    if( !user ) return res.status(400).send('Givig User ID not found.');

    try {
        const users = await UserModel.findAll({
            where: {
                id: req.params.id
            },
            attributes: pickData
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    try {

        var onlyPick = [
            'full_name',
            'user_name',
            'email',
            'phone',
            'user_status',
            'password',
            'is_admin'
        ];

        const userData = UserModel.build({
            full_name: req.body.full_name,
            user_name: req.body.user_name,
            email: req.body.email,
            phone: req.body.phone,
            user_status: req.body.user_status,
            password: req.body.password,
            is_admin: req.body.is_admin
        });

        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
        const user = userData.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send(error.message);
    }
})


router.put('/:id', auth , async (req, res) => {
    const { error } = validateUser(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findByPk(req.params.id);
    if( !user ) return res.status(400).send('Givig User ID not found.');

    try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(req.body.password, salt);
        await UserModel.update({
            full_name: req.body.full_name,
            user_name: req.body.user_name,
            email: req.body.email,
            phone: req.body.phone,
            user_status: req.body.user_status,
            password: password,
            is_admin: req.body.is_admin
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).send("Operation Done Successfully.");
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await UserModel.findByPk(req.params.id);
    if( !user ) return res.status(400).send('Givig User ID not found.');

    try {
        await UserModel.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send('Operation Done Successfully.');
    } catch (error) {
        res.status(404).send(error.message);
    }
})


function validateUser(user) {
    const userSchema = {
        full_name: Joi.string().required(),
        user_name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
        user_status: Joi.number(),
        is_admin: Joi.number()
    };

    return Joi.validate(user, userSchema);
}
module.exports = router;