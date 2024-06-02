import { NumberFormat } from "../utils/NumberFormatter";

export class BaseIndicatorInput {
  reversedInput?: boolean;
  format?: (data: number) => any;
}

export interface IAllInputs {
  values?: number[];
  open?: number[];
  high?: number[];
  low?: number[];
  close?: number[];
  volume?: number[];
  timestamp?: number[];
}

export class BaseIndicator {
  result: any;
  format: (data: number) => number;
  constructor(input: BaseIndicatorInput) {
    this.format = input.format || NumberFormat;
  }
  static reverseInputs(input: any): void {
    if (input.reversedInput) {
      input.values ? input.values.reverse() : undefined;
      input.open ? input.open.reverse() : undefined;
      input.high ? input.high.reverse() : undefined;
      input.low ? input.low.reverse() : undefined;
      input.close ? input.close.reverse() : undefined;
      input.volume ? input.volume.reverse() : undefined;
      input.timestamp ? input.timestamp.reverse() : undefined;
    }
  }

  getResult() {
    return this.result;
  }
}
