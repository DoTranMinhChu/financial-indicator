import assert from "assert";
import { data } from "../data";
import { MACD, MACDOutput } from "../../src";

const macdInput = {
  values: data.close,
  fastPeriod: 5,
  slowPeriod: 8,
  signalPeriod: 3,
  simpleMAOscillator: false,
  simpleMASignal: false,
};
const expectedOutput = [
  { value: undefined, timestamp: 1028173500 },
  { value: undefined, timestamp: 1030938300 },
  { value: undefined, timestamp: 1033443900 },
  { value: undefined, timestamp: 1036122300 },
  { value: undefined, timestamp: 1038800700 },
  { value: undefined, timestamp: 1041392700 },
  { value: undefined, timestamp: 1044243900 },
  {
    value: {
      MACD: 1.507,
      histogram: undefined,
      signal: undefined,
    },
    timestamp: 1046663100,
  },
  {
    value: {
      MACD: 0.8633,
      histogram: undefined,
      signal: undefined,
    },
    timestamp: 1049168700,
  },
  {
    value: {
      MACD: 1.807,
      histogram: 0.414,
      signal: 1.393,
    },
    timestamp: 1051760700,
  },
  {
    value: {
      MACD: 3.624,
      histogram: 1.115,
      signal: 2.508,
    },
    timestamp: 1054525500,
  },
  {
    value: {
      MACD: 6.13,
      histogram: 1.811,
      signal: 4.319,
    },
    timestamp: 1057031100,
  },
  {
    value: {
      MACD: 9.354,
      histogram: 2.517,
      signal: 6.837,
    },
    timestamp: 1059709500,
  },
  {
    value: {
      MACD: 12.73,
      histogram: 2.945,
      signal: 9.782,
    },
    timestamp: 1062387900,
  },
  {
    value: {
      MACD: 15.9,
      histogram: 3.06,
      signal: 12.84,
    },
    timestamp: 1064979900,
  },
  {
    value: {
      MACD: 16.4,
      histogram: 1.781,
      signal: 14.62,
    },
    timestamp: 1067831100,
  },
  {
    value: {
      MACD: 20.22,
      histogram: 2.797,
      signal: 17.42,
    },
    timestamp: 1070250300,
  },
  {
    value: {
      MACD: 20.01,
      histogram: 1.296,
      signal: 18.72,
    },
    timestamp: 1072928700,
  },
];
const expectedMACDOutput = expectedOutput
  .map((item) => item.value)
  .filter((value) => value != undefined);

describe("MACD (Moving Average Convergence Divergence)", function () {
  let input: {
    values: number[];
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
    simpleMAOscillator: boolean;
    simpleMASignal: boolean;
  };
  beforeEach(function () {
    input = JSON.parse(JSON.stringify(macdInput));
  });

  it("should calculate MACD using the calculate method", function () {
    assert.deepEqual(
      MACD.calculate(input),
      expectedMACDOutput,
      "Wrong Results"
    );
  });

  it("should be able to get MACD from the get results", function () {
    const macd = new MACD(input);
    assert.deepEqual(macd.getResult(), expectedMACDOutput, "Wrong Results");
  });

  it("should be able to get MACD for the next bar using nextValue", function () {
    input.values = [];
    const macd = new MACD(input);
    const results: Array<MACDOutput> = [];
    macdInput.values.forEach((price) => {
      const result = macd.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(results, expectedMACDOutput, "Wrong Results");
  });
});
