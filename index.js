const express = require('express');
const bodyParser = require('body-parser');

const {dbConn, dbSync} = require('./config/db_config');

// All Database MODELS and RELATIONSHIPS
// require('./models/models');

const UserModel = require('./models/user');
const DistrictModel = require('./models/district');
const VillageModel = require('./models/village');
const PatientModel = require('./models/patient');
const ServiceModel = require('./models/service');
const PatientServiceModel = require('./models/patientservice');
const PaymentModel = require('./models/payment');

DistrictModel.hasMany(VillageModel, { foreignKey: 'district_id' });
VillageModel.belongsTo(DistrictModel, { foreignKey: 'district_id' });

VillageModel.hasMany(PatientModel, { foreignKey: 'village_id' });
PatientModel.belongsTo(VillageModel, { foreignKey: 'village_id' });

ServiceModel.hasMany(PatientServiceModel, { foreignKey: 'service_id' });
PatientServiceModel.belongsTo(ServiceModel, { foreignKey: 'service_id' });
PatientModel.hasMany(PatientServiceModel, { foreignKey: 'patient_id' });
PatientServiceModel.belongsTo(PatientModel, { foreignKey: 'patient_id' });
UserModel.hasMany(PatientServiceModel, { foreignKey: 'user_id'});
PatientServiceModel.belongsTo(UserModel, { foreignKey: 'user_id'});

PatientServiceModel.hasMany(PaymentModel, { foreignKey: 'pat_ser_id' });
PaymentModel.belongsTo(PatientServiceModel, { foreignKey: 'pat_ser_id' });
UserModel.hasMany(PaymentModel, { foreignKey: 'user_id' });
PaymentModel.belongsTo(UserModel, { foreignKey: 'user_id' });

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).send('Home Page');
});


// All API Routes
require('./routes/routes')(app);

const port = 8080;

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await dbConn();
    // await dbSync()
});