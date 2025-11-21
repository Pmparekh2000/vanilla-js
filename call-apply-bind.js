Function.prototype.myCall = function (context, ...args) {
  const fn = this;

  // 1. Check if 'this' is a function
  if (typeof fn !== "function") {
    throw new TypeError("myCall can be called only on a function");
  }

  // 2. Coerce context: Handle null/undefined and primitives (crucial difference)
  // If context is null or undefined, use the global object.
  // Otherwise, wrap it as an Object to handle primitives (e.g., 123 -> Number{123}).
  const executionContext =
    context === null || context === undefined
      ? globalThis // 'globalThis' is the modern, environment-agnostic way to get the global object
      : Object(context); // Object() wraps primitives into objects

  // 3. Create a unique property key for the temporary function
  // Using a Symbol prevents property name collisions (the standard best practice).
  const uniqueFnKey = Symbol("tempFn");

  // 4. Attach the original function to the context
  executionContext[uniqueFnKey] = fn;

  // 5. Execute the function and capture the result
  // The 'this' inside fn now points to executionContext.
  const result = executionContext[uniqueFnKey](...args);

  // 6. Delete the temporary function to avoid polluting the context
  delete executionContext[uniqueFnKey];

  // 7. Return the result of the function call
  return result;
};

// // 1. Primitive Context Check (Should work)
// function getContext() {
//   return this.valueOf();
// }
// console.log(getContext.myCall(5, 1)); // Output: 5 (this is Number{5})

Function.prototype.myApply = function (context, args) {
  const fn = this;

  // 1. Check if 'this' is a function
  if (typeof fn !== "function") {
    throw new TypeError(
      "Function.prototype.myApply must be called on a function"
    );
  }

  // --- ⚠️ CRITICAL IMPROVEMENT for args ---
  // The second argument 'args' must be null, undefined, or an array-like object.
  if (
    args !== null &&
    args !== undefined &&
    !Array.isArray(args) &&
    typeof args[Symbol.iterator] !== "function" &&
    typeof args.length !== "number"
  ) {
    // If an object has a property with the key Symbol.iterator, and that property's value is a function, the object is considered iterable
    // This checks for the presence and type of the length property. The length property is the defining feature of array-like objects.
    // This check is a simplified version of the spec but catches common non-array inputs.
    // Native 'apply' would also throw for non-iterable, non-array-like objects.
    // For a minimal polyfill, we focus on null/undefined and array-like.
    // For simplicity and robustness, we can rely on spread for non-null/undefined,
    // but MUST handle the null/undefined case separately.
    throw new TypeError(
      "Arguments been passed to apply must be of the type iterable"
    );
  }

  // 2. Coerce context
  const executionContext =
    context === null || context === undefined ? globalThis : Object(context);

  // 3. Create a unique property key for the temporary function
  const uniqueFnKey = Symbol("tempFn");

  // 4. Attach the original function to the context
  executionContext[uniqueFnKey] = fn;

  let result;

  // 5. Execute the function and capture the result
  if (args === null || args === undefined) {
    // If args is null or undefined, call the function with NO arguments
    result = executionContext[uniqueFnKey]();
  } else {
    // If args is provided, use the spread operator to pass the elements as arguments
    // Note: This correctly handles arrays and array-like objects (like Arguments)
    // but will fail on non-iterable, non-array-like objects (as the native apply might,
    // or it might throw a TypeError earlier depending on the JS engine).
    try {
      result = executionContext[uniqueFnKey](...args);
    } catch (error) {
      // If the spread fails (e.g., args is a number or non-iterable object),
      // throw a TypeError, mirroring the expected failure mode of native apply/spread.
      throw new TypeError("CreateListFromArrayLike called on non-object");
    }
  }

  // 6. Delete the temporary function to avoid polluting the context
  delete executionContext[uniqueFnKey];

  // 7. Return the result of the function call
  return result;
};

// 1. Primitive Context Check (Should work)
// function getContext() {
//   return this.valueOf();
// }
// console.log(getContext.myApply(5)); // Output: 5 (this is Number{5})

Function.prototype.myBind = function (context, ...args) {
  const fn = this;

  // 1. Check if 'this' is a function (Same as yours)
  if (typeof fn !== "function") {
    throw new TypeError(
      "Function.prototype.myBind must be called on a function"
    );
  }

  // A helper function that handles all logic
  const bound = function (...extraArgs) {
    // ⚠️ Critical Step 1: Check if the function was called with 'new'
    // 'this' inside the bound function will be an instance of bound.prototype
    // if called with 'new', and NOT the global object or context.
    // We check this by comparing 'this' to the bound function's prototype chain.
    const isNew = this instanceof bound;

    // Determine the final 'this' context:
    // If 'new' was used, 'this' is the new instance, so we use it.
    // If not, we fall back to the fixed context.
    const finalContext = isNew ? this : context;

    // Call the original function with the combined arguments
    // No need for the Symbol/temp property trick here, as we are using 'call'
    // to explicitly set the 'this' context.
    return fn.apply(finalContext, args.concat(extraArgs));
  };

  // ⚠️ Critical Step 2: Preserve the prototype chain for constructor use
  // This step ensures that 'new BoundFn() instanceof OriginalFn' is true.

  // We use an intermediary "NOP" (No Operation) function to hold the prototype
  // without executing the original function when setting up the prototype chain.
  if (fn.prototype) {
    // Create a new function that inherits from the original function's prototype
    const NOP = function () {};
    NOP.prototype = fn.prototype;

    // Set the bound function's prototype to the NOP's instance
    bound.prototype = new NOP();
    // Alternatively, you could use Object.create for this, but NOP is a classic polyfill method.
  }

  return bound;
};

function add(a, b) {
  // We change the function name for clarity and use 'this' for context
  return this.base + a + b;
}

const person = { base: 10 };
// Fix context to 'person' and fix the first argument (a) to 5
const obtainedContext = add.myBind(person, 5);

// When called, it executes: 10 (base) + 5 (a) + 3 (b)
console.log(obtainedContext(3)); // Output: 18 (Correct: 10 + 5 + 3)

// When called, it executes: 10 (base) + 5 (a) + 4 (b)
console.log(obtainedContext(4)); // Output: 19 (Correct: 10 + 5 + 4)
