function calculateCapRate(eval) {
    eval.capRate = 0;
    eval.capRate = ((eval.totalIncome - eval.totalExpenses) / eval.price);
    return eval.capRate;
}

module.exports = calculateCapRate;