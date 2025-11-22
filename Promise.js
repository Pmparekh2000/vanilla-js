/**
 * A robust Polyfill for the JavaScript Promise, implementing core
 * aspects of the Promises/A+ specification, including:
 * 1. Asynchronous execution of then/catch handlers (using queueMicrotask or setTimeout(fn, 0)).
 * 2. Proper Promise Chaining (returning a new Promise from 'then').
 * 3. Handling return values from handlers (value or another promise).
 */
function PromisePolyFill(executor) {
  // State variables
  let state = "pending";
  let value = undefined;
  let handlers = []; // Stores { onResolved, onRejected, resolve, reject } objects for chaining

  // Utility function for asynchronous execution
  const runAsync =
    typeof queueMicrotask === "function"
      ? queueMicrotask
      : (fn) => setTimeout(fn, 0);

  /**
   * Pushes a resolution handler onto the queue if pending, or executes immediately
   * if already settled (asynchronously).
   * @param {function} handler - The success or failure handler function.
   * @param {string} currentState - 'fulfilled' or 'rejected'.
   * @param {function} resolve - The resolve function of the *next* promise in the chain.
   * @param {function} reject - The reject function of the *next* promise in the chain.
   */
  function handle(handler) {
    if (state === "pending") {
      // If still pending, enqueue the handler
      handlers.push(handler);
    } else {
      // If settled, schedule the handler execution asynchronously
      runAsync(() => {
        try {
          // If the handler is not a function, we must pass the value through (chaining)
          if (typeof handler.callback !== "function") {
            if (state === "fulfilled") {
              handler.resolve(value);
            } else {
              handler.reject(value);
            }
            return;
          }

          // Execute the handler with the promise's final value
          const result = handler.callback(value);

          // Crucial: Resolve the next promise (handler.resolve) with the result
          // This handles the edge case where the result is another promise (thenable resolution)
          handler.resolve(result);
        } catch (error) {
          // If the handler throws an error, the next promise in the chain is rejected
          handler.reject(error);
        }
      });
    }
  }

  /**
   * Executes all waiting handlers and transitions the state from 'pending'.
   * @param {string} newState - 'fulfilled' or 'rejected'.
   * @param {*} result - The resolution value or rejection reason.
   */
  function changeState(newState, result) {
    if (state !== "pending") return;

    // Transition state
    state = newState;
    value = result;

    // Execute all queued handlers
    handlers.forEach((handler) => {
      handle(handler);
    });

    // Clear handlers to free up memory
    handlers = [];
  }

  // --- Resolution Functions ---

  const resolve = (newValue) => {
    // Edge Case 1: If the new value is a Promise/Thenable, adopt its state
    if (newValue && typeof newValue.then === "function") {
      try {
        newValue.then(resolve, reject);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    }
    // Final resolution
    changeState("fulfilled", newValue);
  };

  const reject = (reason) => {
    changeState("rejected", reason);
  };

  // --- Public Methods ---

  this.then = (onResolved, onRejected) => {
    // Edge Case 2: Chaining requires 'then' to return a *new* promise
    return new PromisePolyFill((nextResolve, nextReject) => {
      const resolvedHandler = {
        state: "fulfilled",
        callback: onResolved,
        resolve: nextResolve,
        reject: nextReject,
      };
      const rejectedHandler = {
        state: "rejected",
        callback: onRejected,
        resolve: nextResolve,
        reject: nextReject,
      };

      // Handle the handlers (either enqueue or run async)
      handle(resolvedHandler);
      handle(rejectedHandler);
    });
  };

  // catch is just syntactic sugar for then(null, onRejected)
  this.catch = (onRejected) => {
    return this.then(null, onRejected);
  };

  // --- Executor Execution ---
  try {
    executor(resolve, reject);
  } catch (error) {
    // Edge Case 3: The executor function itself can throw an error
    reject(error);
  }
}

// Example usage to demonstrate chaining and asynchronicity:

const myPromise = new PromisePolyFill((resolve, reject) => {
  console.log("Executor Started (1)");
  // Asynchronous resolve
  setTimeout(() => {
    resolve(10);
  }, 50);
  // Synchronous log
  console.log("Executor Ending (2)");
});

myPromise
  .then((res) => {
    console.log(`First then handler received: ${res} (3)`);
    return res * 2; // Returns a simple value for the next promise
  })
  .then((res) => {
    console.log(`Second then handler received: ${res} (4)`);
    // Returns a new promise (thenable resolution)
    return new PromisePolyFill((resolve) => {
      setTimeout(() => resolve(res + 1), 50);
    });
  })
  .then((finalRes) => {
    console.log(`Final then handler received: ${finalRes} (5)`);
    // Example of throwing an error to test the catch block
    // throw new Error("Oops, chaining failed!");
    return "SUCCESS";
  })
  .catch((err) => {
    console.error("Caught in Catch: ", err);
  });

/*
  Expected output order (demonstrates asynchronicity):
  Executor Started (1)
  Executor Ending (2)
  (After 50ms) First then handler received: 10 (3)
  (After 0ms) Second then handler received: 20 (4)
  (After 50ms) Final then handler received: 21 (5)
  */
