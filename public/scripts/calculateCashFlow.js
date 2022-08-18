function calculateCashFlow(eval) {
    eval.cashFlow = 0;
    eval.cashFlow = eval.totalIncome - eval.totalExpenses;
    return eval.cashFlow.toFixed(2);
}

module.exports = calculateCashFlow