import { CandleData } from "../StockData";
import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";
import { WEMA } from "../moving-averages";
import { MDI } from "./MDI";
import { PDI } from "./PDI";
import { TrueRange } from "./TrueRange";

export class ADXInput extends BaseIndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  adxPeriod: number;
  diPeriod: number;
}

export class ADX extends BaseIndicator {
  result: number[];
  generator: Generator<number | undefined, number | undefined, CandleData>;
  constructor(input: ADXInput) {
    super(input);
    const lows = input.low;
    const highs = input.high;
    const closes = input.close;
    const adxPeriod = input.adxPeriod;
    const diPeriod = input.diPeriod;
    const format = this.format;
    const plusDI = new PDI({
      period: diPeriod,
      close: [],
      high: [],
      low: [],
    });
    const minusDI = new MDI({
      period: diPeriod,
      close: [],
      high: [],
      low: [],
    });

    const emaDX = new WEMA({
      period: adxPeriod,
      values: [],
    });

    const tr = new TrueRange({
      low: [],
      high: [],
      close: [],
    });

    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw "Inputs (low, high, close) not of equal size";
    }

    this.result = [];

    this.generator = (function* (): Generator<
      number | undefined,
      number | undefined,
      CandleData
    > {
      let tick = yield;

      while (true) {
        let calcTr = tr.nextValue(tick);
        let calcPDI = plusDI.nextValue(tick);
        let calcMDI = minusDI.nextValue(tick);
        if (calcTr === undefined) {
          tick = yield;
          continue;
        }

        if (calcPDI !== undefined && calcMDI !== undefined) {
          const diDiff = Math.abs(calcPDI - calcMDI);
          const diSum = Math.abs(calcPDI + calcMDI);
          const lastDX = (diDiff / diSum) * 100;

          const smoothedDX = emaDX.nextValue(lastDX);
          if (lastDX !== undefined) {
            const adx = lastDX;
            tick = yield adx;
          } else {
            tick = yield;
          }
        } else {
          tick = yield;
        }
      }
    })();

    this.generator.next();

    lows.forEach((tick, index) => {
      const result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index],
      });

      if (result.value !== undefined) {
        this.result.push(format(result.value));
      }
    });
  }

  static calculate = adx;

  nextValue(price: CandleData): number | undefined {
    const result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}

export function adx(input: ADXInput): number[] {
  BaseIndicator.reverseInputs(input);
  const result = new ADX(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
