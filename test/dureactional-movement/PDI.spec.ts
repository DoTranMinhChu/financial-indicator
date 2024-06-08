import assert from "assert";
import { PDI } from "../../src";
import { data } from "../data";

const period = 9;
const expectedOutput = [
  14.84, 23.49, 27.97, 38.57, 47.31, 44.86, 41.49, 43.46, 41.6,
];

describe("PDI (Exponential Moving Average)", function () {
  it("should calculate PDI using the calculate method", function () {
    const res = PDI.calculate({
      period: period,
      close: data.close,
      low: data.low,
      high: data.high,
    });
    assert.deepEqual(res, expectedOutput, "Wrong Results");
  });
});
