import assert from "assert";
import { PDI } from "../../dist";
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
});
