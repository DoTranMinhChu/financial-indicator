import { CandleData } from "../StockData";
import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";

export class TrueRangeInput extends BaseIndicatorInput {
  low: number[] = [];
  high: number[] = [];
  close: number[] = [];
}

export class TrueRange extends BaseIndicator {
  override result: number[];
  generator: Generator<number | undefined, number | undefined, CandleData>;
  constructor(input: TrueRangeInput) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var format = this.format;

    if (lows.length != highs.length) {
      throw "Inputs(low,high) not of equal size";
    }

    this.result = [];

    this.generator = (function* (): Generator<
      number | undefined,
      number | undefined,
      CandleData
    > {
      var current: CandleData = yield;
      let previousClose, result;
      while (true) {
        if (previousClose === undefined) {
          previousClose = current.close;
          current = yield result;
        }
        current
          ? (result = Math.max(
              current.high! - current.low!,
              isNaN(Math.abs(current.high! - previousClose!))
                ? 0
                : Math.abs(current.high! - previousClose!),
              isNaN(Math.abs(current.low! - previousClose!))
                ? 0
                : Math.abs(current.low! - previousClose!)
            ))
          : undefined;
        previousClose = current.close;
        if (result != undefined) {
          result = format(result);
        }
        current = yield result;
      }
    })();

    this.generator.next();

    lows.forEach((_tick, index) => {
      var result = this.generator.next({
        high: highs[index]!,
        low: lows[index]!,
        close: closes[index]!,
      });
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }

  static calculate = trueRange;

  nextValue(price: CandleData): number | undefined {
    return this.generator.next(price).value;
  }
}

export function trueRange(input: TrueRangeInput): number[] {
  BaseIndicator.reverseInputs(input);
  var result = new TrueRange(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
