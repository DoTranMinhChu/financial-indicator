import { SMA } from "./SMA";
import { EMA } from "./EMA";
import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";

export class MACDInput extends BaseIndicatorInput {
  typeMAOscillator: "SMA" | "EMA" = "EMA";
  typeMASignal: "SMA" | "EMA" = "EMA";
  fastPeriod!: number;
  slowPeriod!: number;
  signalPeriod!: number;
  constructor(public values: number[]) {
    super();
  }
}

export class MACDOutput {
  MACD?: number | undefined;
  signal?: number | undefined;
  histogram?: number | undefined;
}

export class MACD extends BaseIndicator {
  override result: MACDOutput[];
  generator: Generator<MACDOutput | undefined, MACDOutput | undefined, number>;
  constructor(input: MACDInput) {
    super(input);
    const oscillatorMAtype = input.typeMAOscillator == "SMA" ? SMA : EMA;
    const signalMAtype = input.typeMASignal == "SMA" ? SMA : EMA;
    const fastMAProducer = new oscillatorMAtype({
      period: input.fastPeriod,
      values: [],
      format: (v) => {
        return v;
      },
    });
    const slowMAProducer = new oscillatorMAtype({
      period: input.slowPeriod,
      values: [],
      format: (v) => {
        return v;
      },
    });
    const signalMAProducer = new signalMAtype({
      period: input.signalPeriod,
      values: [],
      format: (v) => {
        return v;
      },
    });
    const format = this.format;
    this.result = [];

    this.generator = (function* (): Generator<
      MACDOutput | undefined,
      MACDOutput | undefined,
      number
    > {
      let index = 0;
      let tick;
      let MACD: number | undefined,
        signal: number | undefined,
        histogram: number | undefined,
        fast: number | undefined,
        slow: number | undefined;
      while (true) {
        if (index < input.slowPeriod) {
          tick = yield;
          fast = fastMAProducer.nextValue(tick);
          slow = slowMAProducer.nextValue(tick);
          index++;
          continue;
        }
        if (fast && slow) {
          //Just for typescript to be happy
          MACD = fast - slow;
          signal = signalMAProducer.nextValue(MACD);
        }
        if (MACD && signal) histogram = MACD - signal;
        tick = yield {
          MACD: MACD ? format(MACD) : undefined,
          signal: signal ? format(signal) : undefined,
          histogram: histogram
            ? isNaN(histogram)
              ? undefined
              : format(histogram)
            : undefined,
        };
        fast = fastMAProducer.nextValue(tick);
        slow = slowMAProducer.nextValue(tick);
      }
    })();

    this.generator.next();

    input.values.forEach((tick) => {
      const result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }

  static calculate = macd;

  nextValue(price: number): MACDOutput | undefined {
    const result = this.generator.next(price).value;
    return result;
  }
}

export function macd(input: MACDInput): MACDOutput[] {
  BaseIndicator.reverseInputs(input);
  const result = new MACD(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
