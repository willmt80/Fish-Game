import { isEven } from './NumberUtils';

export function boardRowToHexY(row: number) {
  return Math.floor(row / 2);
}

export function boardColToHexX(row: number, col: number) {
  return col * 2 + (row % 2);
}

export function hexYToBoardRow(x: number, y: number) {
  return y * 2 + (x % 2);
}

export function hexXToBoardCol(x: number) {
  return Math.floor(x / 2);
}
