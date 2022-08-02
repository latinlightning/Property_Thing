const Joi = require('joi');

module.exports.propertySchema = Joi.object({
    property: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.number().required(),
        price: Joi.number().required().min(0),
        rent: Joi.string().required().min(0),
        taxes: Joi.string(),
        propertyInsurance: Joi.string(),
        hoa: Joi.string(),
        propertyManager: Joi.string(),
        beds: Joi.string(),
        baths: Joi.string(),
        squareFootage: Joi.string(),
        type: Joi.string(),
    }).required()
});

