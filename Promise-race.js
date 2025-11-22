Promise.myRace = function (promises) {
  function executor(resolve, reject) {
    if (!Array.isArray(promises)) {
      reject(new TypeError("Promise.myRace requires an array or iterable"));
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

    promises.forEach((item, index) => {
      // Handling non-Promise values by wrapping them in Promise.resolve
      // This ensures all items are treated as Promises, correctly adopting their value.
      const promise = item instanceof Promise ? item : Promise.resolve(item);

      promise
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return new Promise(executor);
};

const pr1 = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    resolve(11);
  }, 5000);
});

// const pr2 = 42;

const pr3 = new Promise((resolve, reject) => {
  console.log(3);
  setTimeout(() => {
    resolve(33);
  }, 5000);
});

const pr4 = new Promise((resolve, reject) => {
  console.log(4);
  setTimeout(() => {
    reject(44);
  }, 200);
});

const promises = [pr3, pr4, pr1];
Promise.myRace(promises)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log("error", err);
  });
