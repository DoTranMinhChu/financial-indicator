import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";

export class PDMInput extends BaseIndicatorInput<number> {
  low: number[] = [];
  high: number[] = [];
}
export class PDMNext {
  high!: number;
  low!: number;
}
export class PDM extends BaseIndicator<number>  {
  override result: number[];
  generator: Generator<number | undefined, number | undefined, PDMNext>;
  constructor(input: PDMInput) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var format = this.format;

    if (lows.length != highs.length) {
      throw "Inputs(low,high) not of equal size";
    }

    this.result = [];

    this.generator = (function* () {
      var plusDm;
      var current = yield;
      var last;
      while (true) {
        if (last) {
          let upMove = current.high - last.high;
          let downMove = last.low - current.low;
          plusDm = format(upMove > downMove && upMove > 0 ? upMove : 0);
        }
        last = current;
        current = yield plusDm;
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

  static calculate(input: PDMInput): number[] {
    BaseIndicator.reverseInputs(input);
    var result = new PDM(input).result;
    if (input.reversedInput) {
      result.reverse();
    }
    BaseIndicator.reverseInputs(input);
    return result;
  }

  nextValue(price: PDMNext): number | undefined {
    return this.generator.next(price).value;
  }
}
