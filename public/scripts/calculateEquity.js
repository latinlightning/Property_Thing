const calculateHomeValue = require('./calculateHomeValue.js');
const calculateRemainingLoan = require('./calculateRemainingLoan.js');

//Calculates the Yearly Equity given the amount remaining on the loan and the value of the hosue
function calculateEquity(eval, rate) {
    let appreciationRate = rate / 100;
    let equityValues = [];
    let homeValues = calculateHomeValue(eval, appreciationRate);
    let remainingLoans = calculateRemainingLoan(eval);
    let yearlyLoanBalance = [];
    for (let i = 0; i < remainingLoans.length; i += 12) {
        yearlyLoanBalance.push(remainingLoans[i])
    };
    for (let i = 0; i < homeValues.length; i++) {
        let currentEquity = homeValues[i] - yearlyLoanBalance[i];
        equityValues.push(currentEquity);
    };
    return equityValues;
};

module.exports = calculateEquity;





