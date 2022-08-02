const mongoose = require('mongoose');

const Property = require('../models/property');

mongoose.connect('mongodb://localhost:27017/property_thing')
    .then(() => {
        console.log('Mongo Connection Open')
    })
    .catch(err => {
        console.log("Mongo Connection Error")
        console.log(err)
    })

const seedProperties = [
    {
        //_id: 1,
        beds: 3,
        baths: 1,
        squareFootage: 800,
        address: '5255 Quay Court',
        city: 'Arvada',
        state: 'CO',
        zipcode: '80002',
        price: 420000,
        rent: 2000,
        expenses: {
            taxes: 3000,
            insurance: 2500,
            hoa: 3000,
            propertyManager: 25
        }
    },
    {
        //_id: 2,
        beds: 3,
        baths: 1,
        squareFootage: 800,
        address: '505 Seagate Way',
        city: 'Belmont',
        state: 'CA',
        zipcode: '94002',
        price: 2500000,
        rent: 5000,
        expenses: {
            taxes: 4000,
            insurance: 1200,
            hoa: 2600,
            propertyManager: 10
        }
    },
    {
        //_id: 3,
        beds: 1,
        baths: 1,
        squareFootage: 800,
        address: '808 Comet Drive',
        city: 'Foster City',
        state: 'CA',
        zipcode: '94404',
        price: 3500000,
        rent: 2600,
        expenses: {
            taxes: 5,
            insurance: 3200,
            hoa: 0,
            propertyManager: 0
        }
    },
];


Property.insertMany(seedProperties)
    .then(res => {
        console.log(res);
        console.log('Seeded Database');
    })
    .catch(e => {
        console.log(e);
        console.log('Failed to seed database')
    })