"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberUtils_1 = require("../Utils/NumberUtils");
// Contains data representation and functions for position
var Position;
(function (Position) {
    /**
     * Determines if the position is within the range of the rows and columns
     * @param rows the number of rows
     * @param columns the number of columns
     * @param position the position
     * @returns true if position row and column are between 0 and rows and columns
     */
    function isValidPositionInRange(rows, columns, position) {
        return (arePositionsNaturalNumbers(position) &&
            rows > position.row && columns > position.column);
    }
    Position.isValidPositionInRange = isValidPositionInRange;
    /**
     * Determines if position row and column are natural numbers
     * @param position the position
     * @returns true if row and column are natural numbers
     */
    function arePositionsNaturalNumbers(position) {
        return NumberUtils_1.isNaturalNumber(position.row) && NumberUtils_1.isNaturalNumber(position.column);
    }
    Position.arePositionsNaturalNumbers = arePositionsNaturalNumbers;
    /**
     * Determine if the two given positions are equal
     * @param pos1 the first position
     * @param pos2 the second position
     * @return true if the given positions are equal
     */
    function arePositionsEqual(pos1, pos2) {
        return pos1.row === pos2.row && pos1.column === pos2.column;
    }
    Position.arePositionsEqual = arePositionsEqual;
    function copyPosition(position) {
        return { row: position.row, column: position.column };
    }
    Position.copyPosition = copyPosition;
})(Position = exports.Position || (exports.Position = {}));
