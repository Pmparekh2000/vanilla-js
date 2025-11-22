Promise.myAll = function (promises) {
  function executor(resolve, reject) {
    if (!Array.isArray(promises)) {
      return reject(
        new TypeError("Promise.myAll requires an array or iterable")
      );
    }
    if (promises.length === 0) {
      // Resolve with an empty array immediately if the input is empty
      return resolve([]);
    }
    const results = new Array(promises.length);
    let resolvedCount = 0;
    promises.forEach((item, index) => {
      // Handling non-Promise values by wrapping them in Promise.resolve
      // This ensures all items are treated as Promises, correctly adopting their value.
      const promise = item instanceof Promise ? item : Promise.resolve(item);
      promise
        .then((res) => {
          results[index] = res;
          resolvedCount++;

          // Check if all promises have resolved
          if (resolvedCount === promises.length) {
            resolve(results);
          }
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
  }, 1000);
});

const pr2 = 42;

const pr3 = new Promise((resolve, reject) => {
  console.log(3);
  setTimeout(() => {
    resolve(33);
  }, 3000);
});

// const pr4 = new Promise((resolve, reject) => {
//   console.log(4);
//   setTimeout(() => {
//     reject(44);
//   }, 10000);
// });

const promises = [pr1, pr2, pr3];
Promise.myAll(promises)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log("error", err);
  });
