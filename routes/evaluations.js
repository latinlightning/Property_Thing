const express = require('express');
const router = express.Router();

//Mongoose Model Imports
const Property = require('../models/property');
const Evaluation = require('../models/evaluation');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { evaluationSchema } = require('../joiSchemas.js')

const validateEvaluation = (req, res, next) => {
    const { error } = evaluationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

router.get('/', catchAsync(async (req, res) => {
    const evaluations = await Evaluation.find({}).populate('property');
    const title = 'Evaluations';
    res.render('evaluations/index', { evaluations, title });
}));

router.get('/:id', catchAsync(async (req, res) => {
    const evaluation = await Evaluation.findById(req.params.id).populate('property');
    const title = `Evaluation for ${evaluation.property.address}`;
    res.render('evaluations/show', { evaluation, title });
}));

module.exports = router; 