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
        author: '637a9688d3b4c856fd40e087',
        address: '808 Comet Dr Apt 203',
        city: 'Foster City',
        state: 'CA',
        zip: '94404',
        type: 'Apartment',
        beds: 1,
        baths: 2,
        sqFt: 850,
        yearBuilt: 1986,
        images: [
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/ctiuc2xk1lih7ycnmlbz.jpg'
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/j9xjaoflrw5s0hfjxmgs.jpg',
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/anoskoqcb2xpivxggabq.jpg',
            }
        ]
    },
    {
        author: '637a9688d3b4c856fd40e087',
        address: '505 Seagate Way',
        city: 'Belmont',
        state: 'CA',
        zip: '94002',
        type: 'Single Family',
        beds: 3,
        baths: 2,
        sqFt: 1600,
        yearBuilt: 1985,
        images: [
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/ctiuc2xk1lih7ycnmlbz.jpg'
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/j9xjaoflrw5s0hfjxmgs.jpg',
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/anoskoqcb2xpivxggabq.jpg',
            }
        ]
    },
    {
        author: '637a9688d3b4c856fd40e087',
        address: '5255 Quay Court',
        city: 'Arvada',
        state: 'CO',
        zip: '80002',
        type: 'Single Family',
        beds: 3,
        baths: 1,
        sqFt: 850,
        yearBuilt: 1960,
        images: [
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/ctiuc2xk1lih7ycnmlbz.jpg'
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/j9xjaoflrw5s0hfjxmgs.jpg',
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/anoskoqcb2xpivxggabq.jpg',
            }
        ]

    },
    {
        author: '637a9688d3b4c856fd40e087',
        address: '8500 Lamar Dr',
        city: 'Arvada',
        state: 'CO',
        zip: '80003',
        type: 'Single Family',
        beds: 3,
        baths: 2,
        sqFt: 1800,
        yearBuilt: 1970,
        images: [
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/ctiuc2xk1lih7ycnmlbz.jpg'
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/j9xjaoflrw5s0hfjxmgs.jpg',
            },
            {
                url: 'https://res.cloudinary.com/davatxx2f/image/upload/v1669678817/PropertyThing/anoskoqcb2xpivxggabq.jpg',
            }
        ]
    },
]

const seedDb = async () => {
    await Property.deleteMany({});
    for (let i = 0; i < seedProperties.length; i++) {
        const prop = new Property(seedProperties[i]);
        await prop.save();
    }
};

seedDb().then(() => {
    mongoose.connection.close();
});