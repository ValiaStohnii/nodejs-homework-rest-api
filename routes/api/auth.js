const express = require('express')
const {User, schemas} = require('../../models/users')
const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try {
        const { error } = schemas.signup.validate(req.body);
        if (error) {
            res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'Помилка від Joi чи іншої бібліотеки валідації'
            });
            return;
        }
        const { email, password } = req.body;
        const result = await User.findOne({ email });
        if (result) {
            res.status(409).json({
                status: 'Conflict',
                code: 409,
                message: 'Email in use'
            });
            return;
        }
        await User.create({ email, password })
        res.status(201).json({
            status: 'Created',
            code: 201,
            user: {
                email,
                subscription: "starter"
            }
        })
    } catch (error) {
        next(error)
    }
});

module.exports = router;