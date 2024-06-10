import assert from "assert";
import { PDI } from "../../src";
import { data } from "../data";

const period = 9;
const expectedOutput = [
  14.84, 23.49, 27.97, 38.57, 47.31, 44.86, 41.49, 43.46, 41.6,
];

describe("PDI (Exponential Moving Average)", function () {
  it("should calculate PDI using the calculate method", function () {
    const pdiResult = PDI.calculate({
      period: period,
      close: data.close,
      low: data.low,
      high: data.high,
    });
    assert.deepEqual(pdiResult, expectedOutput, "Wrong Results");
  });

  it("should be able to get PDI for the next bar", function () {
    const pdi = new PDI({
      period: period,
      close: data.close,
      low: data.low,
      high: data.high,
    });
    assert.deepEqual(
      pdi.getResult(),
      expectedOutput,
      "Wrong pdiResult while getting results"
    );
  });
  it("should be able to get PDI for the next bar using nextValue", function () {
    const pdiProducer = new PDI({
      period: period,
      close: [],
      high: [],
      low: [],
    });
    const results: number[] = [];
    data.candlesticks.forEach((price) => {
      const result = pdiProducer.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectedOutput,
      "Wrong Results while getting results"
    );
  });
});
