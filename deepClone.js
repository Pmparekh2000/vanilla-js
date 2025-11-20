/**
 * Via deepClone we can understand how to handle complex object copying in JavaScript.
 * A complete polyfill needs to handle various data types and avoid infinite loops with circular references.
 * Things covered in deepClone polyfill:
 * - nested objects
 * - arrays
 * - functions
 * - dates
 * - regular expressions and
 * - circular references
 *
 * This implementation uses "WeakMap" to keep track of "circular references" in a efficient way.
 * The primary reason to use a WeakMap is
 * - To prevent memory leaks: A strong map will hold onto objects been used as keys even after deepClone is done.
 * This memory of strong objects won't be garbage collected automatically. Why to hold so much of memory.
 * Whereas if one makes us of WeakMap then the objects will automatically be garbage collected once their purpose
 * is fullfilled.
 */

/**
 * A polyfill for Lodash's _.deepClone method.
 * Handles circular references using a WeakMap.
 * Supports cloning of various data types including:
 * - Primitives (string, number, boolean, undefined, null, symbol)
 * - Objects and Arrays (including nested ones)
 * - Dates
 * - Regular Expressions
 * - Functions (references are copied, not the function itself)
 */
function deepClone(obj, hash = new WeakMap()) {
  // Handle primitives and null/undefined
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle circular references
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // Handle specific object types
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Handle functions
  if (typeof obj === "function") {
    // Functions are not deep cloned, but a reference to the same function is returned
    // This is the standard behavior as deep cloning a function is generally not useful.
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArr = [];
    hash.set(obj, clonedArr); // Add to hash before recursive calls
    obj.forEach((item, index) => {
      clonedArr[index] = deepClone(item, hash);
    });
    return clonedArr;
  }

  // Handle objects
  const clonedObj = {};
  hash.set(obj, clonedObj); // Add to hash before recursive calls
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key], hash);
    }
  }

  // Handle Symbols as object keys
  const symbols = Object.getOwnPropertySymbols(obj);
  symbols.forEach((symbol) => {
    clonedObj[symbol] = deepClone(obj[symbol], hash);
  });

  return clonedObj;
}

// === Example Usage ===
const symbolKey = Symbol("key");
const original = {
  a: 1,
  b: "hello",
  c: true,
  d: null,
  e: undefined,
  f: Symbol("test"),
  g: [1, 2, { h: "world" }],
  i: new Date(),
  j: /abc/g,
  k: function () {
    console.log("I am a function");
  },
  l: {
    nested: {
      m: 42,
    },
  },
  [symbolKey]: "symbol value",
};

// Create a circular reference
original.l.nested.n = original;

const cloned = deepClone(original);

// Test for deep equality and reference changes
console.log(cloned.a === original.a); // true
console.log(cloned.g === original.g); // false (different array reference)
console.log(cloned.g[2] === original.g[2]); // false (different object reference)
console.log(cloned.i instanceof Date); // true
console.log(cloned.i.getTime() === original.i.getTime()); // true
console.log(cloned.j instanceof RegExp); // true
console.log(cloned.k === original.k); // true (function reference is same)
console.log(cloned.l.nested.m === original.l.nested.m); // true
console.log(cloned.l.nested.n === cloned); // true (circular reference handled)
console.log(cloned[symbolKey] === original[symbolKey]); // true (Symbol as value is cloned)
console.log(
  Object.getOwnPropertySymbols(cloned)[0] ===
    Object.getOwnPropertySymbols(original)[0]
); // true (Symbol as key is cloned)
