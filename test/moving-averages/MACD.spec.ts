import assert from "assert";
import { data } from "../data";
import { MACD, MACDInput, MACDOutput } from "../../src";

const macdInput :MACDInput= {
  values: [
    68.8, 67.9, 67.8, 68, 68.4, 67.8, 67.3, 67.7, 67.7, 67.7, 67.6, 67, 67.3,
    66.7, 68.2, 67.9, 67, 67, 66.8, 66.6, 66.7, 64.9, 64, 64.2, 64.2, 64, 63.5,
    64, 64.7, 65, 65.4, 65.6, 65.8, 68, 67.9, 66.6, 66.5, 65.8, 66.5, 67, 67.2,
    67, 66.4, 66.2, 65.8, 67, 66, 66.1, 66.8, 66.3, 65.7, 65.4, 66.1, 66, 68.5,
    67.2, 67.8, 67.2, 66.5, 67, 66.9, 66.2,
  ],
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  typeMAOscillator: "SMA",
  typeMASignal: "SMA",
};
const expectedOutput = [
  {
    MACD: -0.934,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.122,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.297,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.369,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.421,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.422,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.421,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.438,
    histogram: undefined,
    signal: undefined,
  },
  {
    MACD: -1.191,
    histogram: 0.09936,
    signal: -1.29,
  },
  {
    MACD: -0.8737,
    histogram: 0.41,
    signal: -1.284,
  },
  {
    MACD: -0.6314,
    histogram: 0.5978,
    signal: -1.229,
  },
  {
    MACD: -0.3974,
    histogram: 0.7318,
    signal: -1.129,
  },
  {
    MACD: -0.2013,
    histogram: 0.7982,
    signal: -0.9995,
  },
  {
    MACD: 0.07949,
    histogram: 0.9123,
    signal: -0.8328,
  },
  {
    MACD: 0.3179,
    histogram: 0.9575,
    signal: -0.6395,
  },
  {
    MACD: 0.5647,
    histogram: 0.9837,
    signal: -0.4189,
  },
  {
    MACD: 0.766,
    histogram: 0.9401,
    signal: -0.1741,
  },
  {
    MACD: 0.8724,
    histogram: 0.8172,
    signal: 0.0552,
  },
  {
    MACD: 0.9532,
    histogram: 0.695,
    signal: 0.2582,
  },
  {
    MACD: 0.9917,
    histogram: 0.5531,
    signal: 0.4385,
  },
  {
    MACD: 0.8929,
    histogram: 0.311,
    signal: 0.5819,
  },
  {
    MACD: 0.7615,
    histogram: 0.07265,
    signal: 0.6889,
  },
  {
    MACD: 0.6737,
    histogram: -0.0812,
    signal: 0.7549,
  },
  {
    MACD: 0.591,
    histogram: -0.1942,
    signal: 0.7853,
  },
  {
    MACD: 0.5519,
    histogram: -0.2319,
    signal: 0.7838,
  },
  {
    MACD: 0.4276,
    histogram: -0.3187,
    signal: 0.7462,
  },
  {
    MACD: 0.2404,
    histogram: -0.4356,
    signal: 0.676,
  },
  {
    MACD: 0.04872,
    histogram: -0.5268,
    signal: 0.5755,
  },
  {
    MACD: -0.1115,
    histogram: -0.5645,
    signal: 0.4529,
  },
  {
    MACD: -0.08269,
    histogram: -0.4272,
    signal: 0.3445,
  },
  {
    MACD: -0.08397,
    histogram: -0.3345,
    signal: 0.2506,
  },
  {
    MACD: -0.009615,
    histogram: -0.1843,
    signal: 0.1746,
  },
  {
    MACD: -0.05449,
    histogram: -0.1574,
    signal: 0.1029,
  },
  {
    MACD: -0.03974,
    histogram: -0.07692,
    signal: 0.03718,
  },
  {
    MACD: 0.07372,
    histogram: 0.07585,
    signal: -0.002137,
  },
  {
    MACD: 0.1205,
    histogram: 0.136,
    signal: -0.01546,
  },
  {
    MACD: 0.1276,
    histogram: 0.1343,
    signal: -0.006695,
  },
];

describe("MACD (Moving Average Convergence Divergence)", function () {
  let input: MACDInput;
  beforeEach(function () {
    input = JSON.parse(JSON.stringify(macdInput));
  });

  it("should calculate MACD using the calculate method", function () {
    assert.deepEqual(MACD.calculate(input), expectedOutput, "Wrong Results");
  });

  it("should be able to get MACD from the get results", function () {
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
