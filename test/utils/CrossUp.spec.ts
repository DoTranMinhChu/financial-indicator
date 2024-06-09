import assert from "assert";
import { CrossUp } from "../../src";

const input = {
  sourceSeries: [3, 4, 5, 6, 7, 2, 7, 5, 7, 2, 5, 5, 7, 2, 5, 5, 2, 7],
  referenceSeries: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
};

const expectedResults = [
  false,
  false,
  false,
  true,
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  true,
];

describe("Cross Up", function () {
  "use strict";
  it("should calculate positive line cross over using the calculate method", function () {
    assert.deepEqual(CrossUp.calculate(input), expectedResults);
  });

  it("should calculate positive line cross over by using getResult", function () {
    var crossUp = new CrossUp(input);
    assert.deepEqual(
      crossUp.getResult(),
      expectedResults,
      "Wrong Results while calculating next bar"
    );
  });

  it("should calculate positive line cross over by using nextValue", function () {
    var crossUp = new CrossUp({ sourceSeries: [], referenceSeries: [] });
    var results: boolean[] = [];
    input.sourceSeries.forEach((value, index) => {
      var result = crossUp.nextValue({
        sourceValue: input.sourceSeries[index],
        referenceValue: input.referenceSeries[index],
      });
      results.push(result);
    });
    assert.deepEqual(
      results,
      expectedResults,
      "Wrong Results while getting results"
    );
  });
});
