const express = require('express');
const router = express.Router();
const properties = require('../controllers/properties');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, isEvalAuthor, validateProperty, validateEvaluation } = require('../middleware');

//Mongoose Model Imports
const Property = require('../models/property');
const Evaluation = require('../models/evaluation');
const property = require('../models/property');

router.get('/', catchAsync(properties.index));

router.get('/new', isLoggedIn, properties.renderNewForm);

router.post('/', isLoggedIn, validateProperty, catchAsync(properties.createProperty));

router.get('/:id', catchAsync(properties.showProperty));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(properties.editProperty));

router.put('/:id', isLoggedIn, isAuthor, validateProperty, catchAsync(properties.renderEditForm));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(properties.deleteProperty));

router.get('/:id/evaluations/new', catchAsync(properties.renderNewEvaluationForm));

router.post('/:id/evaluations', isLoggedIn, validateEvaluation, catchAsync(properties.createNewEvaluation));

router.delete('/evaluations/:id', isLoggedIn, isEvalAuthor, catchAsync(properties.deleteEvaluation));

module.exports = router;