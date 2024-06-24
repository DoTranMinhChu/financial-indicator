import assert from "assert";

import { data } from "../data";
import { Stochastic, StochasticOutput } from "../../src";
let period = 14;
let signalPeriod = 3;
let expectResult = [
  {
    d: undefined,
    k: 77.32,
  },
  {
    d: undefined,
    k: 91.93,
  },
  {
    d: 87.13,
    k: 92.14,
  },
  {
    d: 92.06,
    k: 96.99,
  },
  {
    d: 89.53,
    k: 87,
  },
];

let input = {
  high: data.high,
  low: data.low,
  close: data.close,
  period: period,
  signalPeriod: signalPeriod,
};

describe("Stochastic", function () {
  "use strict";
  it("should calculate Stochastic using the calculate method", function () {
    assert.deepEqual(
      Stochastic.calculate(input),
      expectResult,
      "Wrong Results"
    );
  });

  it("should be able to calculate Stochastic by using getResult", function () {
    let stochastic = new Stochastic(input);
    assert.deepEqual(
      stochastic.getResult(),
      expectResult,
      "Wrong Results while calculating next bar"
    );
  });

  it("should be able to get Stochastic for the next bar using nextValue", function () {
    let myInput = Object.assign({}, input);
    myInput.high = [];
    myInput.low = [];
    myInput.close = [];
    let stochastic = new Stochastic(myInput);
    let results: Array<StochasticOutput> = [];
    input.high.forEach((price, index) => {
      const result = stochastic.nextValue({
        high: input.high[index]!,
        low: input.low[index]!,
        close: input.close[index]!,
      });
      if (result) results.push(result);
    });
    assert.deepEqual(
      results,
      expectResult,
      "Wrong Results while getting results"
    );
  });
});
