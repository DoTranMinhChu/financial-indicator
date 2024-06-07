import assert from "assert";
import { LinkedList } from "../../dist/utils/LinkedList";

describe("LinkedList", () => {
  let list: LinkedList;

  beforeEach(() => {
    list = new LinkedList();
  });

  it("should initialize with length 0", () => {
    assert.equal(list.length, 0);
  });

  it("should push items to the end", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    assert.equal(list.length, 3);
    assert.equal(list.tail, 3);
  });

  it("should pop items from the end", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    assert.equal(list.pop(), 3);
    assert.equal(list.length, 2);
  });

  // Add more test cases for other methods like shift, unshift, removeCurrent, etc.

  // Test cases for cursor manipulation
  it("should reset cursor to head", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.next();
    list.next();
    list.resetCursor();
    assert.equal(list.current, 1);
  });

  it("should move cursor to next", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.next();
    assert.equal(list.current, 1);
  });

  // Add more cursor manipulation test cases

  // Test cases for removing current item
  it("should remove current item", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.next();
    list.removeCurrent();
    assert.equal(list.current, 2);
    assert.equal(list.length, 2);
  });

  // Add more test cases for other methods
});
