import { orMap, areArraysEqual } from '../Utils/ArrayUtils';
import {
  isPositiveInteger,
  isNaturalNumber,
  isEven,
} from '../Utils/NumberUtils';

test('Positive Integer returns true if and only if given a positive integer', () => {
  expect(isPositiveInteger(1)).toBe(true);
  expect(isPositiveInteger(3)).toBe(true);
  expect(isPositiveInteger(0.5)).toBe(false);
  expect(isPositiveInteger(-1)).toBe(false);
  expect(isPositiveInteger(0)).toBe(false);
});

test('Is Natural Number returns true if and only if given a natural number', () => {
  expect(isNaturalNumber(0)).toBe(true);
  expect(isNaturalNumber(1)).toBe(true);
  expect(isNaturalNumber(3)).toBe(true);
  expect(isNaturalNumber(0.5)).toBe(false);
  expect(isNaturalNumber(-1)).toBe(false);
});

test('Is Even Number returns true if and only if given an Even Number', () => {
  expect(isEven(0)).toBe(true);
  expect(isEven(2)).toBe(true);
  expect(isEven(4)).toBe(true);
  expect(isEven(0.5)).toBe(false);
  expect(isEven(-1)).toBe(false);
  expect(isEven(3)).toBe(false);
  expect(isEven(9)).toBe(false);
});

test('test ormap functions as intended', () => {
  expect(orMap<number>([1, 2, 3], isEven)).toBe(true);
  expect(orMap<number>([-1, -1], isNaturalNumber)).toBe(false);
});

test('test areArraysEqual', () => {
  expect((areArraysEqual<number>([1, 2, 3], [1, 2, 3], (x, y) => x === y))).toBe(true);
  expect((areArraysEqual<number>([1, 2, 3], [1, 3, 3], (x, y) => x === y))).toBe(false);
})
