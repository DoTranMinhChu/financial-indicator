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

  // Test cases for pop method
  it("should pop items from the end", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    assert.equal(list.pop(), 3);
    assert.equal(list.length, 2);
    assert.equal(list.tail, 2);
  });

  it("should return undefined when popping from an empty list", () => {
    assert.equal(list.pop(), undefined);
    assert.equal(list.length, 0);
  });

  // Test cases for shift method
  it("should shift items from the beginning", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    assert.equal(list.shift(), 1);
    assert.equal(list.length, 2);
    assert.equal(list.head, 2);
  });

  it("should return undefined when shifting from an empty list", () => {
    assert.equal(list.shift(), undefined);
    assert.equal(list.length, 0);
  });

  // Test cases for unshift method
  it("should unshift items to the beginning", () => {
    list.unshift(1);
    list.unshift(2);
    list.unshift(3);
    assert.equal(list.length, 3);
    assert.equal(list.head, 3);
  });

  // Test cases for unshiftCurrent method
  it("should unshift current item to the beginning", () => {

    list.push(1);
    list.push(2);
    list.push(3);
    list.next();
    list.next();
    assert.equal(list.unshiftCurrent(), 2);
    assert.equal(list.length, 3);
    assert.equal(list.head, 2);
  });

  // Test cases for removeCurrent method
  it("should remove current item", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.next();
    list.removeCurrent();
    assert.equal(list.current, 2);
    assert.equal(list.length, 2);
  });

  // Test cases for resetCursor method
  it("should reset cursor to head", () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.next();
    list.next();
    list.resetCursor();
    assert.equal(list.current, 1);
  });
});
