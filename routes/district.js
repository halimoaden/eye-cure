const Joi = require('joi');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


// district model
const DistrictModel = require('../models/district');


// get all Districts

router.get('/', async (req, res) => {
    try {
        const districts = await DistrictModel.findAll();
        res.status(200).send(districts);
    } catch (error) {
        res.status(400).send(error);
    }
});

// get single district by its id

router.get('/:id', async (req, res) => {

    const district = await DistrictModel.findByPk(req.params.id);
    if( !district ) return res.status(400).send("Giving District ID not found.");

    try {
        const districts = await DistrictModel.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(201).send(districts);
    } catch (error) {
        res.status(400).send(error);
    }

});

// create a district

router.post('/', async (req, res) => {
    const {error} = validateDistrict(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        await DistrictModel.create({
            district_name: req.body.name
        })
        res.status(201).send("Operation Done Successfully.");
    } catch (error) {
        res.status(400).send(error);
    }
});

// update a district

router.put('/:id', [auth, admin], async(req, res) => {

    const district = await DistrictModel.findByPk(req.params.id);
    if( !district ) return res.status(400).send("Giving District ID not found.");

    const {error} = validateDistrict(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        await DistrictModel.update({
            district_name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).send("Operation Done Successfully.");
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete a district
router.delete('/:id', [auth, admin], async (req, res) => {

    const district = await DistrictModel.findByPk(req.params.id);
    if( !district ) return res.status(400).send("Giving District ID not found.");

    try {
        await DistrictModel.destroy({
            where: {
              id: req.params.id
            }
        });
        res.status(204).send('Operation Done Successfully.');
    } catch (error) {
        res.status(400).send(error);
    }

});

function validateDistrict(district) {
    const districtSchema = {
        name: Joi.string().required()
    };

    return Joi.validate(district, districtSchema);
}


module.exports = router;