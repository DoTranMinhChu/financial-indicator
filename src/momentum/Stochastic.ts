import { CandleData } from "../StockData";
import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";
import { EMA } from "../moving-averages";
import FixedSizeLinkedList from "../utils/FixedSizeLinkedList";

export class StochasticInput extends BaseIndicatorInput {
  period!: number;
  low!: number[];
  high!: number[];
  close!: number[];
  signalPeriod!: number;
}

export class StochasticOutput {
  k!: number | undefined;
  d!: number | undefined;
}

export class Stochastic extends BaseIndicator {
  override result: StochasticOutput[];
  generator: Generator<
    StochasticOutput | undefined,
    StochasticOutput | undefined,
    CandleData
  >;
  constructor(input: StochasticInput) {
    super(input);
    let lows = input.low;
    let highs = input.high;
    let closes = input.close;
    let period = input.period;
    let signalPeriod = input.signalPeriod;
    let format = this.format;
    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw "Inputs(low,high, close) not of equal size";
    }
    this.result = [];

    this.generator = (function* (): Generator<
      StochasticOutput | undefined,
      StochasticOutput | undefined,
      any
    > {
      let index = 1;
      let pastHighPeriods = new FixedSizeLinkedList(period, true, false);
      let pastLowPeriods = new FixedSizeLinkedList(period, false, true);
      let dEma = new EMA({
        period: signalPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });
      let k, d;
      let tick = yield;
      while (true) {
        pastHighPeriods.push(tick.high);
        pastLowPeriods.push(tick.low);
        if (index < period) {
          index++;
          tick = yield;
          continue;
        }
        let periodLow = pastLowPeriods.periodLow;
        k =
          ((tick.close - periodLow) /
            Math.max(pastHighPeriods.periodHigh - periodLow, 0.00001)) *
          100;
        k = isNaN(k) ? 0 : k; //This happens when the close, high and low are same for the entire period; Bug fix for
        d = dEma.nextValue(k);
        tick = yield {
          k: format(k),
          d: d !== undefined ? format(d) : undefined,
        };
      }
    })();

    this.generator.next();

    lows.forEach((_tick, index) => {
      let result = this.generator.next({
        high: highs[index]!,
        low: lows[index]!,
        close: closes[index]!,
      });
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  static calculate = stochastic;

  nextValue(input: CandleData): StochasticOutput | undefined {
    const nextResult = this.generator.next(input);
    return nextResult.value;
  }
}

export function stochastic(input: StochasticInput): StochasticOutput[] {
  BaseIndicator.reverseInputs(input);
  const result = new Stochastic(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
