//Express EJS and Mongoose Imports
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

//Error and Validation Imports
const { propertySchema, evaluationSchema } = require('./joiSchemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')

//Calculation Function Imports
const calculateMonthlyPayment = require('./public/scripts/calculateMonthly.js');
const calculateIncome = require('./public/scripts/calculateIncome.js');
const calculateExpenses = require('./public/scripts/calculateExpenses.js');
const calculateCapRate = require('./public/scripts/calculateCapRate.js');
const calculateGRM = require('./public/scripts/calculateGRM.js');
const calculateCashFlow = require('./public/scripts/calculateCashFlow.js');
const calculateEquity = require('./public/scripts/calculateEquity.js');
const calculateHomeValue = require('./public/scripts/calculateHomeValue.js');
const calculateRemainingLoan = require('./public/scripts/calculateRemainingLoan.js');


//Mongoose Model Imports
const Property = require('./models/property');
const Evaluation = require('./models/evaluation');

mongoose.connect('mongodb://localhost:27017/property_thing')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/static', express.static(path.join(__dirname, 'public')));

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
    console.log(req.body)
    const { error } = evaluationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/properties', catchAsync(async (req, res) => {
    const properties = await Property.find({});
    const title = 'Properties';
    res.render('properties/index', { properties, title });
}));

app.get('/properties/new', (req, res) => {
    const title = 'Properties';
    res.render('properties/new', { title });
});

app.post('/properties', validateProperty, catchAsync(async (req, res) => {
    const newProperty = new Property(req.body.property);
    await newProperty.save();
    res.redirect(`/properties/${newProperty._id}`);
}));

app.get('/properties/:id', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('evaluations');
    let title = property.address;
    res.render('properties/show', { property, title });

}));

app.get('/properties/:id/edit', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    const title = 'Edit'
    res.render('properties/edit', { property, title });

}));

app.put('/properties/:id', validateProperty, catchAsync(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, { ...req.body.property });
    res.redirect(`/properties/${property._id}`);
}));

app.delete('/properties/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.redirect('/properties');
}));

app.get('/properties/:id/evaluations/new', async (req, res) => {
    const property = await Property.findById(req.params.id);
    let title = `Eval for ${property.address}`;
    res.render('evaluations/new', { property, title });
});

app.post('/properties/:id/evaluations', validateEvaluation, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    const evaluation = new Evaluation(req.body.evaluation);

    //Calculations
    evaluation.downPaymentPercent = evaluation.downPayment / evaluation.price;
    evaluation.payment = calculateMonthlyPayment(evaluation);
    evaluation.totalIncome = calculateIncome(evaluation);
    evaluation.totalExpenses = calculateExpenses(evaluation);
    evaluation.capRate = calculateCapRate(evaluation);
    evaluation.grm = calculateGRM(evaluation);
    evaluation.cashFlow = calculateCashFlow(evaluation);
    evaluation.homeValues = calculateHomeValue(evaluation, evaluation.appreciationRate);
    evaluation.remainingBalance = calculateRemainingLoan(evaluation);
    evaluation.equityValues = calculateEquity(evaluation, evaluation.appreciationRate);
    evaluation.property = property;

    //Push to Database
    property.evaluations.push(evaluation);
    console.log(evaluation)
    await property.save();
    await evaluation.save();
    res.redirect(`/properties/${property._id}`);
}));

app.get('/evaluations', async (req, res) => {
    const evaluations = await Evaluation.find({}).populate('property');
    const title = 'Evaluations';
    res.render('evaluations/index', { evaluations, title });
});

app.get('/evaluations/:id', async (req, res) => {
    const evaluation = await Evaluation.findById(req.params.id).populate('property');
    const title = `Evaluation for ${evaluation.property.address}`;
    res.render('evaluations/show', { evaluation, title });
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const title = 'Error'
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { title, err })
});

app.listen(3000, () => {
    console.log('Serving on Port 3000');
});