import { BaseIndicator } from "../base-indicator";
import { MAInput, SMA } from "./SMA";

export class WEMA extends BaseIndicator {
  period: number;
  price: number[];
  result: number[];
  generator: Generator<number, never, number>;
  constructor(input: MAInput) {
    super(input);
    var period = input.period;
    var priceArray = input.values;
    var exponent = 1 / period;
    var sma: SMA;

    this.result = [];

    sma = new SMA({ period: period, values: [] });

    var genFn = function* (): Generator<number, never, number> {
      var tick = yield;
      var prevEma: number;
      while (true) {
        if (prevEma !== undefined && tick !== undefined) {
          prevEma = (tick - prevEma) * exponent + prevEma;
          tick = yield prevEma;
        } else {
          tick = yield;
          prevEma = sma.nextValue(tick);
          if (prevEma !== undefined) tick = yield prevEma;
        }
      }
    };

    this.generator = genFn();

    this.generator.next();
    this.generator.next();

    priceArray.forEach((tick) => {
      var result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }

  static calculate = wema;

  nextValue(price: number): number | undefined {
    var result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}

export function wema(input: MAInput): number[] {
  BaseIndicator.reverseInputs(input);
  var result = new WEMA(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}