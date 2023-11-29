const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const decimalToNumber = (number, decimal) => {
  const arr = number.split("");
  if (arr.length < decimal) {
    let i = 18 - arr.length + 1;
    for (i; i >= 0; i--) {
      arr.unshift(0);
    }
  }
  arr.splice(arr.length - decimal, 0, ".");
  return arr.join("");
};

const getContract = (currency) => {
  if (currency == "moon" || currency == "MOON") return "";
  if (currency == "brick" || currency == "BRICK") return "";
  return null;
};

module.exports = { sleep, decimalToNumber };
