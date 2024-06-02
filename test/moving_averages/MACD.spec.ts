import assert from "assert";
import { data } from "../data";
import { MACD, MACDOutput } from "../../dist";

const macdInput = {
  values: data.close,
  fastPeriod: 5,
  slowPeriod: 8,
  signalPeriod: 3,
  SimpleMAOscillator: false,
  SimpleMASignal: false,
};

const expectedOutput = [
  {
    MACD: 1.507,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: 0.8633,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: 1.807,
    histogram: 0.414,
    signal: 1.393,
  },
  {
    MACD: 3.624,
    histogram: 1.115,
    signal: 2.508,
  },
  {
    MACD: 6.13,
    histogram: 1.811,
    signal: 4.319,
  },
  {
    MACD: 9.354,
    histogram: 2.517,
    signal: 6.837,
  },
  {
    MACD: 12.73,
    histogram: 2.945,
    signal: 9.782,
  },
  {
    MACD: 15.9,
    histogram: 3.06,
    signal: 12.84,
  },
  {
    MACD: 16.4,
    histogram: 1.781,
    signal: 14.62,
  },
  {
    MACD: 20.22,
    histogram: 2.797,
    signal: 17.42,
  },
  {
    MACD: 20.01,
    histogram: 1.296,
    signal: 18.72,
  },
];

describe("MACD (Moving Average Convergence Divergence)", function () {
  let input: {
    values: number[];
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
    SimpleMAOscillator: boolean;
    SimpleMASignal: boolean;
  };
  beforeEach(function () {
    input = JSON.parse(JSON.stringify(macdInput));
  });

  it("should calculate MACD using the calculate method", function () {
    assert.deepEqual(MACD.calculate(input), expectedOutput, "Wrong Results");
  });

  it("should be able to get EMA from the get results", function () {
    const macd = new MACD(input);
    assert.deepEqual(macd.getResult(), expectedOutput, "Wrong Results");
  });

  it("should be able to get MACD for the next bar using nextValue", function () {
    input.values = [];
    const macd = new MACD(input);
    const results: Array<MACDOutput> = [];
    macdInput.values.forEach((price) => {
      const result = macd.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(results, expectedOutput, "Wrong Results");
  });
});
