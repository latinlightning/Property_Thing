const mongoose = require('mongoose');
const { Schema } = mongoose;

const PropertySchema = new Schema({
    beds: {
        type: Number,
    },
    baths: {
        type: Number,
    },
    squareFootage: {
        type: Number,
    },
    type: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 2
    },
    zipcode: {
        type: Number,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    expenses: {
        taxes: {
            type: Number
        },
        insurance: {
            type: Number
        },
        hoa: {
            type: Number
        },
        propertyManager: {
            type: Number
        }
    }
});

const Property = mongoose.model('Property', PropertySchema);
module.exports = Property;
