function calculateExpenses(eval) {
    eval.totalExpenses = 0;
    eval.totalExpenses = eval.payment + eval.taxes + eval.insurance + eval.hoa + eval.maintenance;
    return eval.totalExpenses;
}

module.exports = calculateExpenses;