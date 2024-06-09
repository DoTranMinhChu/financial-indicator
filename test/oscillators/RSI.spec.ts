import assert from "assert";
import { RSI } from "../../src";
import { data } from "../data";

var inputRSI = {
  values: data.close,
  period: 14,
};

describe("RSI (Exponential Moving Average)", function () {
  it("should calculate RSI using the calculate method", function () {
    const RSIResult = RSI.calculate(inputRSI);
    assert.deepEqual(RSIResult, [86.39, 86.41, 89.65, 86.48], "Wrong Results");
  });
});
