const Property = require('../models/property');
const Evaluation = require('../models/evaluation');

module.exports.index = async (req, res) => {
    const evaluations = await Evaluation.find({}).populate('property');
    const title = 'Evaluations';
    res.render('evaluations/index', { evaluations, title });
};

module.exports.showEvaluation = async (req, res) => {
    const evaluation = await Evaluation.findById(req.params.id).populate('property').populate('author');
    const title = `Evaluation for ${evaluation.property.address}`;
    res.render('evaluations/show', { evaluation, title });
};

module.exports.deleteEvaluation = async (req, res) => {
    const { id } = req.params;
    const evaluation = await Evaluation.findById(id);
    if (!evaluation.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/evaluations/}`)
    }
    await Evaluation.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted Evaluation');
    res.redirect('/evaluations');
};