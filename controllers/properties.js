const Property = require('../models/property');

module.exports.index = async (req, res) => {
    const properties = await Property.find({});
    res.render('properties', { properties })
};

module.exports.renderNewForm = (req, res) => {
    res.render('properties/new');
};

module.exports.createProperty = async (req, res, next) => {
    const newProperty = new Property({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        price: req.body.price,
        rent: req.body.rent
    });
    const newExpense = new Expense({
        taxes: req.body.taxes,
        propertyInsurance: req.body.insurance,
        hoa: req.body.hoa,
        propertyManager: req.body.propertymanager
    });
    newProperty.expenses.push(newExpense);
    newExpense.property = newProperty;
    await newProperty.save()
    await newExpense.save()
    res.redirect('/properties')
};

module.exports.showProperty = async (req, res) => {
    const { id } = req.params;
    const property = await Property
        .findById(id)
        .populate("expenses")
    console.log(property)
    const grossRentMultiplier = property.price / (property.rent * 12);
    const expense = property.expenses[0];
    const capRate = (property.rent * 12) / (expense.taxes + expense.propertyInsurance + expense.hoa + ((property.rent * 12) * expense.propertyManager));
    if (!property) {
        return res.redirect('/properties');
    }
    res.render('show', { property, grossRentMultiplier, capRate });
}

module.exports.deleteProperty = async (req, res) => {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.redirect('/properties')
};