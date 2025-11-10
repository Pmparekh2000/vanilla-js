class Counter {
  constructor(count = 0) {
    this.count = count;
  }

  incrementCounter = () => {
    this.count++;
    console.log(this.count);
  };

  decrementCounter = () => {
    this.count--;
    console.log(this.count);
  };
}

const counter1 = new Counter();
counter1.incrementCounter();
counter1.incrementCounter();
counter1.incrementCounter();

const counter2 = new Counter(10);
counter2.decrementCounter();
counter2.decrementCounter();
