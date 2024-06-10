//STEP 1. Import Necessary indicator or rather last step

import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";
import { LinkedList } from "../utils/LinkedList";

//STEP 2. Create the input for the indicator, mandatory should be in the constructor
export class MAInput extends BaseIndicatorInput {
  constructor(public period: number, public values: number[]) {
    super();
  }
}

//STEP3. Add class based syntax with export
export class SMA extends BaseIndicator {
  period: number;
  price: number[];
  override result: number[];
  generator: Generator<number | undefined, number | undefined, number>;
  constructor(input: MAInput) {
    super(input);
    this.period = input.period;
    this.price = input.values;
    const genFn = function* (
      period: number
    ): Generator<number | undefined, number | undefined, number> {
      const list = new LinkedList();
      let sum = 0;
      let counter = 1;
      let current: number = yield;
      let result;
      list.push(0);
      while (true) {
        if (counter < period) {
          counter++;
          list.push(current);
          current ? (sum = sum + current) : undefined;
        } else {
          current ? (sum = sum - list.shift() + current) : undefined;
          result = sum / period;
          list.push(current);
        }
        current = yield result;
      }
    };
    this.generator = genFn(this.period);
    this.generator.next();
    this.result = [];
    this.price.forEach((tick) => {
      let result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }

  static calculate = sma;

  nextValue(price: number): number | undefined {
    const result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
    return undefined;
  }
}

export function sma(input: MAInput): number[] {
  BaseIndicator.reverseInputs(input);
  const result = new SMA(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}

//STEP 6. Run the tests
