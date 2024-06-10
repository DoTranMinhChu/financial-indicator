import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";

export class AvgGainInput extends BaseIndicatorInput {
  period!: number;
  values: number[] = [];
}

export class AverageGain extends BaseIndicator {
  generator: Generator<number | undefined, number | undefined, number>;
  constructor(input: AvgGainInput) {
    super(input);
    let values = input.values;
    let period = input.period;
    let format = this.format;

    this.generator = (function* (
      period
    ): Generator<number | undefined, number | undefined, number> {
      let currentValue = yield;
      let counter = 1;
      let gainSum = 0;
      let avgGain: number | undefined;
      let gain: number | undefined;
      let lastValue = currentValue;
      currentValue = yield;
      while (true) {
        gain = currentValue - lastValue;
        gain = gain > 0 ? gain : 0;
        if (gain > 0) {
          gainSum = gainSum + gain;
        }
        if (counter < period) {
          counter++;
        } else if (avgGain === undefined) {
          avgGain = gainSum / period;
        } else {
          avgGain = (avgGain * (period - 1) + gain) / period;
        }
        lastValue = currentValue;
        avgGain = avgGain !== undefined ? format(avgGain) : undefined;
        currentValue = yield avgGain;
      }
    })(period);

    this.generator.next();

    this.result = [];

    values.forEach((tick: number) => {
      var result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  static calculate = averagegain;

  nextValue(price: number): number | undefined {
    return this.generator.next(price).value;
  }
}

export function averagegain(input: AvgGainInput): number[] {
  BaseIndicator.reverseInputs(input);
  var result = new AverageGain(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
