const PatientRoute = require('./patient');
const DistrictRoute = require('./district');
const VillageRoute = require('./village');
const ServiceRoute = require('./service');
const PatientServiceRoute = require('./patientservice');
const UserRoute = require('./user');
const PaymentRoute = require('./payment');
const AuthRoute = require('./auth');

module.exports = function(app) {
    app.use('/api/patients', PatientRoute);
    app.use('/api/districts', DistrictRoute);
    app.use('/api/villages', VillageRoute);
    app.use('/api/services', ServiceRoute);
    app.use('/api/patientservices', PatientServiceRoute);
    app.use('/api/users', UserRoute);
    app.use('/api/payments', PaymentRoute);
    app.use('/api/auth', AuthRoute);
}