import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";
import { CandleList, CandleData } from "../StockData";

export class HeikinAshiInput extends BaseIndicatorInput {
  low?: number[];
  open?: number[];
  volume?: number[];
  high?: number[];
  close?: number[];
  timestamp?: number[];
}

export class HeikinAshi extends BaseIndicator {
  result: CandleList;
  generator: Generator<CandleData, CandleData, CandleData>;
  constructor(input: HeikinAshiInput) {
    super(input);
    var format = this.format;
    this.result = new CandleList();

    let lastOpen: number = null;
    let lastHigh = 0;
    let lastLow = Infinity;
    let lastClose = 0;
    let lastVolume = 0;
    let lastTimestamp = 0;

    this.generator = (function* (): Generator<
      CandleData,
      CandleData,
      CandleData
    > {
      let candleData = yield;
      let calculated = null;
      while (true) {
        if (lastOpen === null) {
          lastOpen = (candleData.close + candleData.open) / 2;
          lastHigh = candleData.high;
          lastLow = candleData.low;
          lastClose =
            (candleData.close +
              candleData.open +
              candleData.high +
              candleData.low) /
            4;
          lastVolume = candleData.volume || 0;
          lastTimestamp = candleData.timestamp || 0;
          calculated = <CandleData>{
            open: lastOpen,
            high: lastHigh,
            low: lastLow,
            close: lastClose,
            volume: candleData.volume || 0,
            timestamp: candleData.timestamp || 0,
          };
        } else {
          let newClose =
            (candleData.close +
              candleData.open +
              candleData.high +
              candleData.low) /
            4;
          let newOpen = (lastOpen + lastClose) / 2;
          let newHigh = Math.max(newOpen, newClose, candleData.high);
          let newLow = Math.min(candleData.low, newOpen, newClose);
          calculated = <any>{
            close: newClose,
            open: newOpen,
            high: newHigh,
            low: newLow,
            volume: candleData.volume || 0,
            timestamp: candleData.timestamp || 0,
          };
          lastClose = newClose;
          lastOpen = newOpen;
          lastHigh = newHigh;
          lastLow = newLow;
        }
        candleData = yield calculated;
      }
    })();

    this.generator.next();
    input.low.forEach((_tick, index) => {
      var result = this.generator.next({
        open: input.open[index]!,
        high: input.high[index]!,
        low: input.low[index]!,
        close: input.close[index]!,
        volume: input.volume[index]!,
        timestamp: input.timestamp[index]!,
      });
      if (result.value) {
        this.result.open.push(result.value.open);
        this.result.high.push(result.value.high);
        this.result.low.push(result.value.low);
        this.result.close.push(result.value.close);
        this.result.volume.push(result.value.volume);
        this.result.timestamp.push(result.value.timestamp);
      }
    });
  }

  static calculate = heikinashi;

  nextValue(price: CandleData): CandleData | undefined {
    var result = this.generator.next(price).value;
    return result;
  }
}

export function heikinashi(input: HeikinAshiInput): CandleList {
  BaseIndicator.reverseInputs(input);
  var result = new HeikinAshi(input).result;
  if (input.reversedInput) {
    result.open.reverse();
    result.high.reverse();
    result.low.reverse();
    result.close.reverse();
    result.volume.reverse();
    result.timestamp.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
