import assert from "assert";
import { WEMA } from "../../dist";
import { data } from "../data";

const prices = data.close;
const expectedResult = [
  138.3, 139.5, 142.1, 146.2, 152.2, 159.9, 169.2, 177.4, 189.6, 199.6,
];
const period = 9;

describe("WEMA (Weighted Moving Average)", function () {
  it("should calculate WEMA using the calculate method", function () {
    assert.deepEqual(
      WEMA.calculate({
        period: period,
        values: prices,
      }),
      expectedResult,
      "Wrong Results"
    );
  });

  it("should be able to get WEMA for the next bar", function () {
    const WEMAProducer = new WEMA({
      period: period,
      values: prices,
    });
    assert.deepEqual(
      WEMAProducer.getResult(),
      expectedResult,
      "Wrong Results while getting results"
    );
  });

  it("should be able to get WEMA for the next bar using nextValue", function () {
    const WEMAProducer = new WEMA({
      period: period,
      values: [],
    });
    const results: number[] = [];
    prices.forEach((price) => {
      const result = WEMAProducer.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectedResult,
      "Wrong Results while getting results"
    );
  });
});
