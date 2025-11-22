function PromisePolyFill(executor) {
  let value,
    fulfilled = false,
    rejected = false,
    onResolve,
    onReject,
    called = false;
  // called flag is used to make sure that promise resolve and reject can be called only once
  // subsequent calls to resolve and reject must be ignored.
  const resolve = (val) => {
    value = val;
    fulfilled = true;
    if (typeof onResolve === "function" && !called) {
      onResolve(value);
      called = true;
    }
  };

  const reject = (reason) => {
    value = reason;
    rejected = true;
    if (typeof onReject === "function" && !called) {
      onReject(value);
      called = true;
    }
  };

  this.then = (callback) => {
    onResolve = callback;
    if (fulfilled && !called) {
      onResolve(value);
      called = true;
    }
    return this;
  };

  this.catch = (callback) => {
    onReject = callback;
    if (rejected && !called) {
      onReject(value);
      called = true;
    }
    return this;
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

const promise = new PromisePolyFill((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    resolve(2);
  }, 1000);

  console.log(3);
})
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
