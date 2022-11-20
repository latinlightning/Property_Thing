const express = require('express');
const router = express.Router();
const evaluations = require('../controllers/evaluations');

//Mongoose Model Imports
const Property = require('../models/property');
const Evaluation = require('../models/evaluation');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { evaluationSchema } = require('../joiSchemas.js')

const { isLoggedIn, isEvalAuthor, validateProperty, validateEvaluation } = require('../middleware');
const { deleteEvaluation } = require('../controllers/properties');


router.get('/', catchAsync(evaluations.index));

router.get('/:id', catchAsync(evaluations.showEvaluation));

router.delete('/:id', isLoggedIn, isEvalAuthor, catchAsync(evaluations.deleteEvaluation));

module.exports = router; 