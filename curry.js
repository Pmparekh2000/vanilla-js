const add = (a, b, c) => a + b + c;

const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }

    return function (...extraArgs) {
      return curried.apply(this, args.concat(extraArgs));
    };
  };
};

const curriedAdd = curry(add);

console.log(curriedAdd(1, 2)(3));
