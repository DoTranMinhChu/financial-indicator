import { CandleData } from "../StockData";
import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";
import { WEMA } from "../moving-averages";
import { TrueRange } from "./TrueRange";

export class ATRInput extends BaseIndicatorInput {
  low: number[] = [];
  high: number[] = [];
  close: number[] = [];
  period!: number;
}

export class ATR extends BaseIndicator {
  override result: number[];
  generator: Generator<number | undefined, number | undefined, CandleData>;
  constructor(input: ATRInput) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var period = input.period;
    var format = this.format;

    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw "Inputs(low,high, close) not of equal size";
    }

    var trueRange = new TrueRange({
      low: [],
      high: [],
      close: [],
    });

    var wema = new WEMA({
      period: period,
      values: [],
      format: (v) => {
        return v;
      },
    });

    this.result = [];

    this.generator = (function* (): Generator<
      number | undefined,
      number | undefined,
      CandleData
    > {
      let tick = yield;
      var avgTrueRange, trange;
      while (true) {
        trange = trueRange.nextValue({
          low: tick.low!,
          high: tick.high!,
          close: tick.close!,
        });
        if (trange === undefined) {
          avgTrueRange = undefined;
        } else {
          avgTrueRange = wema.nextValue(trange);
        }
        tick = yield avgTrueRange;
      }
    })();

    this.generator.next();

    lows.forEach((_tick, index) => {
      var result = this.generator.next({
        high: highs[index]!,
        low: lows[index]!,
        close: closes[index]!,
      });
      if (result.value !== undefined) {
        this.result.push(format(result.value));
      }
    });
  }

  static calculate = atr;

  nextValue(price: CandleData): number | undefined {
    return this.generator.next(price).value;
  }
}

export function atr(input: ATRInput): number[] {
  BaseIndicator.reverseInputs(input);
  var result = new ATR(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
