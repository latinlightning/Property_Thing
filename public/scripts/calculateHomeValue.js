//Calculates the yearly value of the house
function calculateHomeValue(eval, rate) {
    let appreciationRate = rate / 100;
    let homeValues = [];
    let initalValue = eval.price;
    const periods = eval.length;
    homeValues.push(initalValue);
    for (let i = 1; i < periods + 1; i++) {
        let nextValue = (homeValues[i - 1] * appreciationRate) + homeValues[i - 1];
        nextValue = nextValue;
        homeValues.push(nextValue);
    };
    return homeValues;
};

module.exports = calculateHomeValue;