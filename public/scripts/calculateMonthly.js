//Used to Determine Monthly Payment on a loan from an eval object

function calculateMonthlyPayment(eval) {
    //Makes accessing easier
    let monthlyPayment = 0;
    const principal = eval.price - eval.downPayment;
    const term = eval.length;
    const annualRate = eval.rate;
    const percentageRate = annualRate / 1200;
    const payments = 12 * term;
    monthlyPayment = (principal * percentageRate) / (1 - (Math.pow((1 + percentageRate), payments * -1)));
    monthlyPayment = monthlyPayment.toFixed(2);
    return monthlyPayment;
};

module.exports = calculateMonthlyPayment;