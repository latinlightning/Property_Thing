function calculateRemainingLoan(eval) {
    let remainingBalance = [];
    let balance = eval.price - eval.downPayment;
    const periods = eval.length * 12;
    const rate = eval.rate / 100;
    const monthlyRate = parseFloat((rate / 12).toPrecision(12));
    console.log(`Monthly Rate: ${monthlyRate}`)
    const monthlyPayment = (monthlyRate / (1 - (Math.pow((1 + monthlyRate), -(periods))))) * balance;
    console.log(`Monthly Payment: ${monthlyPayment}`)

    for (var i = 0; i < periods; i++) {
        let interestForMonth = (balance * monthlyRate).toFixed(3);
        console.log(`interestForMonth: ${interestForMonth}`)
        let principalForMonth = (monthlyPayment - interestForMonth).toFixed(3);
        console.log(`principalForMonth: ${principalForMonth}`)
        balance -= principalForMonth;
        remainingBalance.push(balance);
    }
    return remainingBalance;
};

module.exports = calculateRemainingLoan;