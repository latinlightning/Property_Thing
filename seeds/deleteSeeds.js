const mongoose = require('mongoose');

const Property = require('../models/property');

deleteProperties();
async function deleteProperties() {
    await Property.deleteMany({});
}
console.log('Deleted Properties Collections')