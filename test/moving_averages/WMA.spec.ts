import assert from "assert";
import { WMA } from "../../dist";
import { data } from "../data";

const prices = data.close;
const expectedResult = [
  140.3, 142.5, 146.9, 153.8, 163.9, 177.2, 193, 206.6, 226.7, 242.2,
];
const period = 9;

describe("WMA (Weighted Moving Average)", function () {
  it("should calculate WMA using the calculate method", function () {
    assert.deepEqual(
      WMA.calculate({
        period: period,
        values: prices,
      }),
      expectedResult,
      "Wrong Results"
    );
  });

  it("should be able to get WMA for the next bar", function () {
    const wma = new WMA({
      period: period,
      values: prices,
    });
    assert.deepEqual(
      wma.getResult(),
      expectedResult,
      "Wrong Results while getting results"
    );
  });

  it("should be able to get WMA for the next bar using nextValue", function () {
    const wma = new WMA({
      period: period,
      values: [],
    });
    const results: number[] = [];
    prices.forEach((price) => {
      const result = wma.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectedResult,
      "Wrong Results while getting results"
    );
  });
});
