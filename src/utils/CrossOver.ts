import { CrossUp } from "./CrossUp";
import { CrossDown } from "./CrossDown";
import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";

export class CrossOverInput extends BaseIndicatorInput<number> {
  constructor(public sourceSeries: number[], public referenceSeries: number[]) {
    super();
  }
}
export class CrossOverNext {
  sourceValue!: number;
  referenceValue!: number;
}
export class CrossOver extends BaseIndicator<number> {
  generator: Generator<boolean | undefined, boolean | undefined, CrossOverNext>;
  override result: boolean[];

  constructor(input: CrossOverInput) {
    super(input);

    const crossUp = new CrossUp({
      sourceSeries: input.sourceSeries,
      referenceSeries: input.referenceSeries,
    });
    const crossDown = new CrossDown({
      sourceSeries: input.sourceSeries,
      referenceSeries: input.referenceSeries,
    });

    const genFn = function* (): Generator<
      boolean | undefined,
      boolean | undefined,
      CrossOverNext
    > {
      let current = yield;
      let result: boolean | undefined = false;
      let first: boolean | undefined = true;

      while (true) {
        const nextUp = crossUp.nextValue({
          sourceValue: current.sourceValue,
          referenceValue: current.referenceValue,
        });
        const nextDown = crossDown.nextValue({
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

    const resultA = crossUp.getResult();
    const resultB = crossDown.getResult();

    this.result = resultA.map((a: any, index: number) => {
      if (index === 0) return false;
      return !!(a || resultB[index]);
    });
  }

  static calculate = crossOver;

  static override reverseInputs(input: CrossOverInput): void {
    if (input.reversedInput) {
      input.sourceSeries ? input.sourceSeries.reverse() : undefined;
      input.referenceSeries ? input.referenceSeries.reverse() : undefined;
    }
  }

  nextValue(next: CrossOverNext): boolean | undefined {
    return this.generator.next(next).value;
  }
}

export function crossOver(input: CrossOverInput): boolean[] {
  BaseIndicator.reverseInputs(input);
  const result = new CrossOver(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
