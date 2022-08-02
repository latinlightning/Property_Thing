const express = require('express');
const router = express.Router();
const properties = require('../controllers/properties');

const Property = require('../models/property');

router.route('/')
    .get(properties.index)
    .post(properties.createProperty)

router.get('/new', properties.renderNewForm);

router.route(':/id')
    .get(properties.showProperty)
    .delete(properties.deleteProperty)

module.exports = router;