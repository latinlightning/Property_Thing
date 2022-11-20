const { propertySchema, evaluationSchema } = require('./joiSchemas.js');
const ExpressError = require('./utils/ExpressError');
const Property = require('./models/property');
const Evaluation = require('./models/evaluation');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login')
    }
    next();
}

//Validation Middleware
module.exports.validateProperty = (req, res, next) => {
    const { error } = propertySchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateEvaluation = (req, res, next) => {
    const { error } = evaluationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/properties/${id}`)
    }
    next();
};

module.exports.isEvalAuthor = async (req, res, next) => {
    const { id } = req.params;
    const evaluation = await Evaluation.findById(id);
    if (!evaluation.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/properties/${id}`)
    }
    next();
};

