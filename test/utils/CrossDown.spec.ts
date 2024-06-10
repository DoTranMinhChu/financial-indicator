import assert from "assert";
import { CrossDown } from "../../src";

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

describe("Cross Down", function () {
  "use strict";
  it("should calculate positive line cross over using the calculate method", function () {
    assert.deepEqual(CrossDown.calculate(input), expectedResults);
  });

  it("should calculate positive line cross over by using getResult", function () {
    var crossDown = new CrossDown(input);
    assert.deepEqual(
      crossDown.getResult(),
      expectedResults,
      "Wrong Results while calculating next bar"
    );
  });

  it("should calculate positive line cross over by using nextValue", function () {
    var crossDown = new CrossDown({ sourceSeries: [], referenceSeries: [] });
    var results: boolean[] = [];
    input.sourceSeries.forEach((value, index) => {
      var result = crossDown.nextValue({
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
