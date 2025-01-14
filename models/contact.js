const { Schema, model } = require('mongoose')
const Joi = require("joi");

const contactsShema = Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, { versionKey: false, timestamps: true });

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.number(),
    favorite: Joi.bool(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.bool().required()
});

const schemas = {
    add: addSchema,
    updateFavorite: updateFavoriteSchema,
}

const Contact = model('contact', contactsShema);

module.exports = { Contact, schemas };