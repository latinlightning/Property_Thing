const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    address: String,
    city: String,
    state: String,
    zip: Number,
    type: String,
    beds: Number,
    baths: Number,
    sqFt: Number,
    yearBuilt: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [
        {
            url: String,
            fileName: String
        }
    ],
    evaluations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Evaluation'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);