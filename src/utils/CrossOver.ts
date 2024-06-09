import { CrossUp } from "./CrossUp";
import { CrossDown } from "./CrossDown";
import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";

export class CrossOverInput extends BaseIndicatorInput {
  constructor(public sourceSeries: number[], public referenceSeries: number[]) {
    super();
  }
}
export class CrossOverNext {
  sourceValue: number;
  referenceValue: number;
}
export class CrossOver extends BaseIndicator {
  generator: Generator<boolean, boolean, CrossOverNext>;
  result: boolean[];

  constructor(input: CrossOverInput) {
    super(input);

    var crossUp = new CrossUp({
      sourceSeries: input.sourceSeries,
      referenceSeries: input.referenceSeries,
    });
    var crossDown = new CrossDown({
      sourceSeries: input.sourceSeries,
      referenceSeries: input.referenceSeries,
    });

    const genFn = function* (): Generator<boolean, boolean, CrossOverNext> {
      var current = yield;
      var result = false;
      var first = true;

      while (true) {
        var nextUp = crossUp.nextValue({
          sourceValue: current.sourceValue,
          referenceValue: current.referenceValue,
        });
        var nextDown = crossDown.nextValue({
          sourceValue: current.sourceValue,
          referenceValue: current.referenceValue,
        });

        result = nextUp || nextDown;

        if (first) result = false;
        first = false;
        current = yield result;
      }
    };

    this.generator = genFn();
    this.generator.next();

    var resultA = crossUp.getResult();
    var resultB = crossDown.getResult();

    this.result = resultA.map((a: any, index: number) => {
      if (index === 0) return false;
      return !!(a || resultB[index]);
    });
  }

  static calculate = crossOver;

  static reverseInputs(input: CrossOverInput): void {
    if (input.reversedInput) {
      input.sourceSeries ? input.sourceSeries.reverse() : undefined;
      input.referenceSeries ? input.referenceSeries.reverse() : undefined;
    }
  }

  nextValue(next: CrossOverNext): boolean {
    return this.generator.next(next).value;
  }
}

export function crossOver(input: CrossOverInput): boolean[] {
  BaseIndicator.reverseInputs(input);
  var result = new CrossOver(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
