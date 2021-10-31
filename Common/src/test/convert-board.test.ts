import {
  boardColToHexX,
  boardRowToHexY,
  hexYToBoardRow,
  hexXToBoardCol,
} from '../Utils/ConvertBoard';

test('boardRowToHexY', () => {
  expect(boardRowToHexY(0)).toBe(0);
  expect(boardRowToHexY(2)).toBe(1);
  expect(boardRowToHexY(1)).toBe(0);
  expect(boardRowToHexY(9)).toBe(4);
});

test('boardColToHexX', () => {
  expect(boardColToHexX(0, 0)).toBe(0);
  expect(boardColToHexX(1, 0)).toBe(1);
  expect(boardColToHexX(0, 1)).toBe(2);
  expect(boardColToHexX(3, 0)).toBe(1);
});

test('hexYToBoardRow', () => {
  expect(hexYToBoardRow(0, 0)).toBe(0);
  expect(hexYToBoardRow(1, 0)).toBe(1);
  expect(hexYToBoardRow(1, 1)).toBe(3);
  expect(hexYToBoardRow(0, 1)).toBe(2);
  expect(hexYToBoardRow(3, 0)).toBe(1);
  expect(hexYToBoardRow(2, 2)).toBe(4);
});

test('hexXToBoardCol', () => {
  expect(hexXToBoardCol(0)).toBe(0);
  expect(hexXToBoardCol(1)).toBe(0);
  expect(hexXToBoardCol(2)).toBe(1);
  expect(hexXToBoardCol(3)).toBe(1);
  expect(hexXToBoardCol(4)).toBe(2);
});
