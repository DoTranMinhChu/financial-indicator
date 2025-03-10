import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";

export class CrossUpInput extends BaseIndicatorInput<number> {
  constructor(public sourceSeries: number[], public referenceSeries: number[]) {
    super();
  }
}
export class CrossUpNext {
  sourceValue!: number;
  referenceValue!: number;
}

export class CrossUp extends BaseIndicator<number> {
  sourceSeries: number[];
  referenceSeries: number[];
  override result: boolean[];
  generator: Generator<boolean | undefined, boolean | undefined, CrossUpNext>;

  constructor(input: CrossUpInput) {
    super(input);

    this.sourceSeries = input.sourceSeries;
    this.referenceSeries = input.referenceSeries;

    var sourceValue: Array<number> = [];
    var referenceValue: Array<number> = [];

    const genFn = function* (): Generator<
      boolean | undefined,
      boolean | undefined,
      CrossUpNext
    > {
      let current = yield;
      let result = false;
      while (true) {
        sourceValue.unshift(current.sourceValue);
        referenceValue.unshift(current.referenceValue);

        result = current.sourceValue > current.referenceValue;

        let pointer = 1;
        while (
          result === true &&
          sourceValue[pointer]! >= referenceValue[pointer]!
        ) {
          if (sourceValue[pointer]! > referenceValue[pointer]!) {
            result = false;
          } else if (sourceValue[pointer]! < referenceValue[pointer]!) {
            result = true;
          } else if (sourceValue[pointer]! === referenceValue[pointer]!) {
            pointer += 1;
          }
        }

        if (result === true) {
          sourceValue = [current.sourceValue];
          referenceValue = [current.referenceValue];
        }

        current = yield result;
      }
    };

    this.generator = genFn();
    this.generator.next();

    this.result = [];
    this.sourceSeries.forEach((_value, index) => {
      var result = this.generator.next({
        sourceValue: this.sourceSeries[index]!,
        referenceValue: this.referenceSeries[index]!,
      });

      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  static calculate = crossUp;

  static override reverseInputs(input: CrossUpInput): void {
    if (input.reversedInput) {
      input.sourceSeries ? input.sourceSeries.reverse() : undefined;
      input.referenceSeries ? input.referenceSeries.reverse() : undefined;
    }
  }

  nextValue(next: CrossUpNext): boolean | undefined {
    return this.generator.next(next).value;
  }
}

export function crossUp(input: CrossUpInput): boolean[] {
  BaseIndicator.reverseInputs(input);
  var result = new CrossUp(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
