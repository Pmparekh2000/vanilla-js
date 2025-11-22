Promise.myAllSettled = function (promises) {
  function executor(resolve, reject) {
    if (!Array.isArray(promises)) {
      reject(
        new TypeError("Promise.myAllSettled requires an array or iterable")
      );
      // Adding return to prevent any further synchronous piece of code to get executed
      // and ending the program here itself.
      return;
    }
    if (promises.length === 0) {
      // Resolve with an empty array immediately if the input is empty
      resolve([]);
      // Adding return to prevent any further synchronous piece of code to get executed
      // and ending the program here itself.
      return;
    }
    const results = new Array(promises.length);
    let settledCount = 0;
    promises.forEach((item, index) => {
      // Handling non-Promise values by wrapping them in Promise.resolve
      // This ensures all items are treated as Promises, correctly adopting their value.
      const promise = item instanceof Promise ? item : Promise.resolve(item);

      promise
        .then((res) => {
          // Store the result at the original index
          results[index] = { status: "fullfilled", value: res };
          settledCount++;
          // Check that if the obtained results length is equal to promises length
          if (settledCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          // Store the error at the original index
          results[index] = { status: "rejected", reason: error };
          settledCount++;
          // Check that if the obtained results length is equal to promises length
          if (settledCount === promises.length) {
            resolve(results);
          }
        });
    });
  }

  return new Promise(executor);
};

const pr1 = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    resolve(11);
  }, 1000);
});

const pr2 = 42;

const pr3 = new Promise((resolve, reject) => {
  console.log(3);
  setTimeout(() => {
    resolve(33);
  }, 3000);
});

const pr4 = new Promise((resolve, reject) => {
  console.log(4);
  setTimeout(() => {
    reject(44);
  }, 5000);
});

// The most important distinction of Promise.allSettled (compared to Promise.all) is that
// it always resolves with an array of objects, where each object explicitly states the status
// ("fulfilled" or "rejected") and contains either the value or the reason for the same.
const promises = [pr1, pr2, pr3, pr4];
Promise.myAllSettled(promises)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log("error", err);
  });
