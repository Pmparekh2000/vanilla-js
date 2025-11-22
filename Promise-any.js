class AggregateErrorPolyfill extends Error {
  constructor(errors, message = "All promises rejected") {
    super(message);
    this.name = "AggregateError";
    this.errors = errors; // Key property: stores the array of rejection reasons
  }
}

// Use native AggregateError if available, otherwise use the polyfill
const FinalAggregateError =
  typeof AggregateError !== "undefined"
    ? AggregateError
    : AggregateErrorPolyfill;

Promise.myAny = function (promises) {
  function executor(resolve, reject) {
    if (!Array.isArray(promises)) {
      reject(new TypeError("Promise.myAny requires an array or iterable"));
      // Adding return to prevent any further synchronous piece of code to get executed
      // and ending the program here itself.
      return;
    }

    if (promises.length === 0) {
      // edge Case: Empty Array
      // If the array is empty, the forEach loop will do nothing,
      // leaving the returned Promise perpetually pending, which is the correct behavior.
      return;
    }

    const errors = [];
    let errorsObtained = 0;
    promises.forEach((item, index) => {
      // Handling non-Promise values by wrapping them in Promise.resolve
      // This ensures all items are treated as Promises, correctly adopting their value.
      const promise = item instanceof Promise ? item : Promise.resolve(item);

      promise
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          errors[index] = error;
          errorsObtained++;

          // Not checking errors.length === promises.length since errors array can be sparse array
          // with no values into it. Hence counter checking is the best.
          if (errorsObtained === promises.length) {
            reject(new FinalAggregateError(errors, "All promises rejected"));
          }
        });
    });
  }

  return new Promise(executor);
};

const pr1 = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    reject("Error from 11");
  }, 5000);
});

// const pr2 = 42;

const pr3 = new Promise((resolve, reject) => {
  console.log(3);
  setTimeout(() => {
    reject("Error from 33");
  }, 5000);
});

const pr4 = new Promise((resolve, reject) => {
  console.log(4);
  setTimeout(() => {
    reject("Error from 44");
  }, 200);
});

const promises = [pr3, pr4, pr1];
Promise.myAny(promises)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log("error", err.errors);
  });
