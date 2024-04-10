const Joi = require('joi');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const PaymentModel = require('../models/payment');
const UserModel = require('../models/user');
const PatientServiceModel = require('../models/patientservice');
const ServiceModel = require('../models/service');
const PatientModel = require('../models/patient');
const VillageModel = require('../models/village');
const DistrictModel = require('../models/district');

router.get('/', auth, async(req, res) => {
    try {
        const payments = await PaymentModel.findAll({
            include: [
                {
                    model: PatientServiceModel,
                    attributes: ['patient_id', 'service_id', 'user_id', 'due_amount', 'status_info'],
                    include: [
                        {
                            model: ServiceModel,
                            attributes: ['service_name'],
                        },
                        {
                            model: PatientModel,
                            attributes: ['name', 'phone', 'email'],
                            include: [{
                                model: VillageModel,
                                attributes: ['village_name', 'district_id'],
                                include: {
                                    model: DistrictModel,
                                    attributes: ['district_name']
                                }
                            }]
                        }
                    ]
                     
                },
                {
                    model: UserModel,
                    attributes: ['user_name', 'full_name', 'email', 'phone', 'is_admin', 'user_status']
                }
            ]
        });
        res.status(200).send(payments);
    } catch (error) {
        res.status(404).send(error.message);
    }
});


router.get('/:id', auth, async(req, res) => {
    const payment = await PaymentModel.findByPk(req.params.id);
    if( !payment ) return res.status(404).send('Givig Payment ID not found.');


    try {
        const payments = await PaymentModel.findAll({
            include: [
                {
                    model: PatientServiceModel,
                    attributes: ['patient_id', 'service_id', 'user_id', 'due_amount', 'status_info'],
                    include: [
                        {
                            model: ServiceModel,
                            attributes: ['service_name'],
                        },
                        {
                            model: PatientModel,
                            attributes: ['name', 'phone', 'email'],
                            include: [{
                                model: VillageModel,
                                attributes: ['village_name', 'district_id'],
                                include: {
                                    model: DistrictModel,
                                    attributes: ['district_name']
                                }
                            }]
                        }
                    ]
                     
                },
                {
                    model: UserModel,
                    attributes: ['user_name', 'full_name', 'email', 'phone', 'is_admin', 'user_status']
                }
            ],
            where: {
                id: req.params.id
            }
        });
        res.status(200).send(payments);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validatePayment(req.body);
    if( error ) return res.status(400).send(error.details[0].message);


    try {
        await PaymentModel.create({
            pat_ser_id: req.body.pat_ser_id,
            user_id: req.body.user_id,
            payment_method: req.body.payment_method,
            amount: req.body.amount,
            payment_status: req.body.payment_status
        });
        res.status(201).send("Operation Done Successfully.");
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validatePayment(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    const payment = await PaymentModel.findByPk(req.params.id);
    if(!payment) return res.status(404).send('Giving Payment ID not found.');

    try {
        await PaymentModel.update({
            pat_ser_id: req.body.pat_ser_id,
            user_id: req.body.user_id,
            payment_method: req.body.payment_method,
            amount: req.body.amount,
            payment_status: req.body.payment_status
        },{
            where: {
                id: req.params.id
            }
        });
        res.status(200).send("Operation Done Successfully.");
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/:id', [auth, admin], async (req, res) =>{
    const payment = await PaymentModel.findByPk(req.params.id);
    if(!payment) return res.status(404).send('Giving Payment ID not found.');

    try {
        await PaymentModel.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send('Operation Done Successfully.');
    } catch (error) {
        res.status(404).send(error.message);
    }
})


function validatePayment(payment) {
    const paymentSchema = {
        pat_ser_id: Joi.number().required(),
        user_id: Joi.number().required(),
        payment_method: Joi.string().required(),
        amount: Joi.number().required(),
        payment_status: Joi.number()
    };

    return Joi.validate(payment, paymentSchema);
}

module.exports = router;