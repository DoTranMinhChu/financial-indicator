import { CandleData } from "../StockData";
import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";
import { WilderSmoothing, WEMA } from "../moving-averages";
import { MDM, MDMNext } from "./MDM";
import { PDM, PDMNext } from "./PDM";
import { TrueRange } from "./TrueRange";

export class ADXInput extends BaseIndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
}

export class ADXOutput extends BaseIndicatorInput {
  adx: number;
  pdi: number;
  mdi: number;
}

export class ADX extends BaseIndicator {
  result: ADXOutput[];
  generator: Generator<ADXOutput, never, CandleData>;
  constructor(input: ADXInput) {
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

    var minusDM = new MDM({
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
    var emaDX = new WEMA({
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
    ADXOutput;
    this.generator = (function* (): Generator<ADXOutput, never, CandleData> {
      var tick = yield;
      var index = 0;
      var lastATR, lastAPDM, lastAMDM, lastPDI, lastMDI, lastDX, smoothedDX;
      lastATR = 0;
      lastAPDM = 0;
      lastAMDM = 0;
      while (true) {
        let calcTr = tr.nextValue(tick);
        let calcPDM = plusDM.nextValue(tick as PDMNext);
        let calcMDM = minusDM.nextValue(tick as MDMNext);
        if (calcTr === undefined) {
          tick = yield;
          continue;
        }
        let lastATR = emaTR.nextValue(calcTr);
        let lastAPDM = emaPDM.nextValue(calcPDM);
        let lastAMDM = emaMDM.nextValue(calcMDM);
        if (
          lastATR != undefined &&
          lastAPDM != undefined &&
          lastAMDM != undefined
        ) {
          lastPDI = (lastAPDM * 100) / lastATR;
          lastMDI = (lastAMDM * 100) / lastATR;
          let diDiff = Math.abs(lastPDI - lastMDI);
          let diSum = lastPDI + lastMDI;
          lastDX = (diDiff / diSum) * 100;
          smoothedDX = emaDX.nextValue(lastDX);
          // console.log(tick.high.toFixed(2), tick.low.toFixed(2), tick.close.toFixed(2) , calcTr.toFixed(2), calcPDM.toFixed(2), calcMDM.toFixed(2), lastATR.toFixed(2), lastAPDM.toFixed(2), lastAMDM.toFixed(2), lastPDI.toFixed(2), lastMDI.toFixed(2), diDiff.toFixed(2), diSum.toFixed(2), lastDX.toFixed(2));
        }
        tick = yield { adx: smoothedDX, pdi: lastPDI, mdi: lastMDI };
      }
    })();

    this.generator.next();

    lows.forEach((tick, index) => {
      var result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index],
      });
      if (result.value != undefined && result.value.adx != undefined) {
        this.result.push({
          adx: format(result.value.adx),
          pdi: format(result.value.pdi),
          mdi: format(result.value.mdi),
        });
      }
    });
  }

  static calculate = adx;

  nextValue(price: CandleData): ADXOutput | undefined {
    let result = this.generator.next(price).value;
    if (result != undefined && result.adx != undefined) {
      return {
        adx: this.format(result.adx),
        pdi: this.format(result.pdi),
        mdi: this.format(result.mdi),
      };
    }
  }
}

export function adx(input: ADXInput): ADXOutput[] {
  BaseIndicator.reverseInputs(input);
  var result = new ADX(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
