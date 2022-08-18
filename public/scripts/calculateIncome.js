function calculateIncome(eval) {
    eval.totalIncome = 0;
    eval.totalIncome = eval.rent + eval.utilities;
    return eval.totalIncome
}

module.exports = calculateIncome;