import { orMap } from '../Utils/ArrayUtils';
import { isNaturalNumber, isPositiveInteger } from '../Utils/NumberUtils';

// Contains data representation and functions for position
export namespace Position {
  // position is an object with a row and a column
  export type position = {
    row: number;
    column: number;
  };

  /**
   * Determines if the position is within the range of the rows and columns
   * @param rows the number of rows
   * @param columns the number of columns
   * @param position the position
   * @returns true if position row and column are between 0 and rows and columns
   */
  export function isValidPositionInRange(
    rows: number,
    columns: number,
    position: position
  ): boolean {
    return (
      arePositionsNaturalNumbers(position) &&
      rows > position.row && columns > position.column
    );
  }

  /**
   * Determines if position row and column are natural numbers
   * @param position the position
   * @returns true if row and column are natural numbers
   */
  export function arePositionsNaturalNumbers(position: position): boolean {
    return isNaturalNumber(position.row) && isNaturalNumber(position.column);
  }

  /**
   * Determine if the two given positions are equal
   * @param pos1 the first position
   * @param pos2 the second position
   * @return true if the given positions are equal
   */
  export function arePositionsEqual(pos1: position, pos2: position): boolean {
    return pos1.row === pos2.row && pos1.column === pos2.column;
  }

  export function copyPosition(position: position): position {
    return { row: position.row, column: position.column };
  }
}
