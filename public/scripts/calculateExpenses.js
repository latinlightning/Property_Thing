function calculateExpenses(eval) {
    eval.totalExpenses = 0;
    if (!eval.payment) {
        eval.totalExpenses = eval.taxes + eval.insurance + eval.hoa + eval.maintenance;
        return eval.totalExpenses
    } else {
        eval.totalExpenses = eval.payment + eval.taxes + eval.insurance + eval.hoa + eval.maintenance;
        return eval.totalExpenses;
    }
}

module.exports = calculateExpenses;