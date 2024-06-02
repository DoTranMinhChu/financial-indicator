import assert from "assert";
import { SMA } from "../../dist";
import { data } from "../data";

var prices = data.close;

var period = 10;

var expectResult = [
  139.4, 142.9, 147.9, 154.7, 162.3, 171.7, 182.3, 196.2, 210.4,
];

describe("SMA (Simple Moving Average)", function () {
  it("should calculate SMA using the calculate method", function () {
    const result = SMA.calculate({ period: period, values: prices });
    assert.deepEqual(result, expectResult, "Wrong Results");
  });

  it("should be able to calculate EMA by using getResult", function () {
    var smaProducer = new SMA({ period: period, values: prices });
    assert.deepEqual(
      smaProducer.getResult(),
      expectResult,
      "Wrong Results while calculating next bar"
    );
  });

  it("should be able to get SMA for the next bar using nextValue", function () {
    var smaProducer = new SMA({ period: period, values: [] });
    var results: Array<number> = [];
    prices.forEach((price) => {
      var result = smaProducer.nextValue(price);
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectResult,
      "Wrong Results while getting results"
    );
  });

  it("should be able to get SMA for low values(issue 1)", function () {
    let expectedResult = [0.002, 0.00275, 0.0025, 0.003, 0.003, 0.0025];
    assert.deepEqual(
      SMA.calculate({
        period: 4,
        values: [0.001, 0.003, 0.001, 0.003, 0.004, 0.002, 0.003, 0.003, 0.002],
      }),
      expectedResult,
      "Wrong Results"
    );
  });

  it("Passing format function should format the results appropriately", function () {
    let expectedResult = [0.002, 0.003, 0.003, 0.003, 0.003, 0.003];
    assert.deepEqual(
      SMA.calculate({
        period: 4,
        values: [0.001, 0.003, 0.001, 0.003, 0.004, 0.002, 0.003, 0.003, 0.002],
        format: (val) => {
          return +val.toPrecision(1);
        },
      }),
      expectedResult,
      "Wrong Results"
    );
  });
});
