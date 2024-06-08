import { CandleData } from "../StockData";
import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";
import { WilderSmoothing, WEMA } from "../moving-averages";
import { MDM, MDMNext } from "./MDM";
import { TrueRange } from "./TrueRange";

export class MDIInput extends BaseIndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
}

export class MDI extends BaseIndicator {
  result: number[];
  generator: Generator<number, never, CandleData>;
  constructor(input: MDIInput) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var period = input.period;
    var format = this.format;

    var minusDM = new MDM({
      high: [],
      low: [],
    });

    var emaMDM = new WilderSmoothing({
      period: period,
      values: [],
      format: (v) => {
        return v;
      },
    });
    var emaTR = new WilderSmoothing({
      period: period,
      values: [],
      format: (v) => {
        return v;
      },
    });
    var emMDI = new WEMA({
      period: period,
      values: [],
      format: (v) => {
        return v;
      },
    });

    var tr = new TrueRange({
      low: [],
      high: [],
      close: [],
    });

    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw "Inputs(low,high, close) not of equal size";
    }

    this.result = [];

    this.generator = (function* (): Generator<number, never, CandleData> {
      let tick = yield;
      let lastMDI;

      while (true) {
        let calcTr = tr.nextValue(tick);
        let calcMDM = minusDM.nextValue(tick as MDMNext);
        if (calcTr === undefined) {
          tick = yield;
          continue;
        }
        let lastATR = emaTR.nextValue(calcTr);
        let lastAMDM = emaMDM.nextValue(calcMDM);
        if (lastATR != undefined && lastAMDM != undefined) {
          lastMDI = (lastAMDM * 100) / lastATR;
        }
        tick = yield lastMDI;
      }
    })();

    this.generator.next();

    lows.forEach((tick, index) => {
      const result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index],
      });
      if (result.value != undefined) {
        this.result.push(format(result.value));
      }
    });
  }

  static calculate = mdi;

  nextValue(price: CandleData): number | undefined {
    const result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}

export function mdi(input: MDIInput): number[] {
  BaseIndicator.reverseInputs(input);
  var result = new MDI(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
