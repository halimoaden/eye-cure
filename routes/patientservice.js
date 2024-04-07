const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const PatientServiceModel = require('../models/patientservice')
const PatientMOdel = require('../models/patient')
const ServiceModel = require('../models/service')
const UserModel = require('../models/user')

router.get('/', async (req, res) => {
    try {
        const infos = await PatientServiceModel.findAll({
            include: [
                {
                    model: ServiceModel,
                    attributes: ['service_name']
                },
                {
                    model: PatientMOdel,
                    attributes: ['name', 'phone', 'email']
                },
                {
                    model: UserModel,
                    attributes: ['user_name', 'full_name', 'email', 'phone', 'is_admin','user_status']
                }
            ],
        })
        res.status(200).send(infos)
    } catch (error) {
        res.status(404).send(error.message)
    }
});


router.get('/:id', async (req, res) => {

    const info = await PatientServiceModel.findByPk(req.params.id);
    if(!info) return res.status(400).send('Giving Patient Service ID not found.');

    try {
        const info = await PatientServiceModel.findAll({
            include: [
                {
                    model: ServiceModel,
                    attributes: ['service_name']
                },
                {
                    model: PatientMOdel,
                    attributes: ['name', 'phone', 'email']
                },
                {
                    model: UserModel,
                    attributes: ['user_name', 'full_name', 'email', 'phone', 'is_admin', 'user_status']
                }
            ]
        }, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).send(info)
    } catch (error) {
        res.status(404).send(error.message)
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validateServiceInfo(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    try {
        await PatientServiceModel.create({
            patient_id: req.body.patient_id,
            service_id: req.body.service_id,
            due_amount: req.body.due_amount,
            status_info: req.body.status_info,
            user_id: req.body.user_id
        });
        res.status(201).send("Operation Done Successfully.")
    } catch (error) {
        res.status(404).send(error)
    }

});

router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validateServiceInfo(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    const patient = await PatientServiceModel.findByPk(req.params.id);
    if( !patient ) return res.status(400).send("Giving Patient Service ID not found.");

    try {
        await PatientServiceModel.update({
            patient_id: req.body.patient_id,
            service_id: req.body.service_id,
            due_amount: req.body.due_amount,
            status_info: req.body.status_info,
            user_id: req.body.user_id
        }, {
            where: {
                id: req.params.id
            }
        });

        res.status(201).send("Operation Done Successfully.")
    } catch (error) {
        res.status(404).send(error)
    }
})


router.delete('/:id', [auth, admin], async (req, res) => {
    const patient = await PatientServiceModel.findByPk(req.params.id)
    if( !patient ) return res.status(400).send('Giving Patient Service ID not found.')

    try {
        await PatientServiceModel.destroy({
            where: {
              id: req.params.id
            }
        })
        res.status(204).send('Operation Done Successfully.')
    } catch (error) {
        res.status(404).send(error.message)
    }
})




function validateServiceInfo(info) {
    const serviceInfoSchema = {
        patient_id: Joi.number().required(),
        service_id: Joi.number().required(),
        due_amount: Joi.number().required(),
        status_info: Joi.number(),
        user_id: Joi.number().required()
    }

    return Joi.validate(info, serviceInfoSchema)
}



module.exports = router;