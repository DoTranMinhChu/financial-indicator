import assert from "assert";
import { ADX } from "../../src";
import { data } from "../data";
const adxPeriod = 7;
const diPeriod = 9;
const expectedOutput = [
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: undefined,
    pdi: undefined,
  },
  {
    adx: undefined,
    mdi: 22.35,
    pdi: 14.84,
  },
  {
    adx: undefined,
    mdi: 21.65,
    pdi: 23.49,
  },
  {
    adx: undefined,
    mdi: 21.55,
    pdi: 27.97,
  },
  {
    adx: undefined,
    mdi: 19.06,
    pdi: 38.57,
  },
  {
    adx: undefined,
    mdi: 15.88,
    pdi: 47.31,
  },
  {
    adx: undefined,
    mdi: 15.06,
    pdi: 44.86,
  },
  {
    adx: 31.17,
    mdi: 14.73,
    pdi: 41.49,
  },
  {
    adx: 34.67,
    mdi: 12.38,
    pdi: 43.46,
  },
  {
    adx: 37.57,
    mdi: 12.09,
    pdi: 41.6,
  },
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
