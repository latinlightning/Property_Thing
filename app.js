if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//Express EJS and Mongoose Imports
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const secret = process.env.SECRET || 'secret'

//Error and Validation Imports
const ExpressError = require('./utils/ExpressError');

//Routes
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const evaluationRoutes = require('./routes/evaluations');

const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/property_thing';

//Database Connection
mongoose.connect(dbUrl)
//mongoose.connect(dbUrl);

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
app.use(express.static('public'));
app.use(mongoSanitize());

const store = new MongoStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on('error', function (e) {
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    const title = "Property Thing";
    res.render('home', { title });
});

app.use('/', userRoutes);
app.use('/properties', propertyRoutes);
app.use('/evaluations', evaluationRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const title = 'Error'
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { title, err })
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log('Serving on Port ' + port);
});