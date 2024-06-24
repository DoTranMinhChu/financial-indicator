import assert from "assert";
import { data } from "../data";
import { ATR } from "../../src";
var period = 14;

var input = {
  high: data.high,
  low: data.low,
  close: data.close,
  period: period,
};

const expectResult = [24.38, 24.92, 28.42, 29.2];

describe("ATR (Average True Range)", function () {
  it("should calculate ATR using the calculate method", function () {
    assert.deepEqual(ATR.calculate(input), expectResult, "Wrong Results");
  });

  it("should be able to caÎlculate ATR by using getResult", function () {
    var atr = new ATR(input);
    assert.deepEqual(
      atr.getResult(),
      expectResult,
      "Wrong Results while calculating next bar"
    );
  });

  it("should be able to get ATR for the next bar using nextValue", function () {
    var atr = new ATR({ period: period, high: [], low: [], close: [] });
    var results: Array<number> = [];
    input.close.forEach(function (close, index) {
      var result = atr.nextValue({
        close: input.close[index],
        high: input.high[index],
        low: input.low[index],
      });
      if (result !== undefined) {
        results.push(parseFloat(result.toPrecision(4)));
      }
    });
    assert.deepEqual(
      results,
      expectResult,
      "Wrong Results while getting results"
    );
  });
});
