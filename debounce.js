/**
 * Debounces a function call, ensuring it's only executed after a specified delay
 * following the last invocation.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.leading=false] - Specify whether to invoke on the leading edge.
 * @param {boolean} [options.trailing=true] - Specify whether to invoke on the trailing edge.
 * @returns {Function} - The debounced function with .cancel() and .flush() methods.
 */
function debounce(func, wait, options = {}) {
  let timeoutId = null;
  let lastResult;
  let lastArgs = null;
  let lastContext = null;

  // Set default options
  const { leading = false, trailing = true } = options;

  if (!leading && !trailing) {
    // If neither edge is enabled, return the original function
    return func;
  }

  // This is the core logic that executes the original function
  const invokeFunc = () => {
    const result = func.apply(lastContext, lastArgs);

    // Only clear context/args if we're not running on the leading edge
    // (the leading run handles its own cleanup)
    if (!timeoutId) {
      lastContext = lastArgs = null;
    }

    lastResult = result;
    return result;
  };

  // Function to handle the trailing edge execution
  const trailingEdge = () => {
    clearTimeout(timeoutId);
    timeoutId = null;

    // Execute if trailing is enabled AND there are captured arguments/context
    if (trailing && lastContext) {
      return invokeFunc();
    }

    // If trailing is disabled or no calls occurred, simply clear the state
    lastContext = lastArgs = null;
    return lastResult;
  };

  // The returned debounced function
  const debounced = function (...args) {
    lastContext = this; // Capture the correct 'this' context
    lastArgs = args; // Capture the latest arguments

    const isLeading = leading && !timeoutId;

    // Clear the existing timer
    clearTimeout(timeoutId);

    // Schedule the trailing execution
    timeoutId = setTimeout(trailingEdge, wait);

    if (isLeading) {
      // Execute immediately on the leading edge
      lastResult = invokeFunc();
    }

    // Return the last calculated result (or undefined if never run)
    return lastResult;
  };

  // --- Addon Functionality 1: Cancel ---
  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastContext = lastArgs = null; // Reset state
  };

  // --- Addon Functionality 2: Flush ---
  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      return invokeFunc(); // Invoke the function immediately
    }
    return lastResult; // If no pending call, return last result
  };

  return debounced;
}

// --- Example Usage ---
const apiCall = (query) => {
  const time = Date.now() % 10000;
  console.log(`[${time}] API CALL: Searching for "${query}"`);
  return `Results for ${query}`;
};

// 1. Debounce with Leading Edge (API call immediately, then wait)
const searchInput = debounce(apiCall, 1000, { leading: true, trailing: true });

// console.log("--- Leading Edge Example (search as user types) ---");
// searchInput("a"); // EXECUTES IMMEDIATELY (Leading)
// searchInput("ab"); // IGNORED
// searchInput("abc"); // IGNORED
// setTimeout(() => searchInput("abcd"), 1500); // EXECUTES IMMEDIATELY (Delay passed)

// 2. Debounce with Flush (Ensuring the latest input is processed)
// const saveSettings = debounce(apiCall, 2000, {
//   leading: false,
//   trailing: true,
// });

// console.log("\n--- Flush Example (save settings) ---");
// saveSettings("Draft 1"); // IGNORED, timer set
// saveSettings("Draft 2"); // IGNORED, timer reset
// saveSettings("Final Draft"); // IGNORED, timer reset

// // User clicks "Save Now" button, forcing execution
// saveSettings.flush(); // EXECUTES IMMEDIATELY, using 'Final Draft'

// 3. Debounce with Cancel
const pendingTask = debounce(apiCall, 500);
pendingTask("Task A");
pendingTask("Task B"); // Timer is running for 'Task B'
pendingTask.cancel(); // Prevents 'Task B' from running at all
console.log("Scheduled Task B was cancelled.");
