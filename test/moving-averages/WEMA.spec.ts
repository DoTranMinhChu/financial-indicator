import assert from "assert";
import { WEMA } from "../../src";
import { data } from "../data";

const prices = data.close;
const expectedOutput = [
  { value: undefined, timestamp: 1028173500 },
  { value: undefined, timestamp: 1030938300 },
  { value: undefined, timestamp: 1033443900 },
  { value: undefined, timestamp: 1036122300 },
  { value: undefined, timestamp: 1038800700 },
  { value: undefined, timestamp: 1041392700 },
  { value: undefined, timestamp: 1044243900 },
  { value: undefined, timestamp: 1046663100 },
  { value: 138.3, timestamp: 1049168700 },
  { value: 139.5, timestamp: 1051760700 },
  { value: 142.1, timestamp: 1054525500 },
  { value: 146.2, timestamp: 1057031100 },
  { value: 152.2, timestamp: 1059709500 },
  { value: 159.9, timestamp: 1062387900 },
  { value: 169.2, timestamp: 1064979900 },
  { value: 177.4, timestamp: 1067831100 },
  { value: 189.6, timestamp: 1070250300 },
  { value: 199.6, timestamp: 1072928700 },
];

const period = 9;
const expectedWEMAOutput = expectedOutput
  .map((item) => item.value)
  .filter((value) => value != undefined);

describe("WEMA (Weighted Moving Average)", function () {
  it("should calculate WEMA using the calculate method", function () {
    assert.deepEqual(
      WEMA.calculate({
        period: period,
        values: prices,
      }),
      expectedWEMAOutput,
      "Wrong Results"
    );
  });

  it(`should calculate WEMA ${period} for candlestick using the calculate method`, function () {
    const wemaData = WEMA.calculate({
      period,
      values: data.candlesticks.map((item) => item.close),
    });

    const candlestickResult = data.candlesticks.map((item, index) => {
      return {
        value: index + 1 < period ? undefined : wemaData[index + 1 - period],
        timestamp: item.timestamp,
      };
    });
    assert.deepEqual(candlestickResult, expectedOutput, "Wrong Results");
  });
  it("should be able to get WEMA for the next bar", function () {
    const WEMAProducer = new WEMA({
      period: period,
      values: prices,
    });
    assert.deepEqual(
      WEMAProducer.getResult(),
      expectedWEMAOutput,
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
      expectedWEMAOutput,
      "Wrong Results while getting results"
    );
  });
});
