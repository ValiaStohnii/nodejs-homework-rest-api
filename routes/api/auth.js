const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express')
const {User, schemas} = require('../../models/user')
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/auth');
const { SECRET_KEY } = process.env;

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
        const hashPassword = await bcrypt.hash(password, 10)
        await User.create({ email, password:hashPassword })
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

router.post('/login', async (req, res, next) => {
    try {
        const { error } = schemas.login.validate(req.body);
        if (error) {
            res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'Помилка від Joi чи іншої бібліотеки валідації'
            });
            return;
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                status: 'Unauthorized',
                code: 401,
                message: 'Email or password is wrong'
            });
            return;
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            res.status(401).json({
                status: 'Unauthorized',
                code: 401,
                message: 'Email or password is wrong'
            });
            return;
        }

        const payload = {
            id: user._id
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
        await User.findByIdAndUpdate(user._id, { token });
        res.json({
            token,
            user: {
                email
            }
        })
    } catch (error) {
        next(error)
    }
});

router.get('/current', auth, async (req, res) => {
    const { email } = req.user;
    res.json({
        email
    })
});

router.get('/logout', auth, async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: null })
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

module.exports = router;