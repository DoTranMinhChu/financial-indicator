import { CandleData } from "../StockData";
import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";
import { SMA } from "../moving-averages";

export class AwesomeOscillatorInput extends BaseIndicatorInput {
  high: number[] = [];
  low: number[] = [];
  fastPeriod!: number;
  slowPeriod!: number;
}

export class AwesomeOscillator extends BaseIndicator {
  generator: Generator<any, any, any>;
  constructor(input: AwesomeOscillatorInput) {
    super(input);
    var highs = input.high;
    var lows = input.low;
    var fastPeriod = input.fastPeriod;
    var slowPeriod = input.slowPeriod;

    var slowSMA = new SMA({ values: [], period: slowPeriod });
    var fastSMA = new SMA({ values: [], period: fastPeriod });

    this.result = [];

    this.generator = (function* () {
      var result;
      var tick;
      var medianPrice;
      var slowSmaValue;
      var fastSmaValue;
      tick = yield;
      while (true) {
        medianPrice = (tick.high + tick.low) / 2;
        slowSmaValue = slowSMA.nextValue(medianPrice);
        fastSmaValue = fastSMA.nextValue(medianPrice);
        if (slowSmaValue !== undefined && fastSmaValue !== undefined) {
          result = fastSmaValue - slowSmaValue;
        }
        tick = yield result;
      }
    })();

    this.generator.next();

    highs.forEach((tickHigh, index) => {
      var tickInput = {
        high: tickHigh,
        low: lows[index],
      };
      var result = this.generator.next(tickInput);
      if (result.value != undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }

  static calculate = awesomeoscillator;

  nextValue(price: CandleData): number | undefined {
    var result = this.generator.next(price);
    if (result.value != undefined) {
      return this.format(result.value);
    }
    return undefined;
  }
}

export function awesomeoscillator(input: AwesomeOscillatorInput): number[] {
  BaseIndicator.reverseInputs(input);
  var result = new AwesomeOscillator(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
