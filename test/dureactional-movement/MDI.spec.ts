import assert from "assert";
import { MDI } from "../../dist";
import { data } from "../data";

const period = 9;
const expectedOutput = [
  22.35, 21.65, 21.55, 19.06, 15.88, 15.06, 14.73, 12.38, 12.09,
];

describe("MDI (Exponential Moving Average)", function () {
  it("should calculate MDI using the calculate method", function () {
    const MdiResult = MDI.calculate({
      period: period,
      close: data.close,
      low: data.low,
      high: data.high,
    });
    assert.deepEqual(MdiResult, expectedOutput, "Wrong Results");
  });

  it("should be able to get MDI for the next bar", function () {
    const mdi = new MDI({
      period: period,
      close: data.close,
      low: data.low,
      high: data.high,
    });
    assert.deepEqual(
      mdi.getResult(),
      expectedOutput,
      "Wrong MDI while getting results"
    );
  });

  it("should be able to get MDI for the next bar using nextValue", function () {
    const mdiProducer = new MDI({
      period: period,
      close: [],
      high: [],
      low: [],
    });
    const results: number[] = [];
    data.candlesticks.forEach((price) => {
      const result = mdiProducer.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectedOutput,
      "Wrong Results while getting results"
    );
  });
});
