const { Schema, model } = require('mongoose')
const Joi = require("joi");

const userShema = Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
}, { versionKey: false, timestamps: true });

const userJoiSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string(),
    token: Joi.string(),
});

const schemas = {
    signup: userJoiSchema,
    login: userJoiSchema,
};
const User = model('user', userShema);

module.exports = { User, schemas };
