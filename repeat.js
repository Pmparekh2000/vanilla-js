String.prototype.repeat = function (count) {
  // Check if the context ('this') is null or undefined. If so, throw a TypeError.
  if (this === null || this === undefined) {
    throw new TypeError(
      "Calling String.prototype.repeat on null or undefined values"
    );
  }

  // Coerce the context ('this') to a string.
  const string = String(this);

  let n = count;

  if (typeof n !== "number") {
    // Coerce the repetation count to a number.
    n = Number(n);
  }

  // Ensure n is an integer.
  n = Math.floor(n);

  // Handle edge cases for count (RangeError).
  if (n < 0 || n === Infinity) {
    throw new RangeError();
  }

  // Handle count of zero (returns empty string).
  if (n === 0) {
    return "";
  }

  return new Array(n + 1).join(string);

  /* Alternative: Simple Loop (More verbose, but sometimes safer in highly restricted environments)
        let result = '';
        while (n--) {
            result += string;
        }
        return result;
        */
};

// --- Example Usage and Edge Case Testing ---

// 1. Basic usage
console.log("Basic Test: 'abc'.repeat(3) ->", "abc".repeat(3)); // "abcabcabc"

// 2. Non-integer count (should floor)
console.log("Floor Test: 'a'.repeat(3.9) ->", "a".repeat(3.9)); // "aaa"

// 3. Zero count
console.log("Zero Test: 'b'.repeat(0) ->", "b".repeat(0)); // ""

// 4. Coercion of 'this' (e.g., repeating a number)
// Note: (5).repeat(2) is not possible, so we use Function.prototype.call
const numberToRepeat = 123;
console.log(
  "Coercion Test: (123).toString().repeat(2) ->",
  String.prototype.repeat.call(numberToRepeat, 2)
); // "123123"

// 5. Negative count (Should throw RangeError)
try {
  "c".repeat(-1);
} catch (e) {
  console.error("Negative Test (Expected Error):", e.name, e.message); // RangeError: Invalid count value
}

// 6. Infinity count (Should throw RangeError)
try {
  "d".repeat(Infinity);
} catch (e) {
  console.error("Infinity Test (Expected Error):", e.name, e.message); // RangeError: Invalid count value
}
