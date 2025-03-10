import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";

export class MDMInput extends BaseIndicatorInput<number>  {
  low: number[] = [];
  high: number[] = [];
}

export class MDMNext {
  high!: number;
  low!: number;
}
export class MDM extends BaseIndicator<number>  {
  override result: number[];
  generator: Generator<number | undefined, number | undefined, MDMNext>;
  constructor(input: MDMInput) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var format = this.format;

    if (lows.length != highs.length) {
      throw "Inputs(low,high) not of equal size";
    }
    this.result = [];
    this.generator = (function* () {
      var minusDm;
      var current = yield;
      var last;
      while (true) {
        if (last) {
          let upMove = current.high - last.high;
          let downMove = last.low - current.low;
          minusDm = format(downMove > upMove && downMove > 0 ? downMove : 0);
        }
        last = current;
        current = yield minusDm;
      }
    })();

    this.generator.next();

    lows.forEach((_tick, index) => {
      var result = this.generator.next({
        high: highs[index]!,
        low: lows[index]!,
      });
      if (result.value !== undefined) this.result.push(result.value);
    });
  }

  static calculate(input: MDMInput): number[] {
    BaseIndicator.reverseInputs(input);
    var result = new MDM(input).result;
    if (input.reversedInput) {
      result.reverse();
    }
    BaseIndicator.reverseInputs(input);
    return result;
  }

  nextValue(price: MDMNext): number | undefined {
    return this.generator.next(price).value;
  }
}
