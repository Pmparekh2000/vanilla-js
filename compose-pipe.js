/**
 * Compose function is a function that combines multiple functions into a single function.
 * It provides the output of one function as the input to another function.
 * It executes functions from right-to-left.
 */

const myCompose = function (...functions) {
  if (!functions.every((fn) => typeof fn === "function")) {
    throw new TypeError("All values in input must be functions");
  }

  // If no functions been provided then return the initial value as output
  if (functions.length === 0) {
    return function (initalValue) {
      return initalValue;
    };
  }

  return function (initalValue) {
    return functions.reduceRight((acc, fn) => {
      return fn(acc);
    }, initalValue);
  };
};

const add = (x) => x + 2;
const multiply = (x) => x * 2;
const subtract = (x) => x - 2;

const result = myCompose(subtract, multiply, add)(5);
console.log(result);

/**
 * Pipe function is a function that combines multiple functions into a single function.
 * It provides the output of one function as the input to another function.
 * It executes functions from left-to-right.
 */

const myPipe = function (...functions) {
  if (!functions.every((fn) => typeof fn === "function")) {
    throw new TypeError("All values in input must be functions");
  }

  // If no functions been provided then return the initial value as output
  if (functions.length === 0) {
    return function (initalValue) {
      return initalValue;
    };
  }

  return function (initalValue) {
    return functions.reduce((acc, fn) => {
      return fn(acc);
    }, initalValue);
  };
};

const result1 = myPipe(subtract, multiply, add)(5);
console.log(result1);
