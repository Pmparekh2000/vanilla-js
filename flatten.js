function flatten(arr, level = Infinity) {
  const output = [];
  arr.forEach((val) => {
    if (Array.isArray(val) && level > 0) {
      output.push(...flatten(val, level - 1));
    } else {
      output.push(val);
    }
  });
  return output;
}

let output = [];
const input = [4, [1, [2]], 3, 5, "hello", {}, true];
console.log(flatten(input, 1));

function insertIntoArray(val) {
  input.push(val);
}

// insertIntoArray("hello");
// insertIntoArray(10);
// insertIntoArray([3, 4]);
// output = [];
// flatten(input, output, 2);

const input1 = [4, [1, [2]], [[[[[3, 5]]]]]];
console.log(flatten(input1));
