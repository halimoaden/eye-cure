const UserModel = require('./user');
const DistrictModel = require('./district');
const VillageModel = require('./village');
const PatientModel = require('./patient');
const ServiceModel = require('./service');
const PatientServiceModel = require('./patientservice');
const PaymentModel = require('./payment');

module.exports = function(){
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
}

