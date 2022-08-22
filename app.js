//Express EJS and Mongoose Imports
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

//Error and Validation Imports
const { propertySchema, evaluationSchema } = require('./joiSchemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

//Mongoose Model Imports
const Evaluation = require('./models/evaluation');

//Routes
const properties = require('./routes/properties');
const evaluations = require('./routes/evaluations');

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

app.get('/', (req, res) => {
    res.render('home')
});

app.use('/properties', properties);
app.use('/evaluations', evaluations);

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