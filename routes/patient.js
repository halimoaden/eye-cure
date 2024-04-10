const Joi = require('joi');
const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const PatientModel = require('../models/patient');
const VillageModel = require('../models/village');
const DistrictModel = require('../models/district');

router.get('/', auth, async (req, res) => {

    try{
        const patients = await PatientModel.findAll({
            include: [{
                model: VillageModel,
                attributes: ['village_name', 'district_id'],
                include: {
                    model: DistrictModel,
                    attributes: ['district_name']
                }
            }]
        });
        res.status(200).send(patients);
    }catch(error){
        res.status(404).send(error.message);
    }
})


router.post('/', [auth, admin], async (req, res) => {
    
    const { error } = validatePatient(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    try{
        const patient = await PatientModel.create({ 
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            village_id: req.body.village_id
        });

        res.status(201).send(patient);
    }catch(error){
        res.status(404).send(error.message);
    }
})

router.get('/:id', auth, async (req, res) => {

    const patient = await PatientModel.findByPk(req.params.id);
    if( !patient ) return res.status(400).send('Giving Patient ID not found.');

    try{
        const patient = await PatientModel.findAll({
            where: {
                id: req.params.id
            },
            include:[{
                model: VillageModel,
                attributes: ['village_name', 'district_id'],
                include: {
                    model: DistrictModel,
                    attributes: ['district_name']
                }
            }]
        });

        res.status(200).send(patient);
    }catch(error){
        res.status(404).send(error.message);
    }
})

router.put('/:id', [auth, admin], async (req, res) => {
    const patient = await PatientModel.findByPk(req.params.id);
    if( !patient ) return res.status(400).send('Giving Patient ID not found.');

    const { error } = validatePatient(req.body);
    if( error ) return res.status(400).send(error.details[0].message);


    try {
        PatientModel.update({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            village_id: req.body.village_id
        },{
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
    const patient = await PatientModel.findByPk(req.params.id);
    if( !patient ) return res.status(400).send('Giving Patient ID not found.');

    try {
        await PatientModel.destroy({
            where: {
              id: req.params.id
            }
        });
        res.status(204).send('Operation Done Successfully.');
    } catch (error) {
        res.status(404).send(error.message);
    }

})


function validatePatient(patient) {
    const patientSchema = {
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string(),
        village_id: Joi.number().required()
    };

    return Joi.validate(patient, patientSchema);
}


module.exports = router;