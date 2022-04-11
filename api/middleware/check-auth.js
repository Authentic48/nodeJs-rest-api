const jwt = require('jsonwebtoken');
const JWT_KEY = 'secret';


module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth Failed'
        })
    }

};