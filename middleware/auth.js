require('dotenv').config();
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decodedtoken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decodedtoken;

        // console.log(req.user)
        next();   
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
}
