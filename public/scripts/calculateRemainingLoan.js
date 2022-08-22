function calculateRemainingLoan(eval) {
    let remainingBalance = [];
    let balance = eval.price - eval.downPayment;
    const periods = eval.length * 12;
    const rate = eval.rate / 100;
    const monthlyRate = parseFloat((rate / 12).toPrecision(12));
    const monthlyPayment = (monthlyRate / (1 - (Math.pow((1 + monthlyRate), -(periods))))) * balance;

    for (var i = 0; i < periods; i++) {
        let interestForMonth = (balance * monthlyRate).toFixed(3);
        let principalForMonth = (monthlyPayment - interestForMonth).toFixed(3);
        balance -= principalForMonth;
        remainingBalance.push(balance);
    }
    return remainingBalance;
};

module.exports = calculateRemainingLoan;