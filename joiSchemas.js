const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.propertySchema = Joi.object({
    property: Joi.object({
        address: Joi.string().required().escapeHTML(),
        city: Joi.string().required().escapeHTML(),
        state: Joi.string().required().escapeHTML(),
        zip: Joi.number().required().min(0),
        type: Joi.string().required(),
        beds: Joi.number().required(),
        baths: Joi.number().required(),
        sqFt: Joi.number().required().min(0),
        yearBuilt: Joi.number().required().min(0),
    }).required()
});


module.exports.evaluationSchema = Joi.object({
    evaluation: Joi.object({
        price: Joi.number().required().min(0),
        closingCosts: Joi.number().min(0),
        downPayment: Joi.number(),
        downPaymentPercent: Joi.number(),
        rate: Joi.number(),
        length: Joi.number(),
        payment: Joi.number(),
        rent: Joi.number().required().min(0),
        utilities: Joi.number(),
        totalIncome: Joi.number(),
        taxes: Joi.number().required().min(0),
        insurance: Joi.number(),
        hoa: Joi.number(),
        maintenance: Joi.number().required().min(0),
        appreciationRate: Joi.number(),
        cashFlow: Joi.number(),
        homeValues: Joi.number(),
        remainingBalance: Joi.array(),
        equityValues: Joi.array(),
        totalExpenses: Joi.number(),
        capRate: Joi.number(),
        grm: Joi.number(),
        cashFlow: Joi.number()
    }).required()
});  