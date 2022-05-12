const jwt = require('jsonwebtoken');
const {User} = require('../models/user')
const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [bearer, token] = authorization.split(' ');
        if (bearer !== 'Bearer') {
            res.status(401).json({
                status: 'Unauthorized',
                code: 401,
                message: 'Not authorized'
            })
            return
        }
        try {
            const { contactId } = jwt.verify(token, SECRET_KEY);
            const user =await User.findById(contactId);
            if (!user || !user.token) {
                res.status(401).json({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'Not authorized'
                })
                return
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                status: 'Unauthorized',
                code: 401,
                message: 'Not authorized'
            })
            return
        }
    } catch (error) {
        next(error)
    }
};

module.exports = auth;