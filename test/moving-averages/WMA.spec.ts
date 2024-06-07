import assert from "assert";
import { WMA } from "../../dist";
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
  { value: 140.3, timestamp: 1049168700 },
  { value: 142.5, timestamp: 1051760700 },
  { value: 146.9, timestamp: 1054525500 },
  { value: 153.8, timestamp: 1057031100 },
  { value: 163.9, timestamp: 1059709500 },
  { value: 177.2, timestamp: 1062387900 },
  { value: 193.0, timestamp: 1064979900 },
  { value: 206.6, timestamp: 1067831100 },
  { value: 226.7, timestamp: 1070250300 },
  { value: 242.2, timestamp: 1072928700 },
];

const expectedWMAOutput = expectedOutput
  .map((item) => item.value)
  .filter((value) => value != undefined);
const period = 9;

describe("WMA (Weighted Moving Average)", function () {
  it("should calculate WMA using the calculate method", function () {
    assert.deepEqual(
      WMA.calculate({
        period: period,
        values: prices,
      }),
      expectedWMAOutput,
      "Wrong Results"
    );
  });
  it(`should calculate WMA ${period} for candlestick using the calculate method`, function () {
    const smaData = WMA.calculate({
      period,
      values: data.candlesticks.map((item) => item.close),
    });

    const candlestickResult = data.candlesticks.map((item, index) => {
      return {
        value: index + 1 < period ? undefined : smaData[index + 1 - period],
        timestamp: item.timestamp,
      };
    });
    assert.deepEqual(candlestickResult, expectedOutput, "Wrong Results");
  });
  it("should be able to get WMA for the next bar", function () {
    const wma = new WMA({
      period: period,
      values: prices,
    });
    assert.deepEqual(
      wma.getResult(),
      expectedWMAOutput,
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
      expectedWMAOutput,
      "Wrong Results while getting results"
    );
  });
});
