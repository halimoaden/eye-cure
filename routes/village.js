const Joi = require('joi')
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')


const VillageModel = require('../models/village');
const DistrictModel = require('../models/district');

router.get('/', async (req, res) => {

    try {
        const villages = await VillageModel.findAll({
            include: {
                model: DistrictModel,
                attributes: ['district_name']
            }
        });
        res.status(200).send(villages)
    } catch (error) {
        res.status(404).send(error)
    }
})


router.get('/:id', async (req, res) => {
    const village = await VillageModel.findByPk(req.params.id)
    if( !village ) return res.status(400).send("Giving Village ID not found.")

    try {
        const village = await VillageModel.findOne({
            include: {
                model: DistrictModel,
                attributes: ['district_name']
            },
            where: {
                id: req.params.id
            }
        });
        res.status(200).send(village)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateVillage(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    try {
        const village = await VillageModel.create({
            village_name: req.body.name,
            district_id: req.body.district_id
        })
        res.status(201).send(village)
    } catch (error) {
        res.status(404).send(error)
    }
})


router.put('/:id', [auth, admin], async (req, res) => {
    const village = await VillageModel.findByPk(req.params.id)
    if( !village ) return res.status(400).send("Giving Village ID not found.")

    const {error} = validateVillage(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    try {
        const village = await VillageModel.update({
            village_name: req.body.name,
            district_id: req.body.district_id
        }, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).send(village)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const village = await VillageModel.findByPk(req.params.id)
    if( !village ) return res.status(400).send("Giving Village ID not found.")

    try {
        await VillageModel.destroy({
            where: {
              id: req.params.id
            }
        })
        res.status(204).send('Operation Done Successfully.')
    } catch (error) {
        res.status(400).send(error)
    }
})

function validateVillage(village) {
    const villageSchema = {
        name: Joi.string().required(),
        district_id: Joi.number().required()
    }
    return Joi.validate(village, villageSchema)
}



module.exports = router;