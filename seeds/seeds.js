const mongoose = require('mongoose');
const Property = require('../models/property');

mongoose.connect('mongodb://localhost:27017/property_thing')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const seedProperties = [
    {
        address: '808 Comet Dr Apt 203',
        city: 'Foster City',
        state: 'CA',
        zip: '94404',
        type: 'Apartment',
        beds: 1,
        baths: 2,
        sqFt: 850,
        yearBuilt: 1986,
        image: 'https://res.cloudinary.com/davatxx2f/image/upload/v1659676359/PropertyThing/kulakai_rundoh.webp'
    },
    {
        address: '505 Seagate Way',
        city: 'Belmont',
        state: 'CA',
        zip: '94002',
        type: 'Single Family',
        beds: 3,
        baths: 2,
        sqFt: 1600,
        yearBuilt: 1985,
        image: 'https://res.cloudinary.com/davatxx2f/image/upload/v1659676323/PropertyThing/seagate_vsbpme.webp'
    },
    {
        address: '5255 Quay Court',
        city: 'Arvada',
        state: 'CO',
        zip: '80002',
        type: 'Single Family',
        beds: 3,
        baths: 1,
        sqFt: 850,
        yearBuilt: 1960,
        image: 'https://res.cloudinary.com/davatxx2f/image/upload/v1659676319/PropertyThing/quay_kaskup.webp'

    },
    {
        address: '8500 Lamar Dr',
        city: 'Arvada',
        state: 'CO',
        zip: '80003',
        type: 'Single Family',
        beds: 3,
        baths: 2,
        sqFt: 1800,
        yearBuilt: 1970,
        image: 'https://res.cloudinary.com/davatxx2f/image/upload/v1659676685/PropertyThing/lamar_sgyojt.webp'
    },
]

const seedDb = async () => {
    await Property.deleteMany({});
    for (let i = 0; i < seedProperties.length; i++) {
        const prop = new Property(seedProperties[i]);
        await prop.save();
    }
};

seedDb();