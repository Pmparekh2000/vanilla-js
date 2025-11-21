// Polyfill for map
Array.prototype.myMap = function (callBackFn, thisArg) {
  // 1. Check for null or undefined 'this'
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.myMap called on null or undefined");
  }

  // 2. Check callback function type
  if (typeof callBackFn !== "function") {
    throw new TypeError("Callback must be a function");
  }

  // 3. Convert 'this' to an object (handling primitives, etc.)
  const O = Object(this);

  // 4. Get the length (>>> 0 ensures an unsigned 32-bit integer)
  const len = O.length >>> 0;

  // 5. Create a new array to store results
  // We use new Array(len) to ensure the length is preserved for sparse arrays
  const output = new Array(len);

  // 6. Iterate and execute the callback
  for (let i = 0; i < len; i++) {
    // 7. Handle sparse arrays (i in O is key)
    // Only process elements that actually exist in the original array
    // For elements that don't exist in original array, skip them and leave empty space in output array
    // So we always tend to preserve the spare nature of the original array
    if (i in O) {
      // 8. Call the callback with the correct 'this' context (thisArg)
      const mappedValue = callBackFn.call(thisArg, O[i], i, O);

      // 9. Assign the result to the new array at the correct index
      output[i] = mappedValue;
    }
  }

  return output;
};

Array.prototype.myForEach = function (callBackFn, thisArg) {
  // 1. Check for null or undefined 'this'
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.myForEach called on null or undefined"
    );
  }

  // 2. Check callback function type
  if (typeof callBackFn !== "function") {
    throw new TypeError("Callback must be a function");
  }

  // 3. Convert 'this' to an object (handling primitives, etc.)
  const O = Object(this);

  // 4. Get the length (>>> 0 ensures an unsigned 32-bit integer)
  const len = O.length >>> 0;

  // 6. Iterate and execute the callback
  for (let i = 0; i < len; i++) {
    // 7. Handle sparse arrays (i in O is key)
    // Only process elements that actually exist in the original array
    // For elements that don't exist in original array, skip them and leave empty space in output array
    // So we always tend to preserve the spare nature of the original array
    if (i in O) {
      // 8. Call the callback with the correct 'this' context (thisArg)
      callBackFn.call(thisArg, O[i], i, O);
    }
  }

  return undefined;
};

const arr1 = [1, , , 4, 5];
const output1 = arr1.myForEach((val, index) => console.log(val));

// Polyfill for filter
Array.prototype.myFilter = function (callBackFn, thisArg) {
  // 1. Check for null or undefined 'this'
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.myFilter called on null or undefined");
  }

  // 2. Check callback function type
  if (typeof callBackFn !== "function") {
    throw new TypeError("Callback must be a function");
  }

  // 3. Convert 'this' to an object (handling primitives, etc.)
  const O = Object(this);

  // 4. Get the length (>>> 0 ensures an unsigned 32-bit integer)
  const len = O.length >>> 0;

  // 5. Create a new empty array to store results
  const output = [];

  // 6. Iterate and execute the callback
  for (let i = 0; i < len; i++) {
    // 7. Handle sparse arrays (i in O is key)
    // Only process elements that actually exist in the original array
    // skip the elements that are not present in original array
    if (i in O) {
      // 8. Call the callback with the correct 'this' context (thisArg)
      if (callBackFn.call(thisArg, O[i], i, O)) output.push(O[i]);
    }
  }

  return output;
};

// const arr = [1, , , 4, 5];
// const output = arr.myFilter((val, index) => val % 2 === 0);

// Polyfill for reduce
// 0. native reduce function does not have a thisArg variable
Array.prototype.myReduce = function (callBackFn, initialValue) {
  // 1. Check for null or undefined 'this'
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.myReduce called on null or undefined");
  }

  // 2. Check callback function type
  if (typeof callBackFn !== "function") {
    throw new TypeError("Callback must be a function");
  }

  // 3. Convert 'this' to an object (handling primitives, etc.)
  const O = Object(this);

  // 4. Get the length (>>> 0 ensures an unsigned 32-bit integer)
  const len = O.length >>> 0;

  // 5. Renamed 'output' to 'accumulator' for clarity and starting index for iteration
  let accumulator;
  let k = 0;

  if (arguments.length > 1) {
    // Scenario 1: initialValue IS provided
    accumulator = initialValue;
    k = 0;
  } else {
    // Scenario 2: initialValue is NOT provided
    let kPresent = false;
    while (k < len) {
      if (k in O) {
        accumulator = O[k];
        kPresent = true;
        break; // Found the starting element
      }
      k++; // Move to the next index
    }
    // Edge Case: Throw TypeError if the array is empty AND no initialValue was provided
    if (!kPresent) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    k++; // Start iteration from the element *after* the accumulator
  }

  // 6. Iterate and execute the callback
  for (; k < len; k++) {
    // 7. Handle sparse arrays (i in O is key)
    // Only process elements that actually exist in the original array
    // skip the elements that are not present in original array
    if (k in O) {
      // 8. Call the callback with the correct 'this' context (thisArg)
      accumulator = callBackFn(accumulator, O[k], k, O);
    }
  }

  return accumulator;
};

const arr = [1, , 3, 3, 5, 5];
const output = arr.myReduce((acc, current) => acc + current);
console.log(output);
