import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";
import { PDI } from "../directional-movement";
import { EMA, SMA } from "../moving-averages";
import { CCI, RSI } from "../oscillators";
import { CandleData } from "../StockData";
import FixedSizeLinkedList from "../utils/FixedSizeLinkedList";

export class MAXInput extends BaseIndicatorInput<number> {
  high: number[] = [];
  low: number[] = [];
  close: number[] = [];
  maxPeriod!: number; // 14
  stochasticPeriod!: number; //21
  maOscillatorPeriod!: number; //30F
  typeMAOscillator: "SMA" | "EMA" = "EMA";
}

export class MAXOutput {
  stochasticRSI!: number;
  sk!: number;
  sd!: number;
}

export class MAX extends BaseIndicator<number> {
  override result: MAXOutput[];

  generator: Generator<
    MAXOutput | undefined,
    MAXOutput | undefined,
    CandleData
  >;
  constructor(input: MAXInput) {
    super(input);
    const lows = input.low;
    const highs = input.high;
    const closes = input.close;
    const maxPeriod = input.maxPeriod;
    const stochasticPeriod = input.stochasticPeriod;
    const maOscillatorPeriod = input.maOscillatorPeriod;
    const format = this.format;
    this.result = [];
    this.generator = (function* (): Generator<
      MAXOutput | undefined,
      MAXOutput | undefined,
      CandleData
    > {
      let pastHighPeriods = new FixedSizeLinkedList(
        stochasticPeriod,
        true,
        false
      );
      let pastLowPeriods = new FixedSizeLinkedList(
        stochasticPeriod,
        false,
        true
      );
      const oscillatorMAtype = input.typeMAOscillator == "SMA" ? SMA : EMA;
      let aMA = new oscillatorMAtype({
        period: maxPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });
      let mMA = new oscillatorMAtype({
        period: maxPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });
      let dMA = new oscillatorMAtype({
        period: maxPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });
      let maxMa = new oscillatorMAtype({
        period: 3,
        values: [],
        format: (v) => {
          return v;
        },
      });
      let hhMaxMa = new oscillatorMAtype({
        period: maOscillatorPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });
      let llMaxMa = new oscillatorMAtype({
        period: maOscillatorPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });
      const cci = new CCI({
        high: [],
        low: [],
        close: [],
        period: maxPeriod,
        format: (v) => {
          return v;
        },
      });
      const pdi = new PDI({
        high: [],
        low: [],
        close: [],
        period: maxPeriod,
        format: (v: any) => {
          return v;
        },
      });
      let result: any, preTick, value, currentTick;

      while (true) {
        currentTick = yield result;
        const diff = preTick ? currentTick.close - preTick.close : 0;
        const ratio = preTick ? currentTick.close / preTick.close : 0;
        const A = aMA.nextValue(diff > 0 ? ratio - 1 : 0);
        const M = mMA.nextValue(diff == 0 ? 1 / maxPeriod : 0);
        const D = dMA.nextValue(diff < 0 ? 1 / ratio - 1 : 0);
        const ASI =
          D + M / 2 == 0 ? 100 : 100 - 100 / (1 + (A + M / 2) / (D + M / 2));
        const pdiValue = pdi.nextValue({
          close: currentTick.close,
          low: currentTick.low,
          high: currentTick.high,
        });
        const ccia = cci.nextValue({
          close: ASI + pdiValue,
          low: ASI + pdiValue,
          high: ASI + pdiValue,
        });
        value = maxMa.nextValue(ccia) / 3;

        const mid = 0;
        pastHighPeriods.push(value);
        pastLowPeriods.push(value);

        const hhMAX = hhMaxMa.nextValue(pastHighPeriods.periodHigh);
        const llMAX = llMaxMa.nextValue(pastLowPeriods.periodLow);
        const top = (2 * mid - llMAX + hhMAX) / 2;
        const bot = 2 * mid - top;
        result = {
          value,
          mid,
          top,
          bot,
        };
        preTick = currentTick;
      }
    })();

    this.generator.next();
    closes.forEach((_tick, index) => {
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

  static calculate = max;

  nextValue(input: CandleData): MAXOutput | undefined {
    let nextResult = this.generator.next(input);
    return nextResult.value;
  }
}

export function max(input: MAXInput): MAXOutput[] {
  BaseIndicator.reverseInputs(input);
  var result = new MAX(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
