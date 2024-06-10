import assert from "assert";
import { CrossOver } from "../../src";

const input = {
  sourceSeries: [7, 6, 5, 4, 3, 8, 3, 5, 3, 8, 5, 5, 3, 8, 5, 5, 8, 3],
  referenceSeries: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
};

const expectedResults = [
  false,
  false,
  false,
  true,
  false,
  true,
  true,
  false,
  false,
  true,
  false,
  false,
  true,
  true,
  false,
  false,
  false,
  true,
];

describe("Cross Over", function () {
  "use strict";
  it("should calculate positive line cross over using the calculate method", function () {
    assert.deepEqual(CrossOver.calculate(input), expectedResults);
  });

  it("should calculate positive line cross over by using getResult", function () {
    var crossOver = new CrossOver(input);
    assert.deepEqual(
      crossOver.getResult(),
      expectedResults,
      "Wrong Results while calculating next bar"
    );
  });

  it("should calculate positive line cross over by using nextValue", function () {
    var crossOver = new CrossOver({ sourceSeries: [], referenceSeries: [] });
    var results: boolean[] = [];
    input.sourceSeries.forEach((value, index) => {
      var result = crossOver.nextValue({
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
