import assert from "assert";
import { ADX } from "../../src";
import { data } from "../data";
const adxPeriod = 7;
const diPeriod = 9;
const expectedOutput = [
  20.19, 4.076, 12.96, 33.85, 49.74, 49.73, 47.6, 55.66, 54.96,
];
const input = {
  adxPeriod,
  diPeriod,
  close: data.close,
  low: data.low,
  high: data.high,
};
describe("ADX (Average Directional Index)", function () {
  it("should calculate ADX using the calculate method", function () {
    assert.deepEqual(ADX.calculate(input), expectedOutput, "Wrong Results");
  });

  it("should be able to calculate ADX by using getResult", function () {
    var adx = new ADX(input);
    assert.deepEqual(
      adx.getResult(),
      expectedOutput,
      "Wrong Results while calculating next bar"
    );
  });

  it("should be able to get ADX for the next bar using nextValue", function () {
    var adx = new ADX({ adxPeriod, diPeriod, high: [], low: [], close: [] });
    var results: any = [];
    input.close.forEach(function (close, index) {
      var result = adx.nextValue({
        close: input.close[index],
        high: input.high[index],
        low: input.low[index],
      });
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectedOutput,
      "Wrong Results while getting results"
    );
  });
});
