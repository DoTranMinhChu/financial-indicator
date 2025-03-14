import { BaseIndicator, BaseIndicatorInput } from "../base-indicator";
import { DynamicIndicatorAbstract } from "../base-indicator/dynamic-indicator.abstract";
import { LinkedList } from "../utils/LinkedList";

// Input cho chỉ báo SMA
export class SMAInput extends BaseIndicatorInput<number> {
  constructor(public period: number, public values: number[]) {
    super();
  }
}

// SMA trả về kết quả dạng number (trung bình đơn giản)
export class SMA extends DynamicIndicatorAbstract<number, number> {
  period: number;

  constructor(input: SMAInput) {
    super(input);
    this.period = input.period;
  }

  // Tạo mới generator cho tính SMA
  protected createGenerator(): Generator<
    number | undefined,
    number | undefined,
    number
  > {
    const period = this.period;

    return (function* (): Generator<
      number | undefined,
      number | undefined,
      number
    > {
      const list = new LinkedList();
      let sum = 0;
      let counter = 1;
      let current: number = yield;
      let result;
      list.push(0);
      while (true) {
        if (counter < period) {
          counter++;
          list.push(current);
          current ? (sum = sum + current) : undefined;
        } else {
          current ? (sum = sum - list.shift() + current) : undefined;
          result = sum / period;
          list.push(current);
        }
        current = yield result;
      }
    })();
  }

  public nextValue(price: number): number | undefined {
    const result = this.generator.next(price).value;
    this.values.push(price);
    if (result != undefined) return this.format(result);
    return undefined;
  }

  static calculate(input: SMAInput): number[] {
    BaseIndicator.reverseInputs(input);
    const smaInstance = new SMA(input);
    const result = smaInstance.result;
    if (input.reversedInput) {
      result.reverse();
    }
    BaseIndicator.reverseInputs(input);
    return result;
  }
}
