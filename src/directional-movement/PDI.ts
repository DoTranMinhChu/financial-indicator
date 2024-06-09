import { CandleData } from "../StockData";
import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";
import { WilderSmoothing } from "../moving-averages";
import { PDM, PDMNext } from "./PDM";
import { TrueRange } from "./TrueRange";

export class PDIInput extends BaseIndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
}

export class PDI extends BaseIndicator {
  result: number[];
  generator: Generator<number | undefined, number | undefined, CandleData>;
  constructor(input: PDIInput) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var period = input.period;
    var format = this.format;

    var plusDM = new PDM({
      high: [],
      low: [],
    });

    var emaPDM = new WilderSmoothing({
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

    var tr = new TrueRange({
      low: [],
      high: [],
      close: [],
    });

    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw "Inputs(low,high, close) not of equal size";
    }

    this.result = [];

    this.generator = (function* (): Generator<
      number | undefined,
      number | undefined,
      CandleData
    > {
      var tick = yield;
      var lastPDI;
      while (true) {
        const calcTr = tr.nextValue(tick);
        const calcPDM = plusDM.nextValue(tick as PDMNext);

        if (calcTr === undefined || calcPDM === undefined) {
          tick = yield;
          continue;
        }

        const lastATR = emaTR.nextValue(calcTr);
        const lastAPDM = emaPDM.nextValue(calcPDM);

        if (lastATR != undefined && lastAPDM != undefined) {
          lastPDI = (lastAPDM * 100) / lastATR;
        }

        tick = yield lastPDI;
      }
    })();

    this.generator.next();

    lows.forEach((_tick, index) => {
      var result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index],
      });
      if (result.value != undefined) {
        this.result.push(format(result.value));
      }
    });
  }

  static calculate = pdi;

  nextValue(price: CandleData): number | undefined {
    const result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}
export function pdi(input: PDIInput): number[] {
  BaseIndicator.reverseInputs(input);
  const result = new PDI(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
