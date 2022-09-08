const express = require('express');
const router = express.Router();

const { propertySchema, evaluationSchema } = require('../joiSchemas.js')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware')


//Calculation Function Imports
const calculateMonthlyPayment = require('../public/scripts/calculateMonthly.js');
const calculateIncome = require('../public/scripts/calculateIncome.js');
const calculateExpenses = require('../public/scripts/calculateExpenses.js');
const calculateCapRate = require('../public/scripts/calculateCapRate.js');
const calculateGRM = require('../public/scripts/calculateGRM.js');
const calculateCashFlow = require('../public/scripts/calculateCashFlow.js');
const calculateEquity = require('../public/scripts/calculateEquity.js');
const calculateHomeValue = require('../public/scripts/calculateHomeValue.js');
const calculateRemainingLoan = require('../public/scripts/calculateRemainingLoan.js');

//Mongoose Model Imports
const Property = require('../models/property');
const Evaluation = require('../models/evaluation');

//Validation Middleware
const validateProperty = (req, res, next) => {
    const { error } = propertySchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

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
    const properties = await Property.find({});
    const title = 'Properties';
    res.render('properties/index', { properties, title });
}));

router.get('/new', isLoggedIn, (req, res) => {
    const title = 'Properties';
    res.render('properties/new', { title });
});

router.post('/', isLoggedIn, validateProperty, catchAsync(async (req, res) => {
    const newProperty = new Property(req.body.property);
    await newProperty.save();
    req.flash('success', 'Successfully Made Property')
    res.redirect(`/properties/${newProperty._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    let id_error = 0;
    let property;

    //Looks for id error if id error flashes that it cant find that property
    try {
        property = await Property.findById(req.params.id).populate('evaluations');
    }
    catch (err) {
        if (err.kind === 'ObjectId') id_error = 1
    }
    if (!property || id_error == 1) {
        req.flash('error', 'Cant find that property');
        return res.redirect('/properties')
    }
    let title = property.address;
    res.render('properties/show', { property, title });

}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    const title = 'Edit'
    res.render('properties/edit', { property, title });

}));

router.put('/:id', isLoggedIn, validateProperty, catchAsync(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, { ...req.body.property });
    req.flash('success', 'Successfully Updated Property')
    res.redirect(`/properties/${property._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Property');
    res.redirect('/properties');
}));

router.get('/:id/evaluations/new', async (req, res) => {
    const property = await Property.findById(req.params.id);
    let title = `Eval for ${property.address}`;
    res.render('evaluations/new', { property, title });
});

router.post('/:id/evaluations', validateEvaluation, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    const evaluation = new Evaluation(req.body.evaluation);
    if (evaluation.downPayment === 0 && evaluation.rate === 0) {
        evaluation.downPaymentPercent = 0;
        evaluation.payment = 0;
        evaluation.length = 30;
        evaluation.equityValues = calculateHomeValue(evaluation, evaluation.appreciationRate);
        evaluation.remainingBalance = [];
        for (let i = 0; i < 360; i++) {
            evaluation.remainingBalance.push(0);
        };
    } else {
        evaluation.equityValues = calculateEquity(evaluation, evaluation.appreciationRate);
        evaluation.downPaymentPercent = evaluation.downPayment / evaluation.price;
        evaluation.payment = calculateMonthlyPayment(evaluation);
        evaluation.remainingBalance = calculateRemainingLoan(evaluation);
    }
    evaluation.homeValues = calculateHomeValue(evaluation, evaluation.appreciationRate);
    evaluation.totalIncome = calculateIncome(evaluation);
    evaluation.totalExpenses = calculateExpenses(evaluation);
    evaluation.cashFlow = calculateCashFlow(evaluation);
    evaluation.capRate = calculateCapRate(evaluation);
    evaluation.grm = calculateGRM(evaluation);
    evaluation.property = property;

    //Push to Database
    property.evaluations.push(evaluation);
    await property.save();
    await evaluation.save();
    req.flash('success', 'Successfully Made Evaluation')
    res.redirect(`/evaluations/${evaluation._id}`);
}));

module.exports = router;