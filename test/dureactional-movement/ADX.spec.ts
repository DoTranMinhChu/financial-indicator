import assert from "assert";
import { ADX } from "../../src";
import { data } from "../data";
const adxPeriod = 7;
const diPeriod = 9;
const expectedOutput = [31.17, 34.67, 37.57];
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
        close: input.close[index]!,
        high: input.high[index]!,
        low: input.low[index]!,
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
