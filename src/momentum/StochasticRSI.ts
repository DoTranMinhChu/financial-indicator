import { BaseIndicatorInput, BaseIndicator } from "../base-indicator";
import { EMA, SMA } from "../moving-averages";
import { RSI } from "../oscillators";
import FixedSizeLinkedList from "../utils/FixedSizeLinkedList";

export class StochasticRsiInput extends BaseIndicatorInput<number> {
  values!: number[];
  rsiPeriod!: number;
  stochasticPeriod!: number;
  kPeriod!: number;
  dPeriod!: number;
  typeMAOscillator: "SMA" | "EMA" = "EMA";
}

export class StochasticRSIOutput {
  stochasticRSI!: number;
  sk!: number;
  sd!: number;
}

export class StochasticRSI extends BaseIndicator<number> {
  override result: StochasticRSIOutput[];

  generator: Generator<
    StochasticRSIOutput | undefined,
    StochasticRSIOutput | undefined,
    number
  >;
  constructor(input: StochasticRsiInput) {
    super(input);
    let closes = input.values;
    let rsiPeriod = input.rsiPeriod;
    let stochasticPeriod = input.stochasticPeriod;
    let kPeriod = input.kPeriod;
    let dPeriod = input.dPeriod;
    const format = this.format;
    this.result = [];
    this.generator = (function* (): Generator<
      StochasticRSIOutput | undefined,
      StochasticRSIOutput | undefined,
      number
    > {
      let rsi = new RSI({ period: rsiPeriod, values: [] });
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
      let kSma = new oscillatorMAtype({
        period: kPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });
      let dSma = new oscillatorMAtype({
        period: dPeriod,
        values: [],
        format: (v) => {
          return v;
        },
      });

      let irsi, stochasticRSI, sk, sd, result;
      var tick = yield;
      while (true) {
        irsi = rsi.nextValue(tick);
        pastHighPeriods.push(irsi);
        pastLowPeriods.push(irsi);
        if (irsi !== undefined) {
          let llvRsi = pastLowPeriods.periodLow;
          let hhvRsi = pastHighPeriods.periodHigh;
          stochasticRSI =
            100 * ((irsi - llvRsi) / Math.max(hhvRsi - llvRsi, 0.00001));

          sk =
            stochasticRSI != undefined
              ? kSma.nextValue(stochasticRSI!)
              : undefined;
          sd = sk != undefined ? dSma.nextValue(sk!) : undefined;

          result = {
            sk: format(sk!),
            sd: format(sd!),
            stochasticRSI: format(stochasticRSI!),
          };
        }
        tick = yield result;
      }
    })();

    this.generator.next();

    closes.forEach((tick) => {
      var result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  static calculate = stochasticRsi;

  nextValue(input: number): StochasticRSIOutput | undefined {
    let nextResult = this.generator.next(input);
    return nextResult.value;
  }
}

export function stochasticRsi(
  input: StochasticRsiInput
): StochasticRSIOutput[] {
  BaseIndicator.reverseInputs(input);
  var result = new StochasticRSI(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  BaseIndicator.reverseInputs(input);
  return result;
}
