const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const { propertySchema } = require('./schemas.js')
const propertyRoutes = ('./routes/properties');


const Property = require('./models/property');
const { resolveNaptr } = require('dns');
const ExpressError = require('./utils/ExpressError');

//MongoDB Connection and Error Handler
mongoose.connect('mongodb://localhost:27017/property_thing');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

//EJS Set Up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.json());

const validateProperty = (req, res, next) => {
    const { error } = propertySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//app.use('/properties', propertyRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/properties', catchAsync(async (req, res) => {
    const properties = await Property.find({});
    const propertyLength = properties.length;
    res.render('results', { properties, propertyLength });
}));

app.get('/properties/new', (req, res) => {
    res.render('add')
});

app.post('/properties', validateProperty, catchAsync(async (req, res) => {
    const newProperty = new Property({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        price: req.body.price,
        rent: req.body.rent,
        taxes: req.body.taxes,
        propertyInsurance: req.body.insurance,
        hoa: req.body.hoa,
        propertyManager: req.body.propertymanager,
        beds: req.body.beds,
        baths: req.body.baths,
        squareFootage: req.body.squareFootage,
        type: req.body.type
    });
    await newProperty.save()
    res.redirect('/properties')
}));

app.get('/properties/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id);
    console.log(property)
    const grossRentMultiplier = property.price / (property.rent * 12);
    const expense = property.expenses;
    const capRate = (property.rent * 12) / (expense.taxes + expense.insurance + expense.hoa + ((property.rent * 12) * expense.propertyManager));
    res.render('show', { property, grossRentMultiplier, capRate });
}));

app.get('/properties/:id/edit', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id)
    res.render('edit', { property })
}));

app.put('/properties/:id', validateProperty, catchAsync(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        price: req.body.price,
        rent: req.body.rent,
        taxes: req.body.taxes,
        propertyInsurance: req.body.insurance,
        hoa: req.body.hoa,
        propertyManager: req.body.propertymanager,
        beds: req.body.beds,
        baths: req.body.baths,
        squareFootage: req.body.squareFootage,
        type: req.body.type
    });
    res.redirect(`/properties/${property._id}`);
}));

app.delete('/properties/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.redirect('/properties')
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log(`Serving on port 3000`)
});