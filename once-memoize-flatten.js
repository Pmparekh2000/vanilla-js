/**
 * myOnce is a wrapper function which lets the function been wrapped to be called only once.
 * post calling the wrapped function once, on re-calling it the 1st invocation value is returned.
 */

Function.prototype.myOnce = function (...args) {
  const fn = this;

  // 1. Check if the myOnce is been called on a function or not
  if (typeof fn !== "function") {
    throw new TypeError("myOnce must be called on a function");
  }

  // 2. Initialzing a flag and result variable
  let isCalledOnce = false;
  let result;

  // 3. Forming a closure by passing extra arguments
  return function (...extraArgs) {
    // 4. Able to access the flag variable because of closures
    if (!isCalledOnce) {
      isCalledOnce = true;

      // 4. Using apply to preserve the 'this' context.
      result = fn.apply(this, [...args, ...extraArgs]);
    }

    // 5. Return result value on all subsequent function invocation
    return result;
  };
};

let count = 0;
function increment(value) {
  count += value;
  return count;
}

// Create a function that can only be executed once.
const incrementOnce = increment.myOnce();
// First call: Executes the function (count becomes 10)
// console.log("First call:", incrementOnce(10)); // Output: First call: 10
// Second call: Does NOT execute the function, returns the cached result (count remains 10)
// console.log("Second call:", incrementOnce(20)); // Output: Second call: 10
// Final check to prove the original function wasn't executed again
// console.log("Final count:", count); // Output: Final count: 10

// Context check: 'this' should be the person object
// const person = {
//   id: 1,
//   getId: function () {
//     return this.id;
//   }.myOnce(),
// };
// console.log("Context Test 1:", person.getId()); // Output: Context Test 1: 1
// person.id = 2; // Mutate the object
// console.log("Context Test 2:", person.getId()); // Output: Context Test 2: 1 (Returns cached result from first call)

/**
 * myMemoize function takes a resolver function to generate a key and returns a memoized function.
 * It maintains cache internally in the form of map for having more explicit keys
 */
Function.prototype.myMemoize = function (resolver) {
  const fn = this;
  if (typeof fn !== "function") {
    throw new TypeError("myMemoize must be running on a function only");
  }
  if (typeof resolver !== "function") {
    throw new TypeError("Resolver must be a type of function only");
  }

  const cache = new Map();

  const memoized = function (...args) {
    let key;

    if (resolver) {
      key = resolver.apply(this, args);
    } else if (args.length === 0) {
      key = "_default_";
    } else {
      key = args[0];
    }

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  };

  memoized.cache = cache;

  return memoized;
};

let computationCount = 0;
const heavyComputation = (a, b) => {
  computationCount++;
  console.log(computationCount);
  return a + b;
};

const memoizedHeavyComputation = heavyComputation.myMemoize((a, b) =>
  JSON.stringify([a, b])
);
memoizedHeavyComputation(2, 3);
memoizedHeavyComputation(2, 3);

memoizedHeavyComputation(3, 2);
