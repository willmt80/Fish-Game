import { Position } from '../Model/Position';

test('test for isValidPositionInRange', () => {
  expect(Position.isValidPositionInRange(2, 2, { row: 1, column: 1 })).toBe(true);

  expect(Position.isValidPositionInRange(2, 2, { row: 2, column: 1 })).toBe(false);

  expect(Position.isValidPositionInRange(2, 2, { row: 1, column: 2 })).toBe(false);
});

test('test for arePositionsEqual', () => {
  expect(Position.arePositionsEqual({ row: 1, column: 2}, { row: 1, column: 2 })).toBe(true);

  expect(Position.arePositionsEqual({ row: 1, column: 2}, { row: 1, column: 1 })).toBe(false);

  expect(Position.arePositionsEqual({ row: 1, column: 2}, { row: 2, column: 2 })).toBe(false);
});