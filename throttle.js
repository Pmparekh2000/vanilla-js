/**
 * Throttles a function to limit its execution rate.
 *
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.leading=true] - Execute on the leading edge of the throttle.
 * @param {boolean} [options.trailing=true] - Execute on the trailing edge of the throttle.
 * @returns {Function} - The throttled function.
 */
function throttle(func, limit, options = {}) {
  let timeoutId = null;
  let lastArgs = null;
  let lastContext = null;
  let lastResult;
  let lastCallTime = 0;

  // Set default options
  const { leading = true, trailing = true } = options;

  if (!leading && !trailing) {
    // If both are false, throttling is meaningless.
    return func;
  }

  const invokeFunc = (time) => {
    // Clear the timeout to prevent trailing execution from running twice
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    // Store and return the result of the function execution
    lastResult = func.apply(lastContext, lastArgs);
    lastCallTime = time; // Mark when this execution happened

    // Reset context and args after execution
    lastContext = lastArgs = null;

    return lastResult;
  };

  const throttled = function (...args) {
    const now = Date.now();
    lastArgs = args;
    lastContext = this; // Capture the correct 'this' context

    const timeSinceLastCall = now - lastCallTime;
    const timeRemaining = limit - timeSinceLastCall;

    if (timeRemaining <= 0 || timeRemaining > limit) {
      // Case 1: Time has expired or this is the very first call.
      if (leading) {
        // Execute immediately (leading edge)
        return invokeFunc(now);
      }
      // If !leading, we schedule the function for the trailing edge.
      if (!timeoutId && trailing) {
        timeoutId = setTimeout(() => {
          // This will execute later (trailing edge)
          invokeFunc(Date.now());
        }, limit);
      }
    } else if (!timeoutId && trailing) {
      // Case 2: Time has NOT expired, and we need a trailing edge run.
      // Schedule the trailing execution.
      timeoutId = setTimeout(() => {
        invokeFunc(Date.now());
      }, timeRemaining);
    }

    // Return the last calculated result immediately on calls that are ignored
    return lastResult;
  };

  // Add a cancel method (addon functionality)
  throttled.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastCallTime = 0;
    lastContext = lastArgs = null;
  };

  return throttled;
}

// --- Example Usage ---
const logEvent = (name, detail) => {
  console.log(
    `[${Date.now() % 10000}] Event: ${name}, Detail: ${detail}, Context:`,
    this
  );
};

// 1. Basic Trailing (Default if leading=false)
const trailingThrottled = throttle(logEvent, 1000, {
  leading: false,
});

// 2. Default (Leading and Trailing) - Best for general use
const defaultThrottled = throttle(logEvent, 1000);

// Example of rapid calls (simulating mousemove or scroll)
console.log("Starting calls for defaultThrottled (Leading & Trailing):");
defaultThrottled("mousemove", 1); // EXECUTES IMMEDIATELY (Leading)
defaultThrottled("mousemove", 2); // IGNORED
defaultThrottled("mousemove", 3); // IGNORED
setTimeout(() => {
  defaultThrottled("mousemove", 4); // EXECUTES ONE FINAL TIME (Trailing)
}, 1100);

// Example of the cancel functionality
const cancelableThrottled = throttle(logEvent, 500);
cancelableThrottled("click", "A"); // Executes immediately
cancelableThrottled("click", "B"); // Ignored, but scheduled for trailing run
cancelableThrottled.cancel(); // Clears the scheduled trailing run!

console.log("Scheduled trailing call was cancelled.");

// const throttle = (fn, ...args) => {
//   let flag = true;
//   return (limit, ...extraArgs) => {
//     if (flag) {
//       flag = false;
//       setTimeout(() => {
//         flag = true;
//       }, limit);
//       return fn.apply(this, [...args, ...extraArgs]);
//     }
//   };
// };

// const expensiveFn = () => {
//   console.log("Calling expensiveFn");
// };

// const throttledExpensiveFunction = throttle(expensiveFn);

// window.addEventListener("resize", () => throttledExpensiveFunction(2000));
