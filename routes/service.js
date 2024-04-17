const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const ServiceModel = require('../models/service');


router.get('/', auth, async (req, res) => {
    try {
        const services = await ServiceModel.findAll();
        res.status(200).send(services);
    } catch (error) {
        res.status(400).send(error);
    }
})


router.get('/:id', async (req, res) => {
    const service = await ServiceModel.findByPk(req.params.id);
    if( !service ) return res.status(400).send("Giving Service ID not found.");

    try {
        const service = await ServiceModel.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send(service);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/', async (req, res) => {
    const {error} = validateService(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        await ServiceModel.create({
            service_name: req.body.name
        });
        res.status(201).send("Operation Done Successfully.");
    } catch (error) {
        res.status(400).send(error);
    }
})

router.put('/:id', async (req, res) => {
    const {error} = validateService(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const service = await ServiceModel.findByPk(req.params.id);
    if( !service ) return res.status(400).send("Giving Service ID not found.");


    try {
        await ServiceModel.update({
            service_name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).send("Operation Done Successfully.");
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/:id',  [auth, admin], async (req, res) => {
    const service = await ServiceModel.findByPk(req.params.id);
    if( !service ) return res.status(400).send("Giving Service ID not found.");

    try {
        await ServiceModel.destroy({
            where: {
              id: req.params.id
            }
        });
        res.status(204).send('Operation Done Successfully.');
    } catch (error) {
        res.status(400).send(error);
    }
})


function validateService(service) {
    const serviceSchema = {
        name: Joi.string().required()
    };

    return Joi.validate(service, serviceSchema);
}


module.exports = router;