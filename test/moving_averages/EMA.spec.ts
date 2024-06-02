import assert from "assert";
import { EMA } from "../../dist";
import { data } from "../data";

const prices = data.close;
const period = 9;
const expectedOutput = [
  138.3, 140.5, 144.9, 151.7, 161.4, 173.5, 187.5, 198.7, 216.2, 229,
];

describe("EMA (Exponential Moving Average)", function () {
  it("should calculate EMA using the calculate method", function () {
    assert.deepEqual(
      EMA.calculate({ period: period, values: prices }),
      expectedOutput,
      "Wrong Results"
    );
  });

  it("should be able to get EMA from the get results", function () {
    const emaProducer = new EMA({ period: period, values: prices });
    assert.deepEqual(
      emaProducer.getResult(),
      expectedOutput,
      "Wrong Results while getting results"
    );
  });

  it("should be able to get EMA for the next bar using nextValue", function () {
    const emaProducer = new EMA({ period: period, values: [] });
    const results: number[] = [];
    prices.forEach((price) => {
      const result = emaProducer.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectedOutput,
      "Wrong Results while getting results"
    );
  });
});
