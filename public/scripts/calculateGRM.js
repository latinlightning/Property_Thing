function calculateGRM(eval) {
    eval.grm = 0;
    eval.grm = (eval.price / eval.totalIncome);
    return eval.grm;
};

module.exports = calculateGRM