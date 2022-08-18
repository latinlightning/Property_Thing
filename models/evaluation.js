const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluationSchema = new Schema({
    price: Number,
    closingCosts: Number,
    isFinanced: Boolean,
    downPayment: Number,
    downPaymentPercent: Number,
    rate: Number,
    length: Number,
    payment: Number,
    rent: Number,
    utilities: Number,
    totalIncome: Number,
    taxes: Number,
    insurance: Number,
    hoa: Number,
    maintenance: Number,
    appreciationRate: Number,
    cashFlow: Number,
    homeValues: Array,
    remainingBalance: Array,
    equityValues: Array,
    totalExpenses: Number,
    capRate: Number,
    grm: Number,
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property'
    }
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', EvaluationSchema);