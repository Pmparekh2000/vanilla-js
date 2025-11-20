const throttle = (fn, ...args) => {
  let flag = true;
  return (limit, ...extraArgs) => {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, limit);
      return fn.apply(this, [...args, ...extraArgs]);
    }
  };
};

const expensiveFn = () => {
  console.log("Calling expensiveFn");
};

const throttledExpensiveFunction = throttle(expensiveFn);

window.addEventListener("resize", () => throttledExpensiveFunction(2000));
