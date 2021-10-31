"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Is the number a natural number [0, infinity]
 * @param num number in question
 */
function isNaturalNumber(num) {
    return Number.isInteger(num) && num >= 0;
}
exports.isNaturalNumber = isNaturalNumber;
/**
 * Is the number a positive integer [1, infinity]
 * @param num number in question
 */
function isPositiveInteger(num) {
    return Number.isInteger(num) && num > 0;
}
exports.isPositiveInteger = isPositiveInteger;
/**
 * Is the given number divisble by 2
 * @param num number in question
 */
function isEven(num) {
    return Number.isInteger(num / 2);
}
exports.isEven = isEven;
/**
 * Determines if a thing is a number
 *
 * NOTE: In typescript: in order to check if something is Not A number,
 * you must forcibly make it NaN
 *
 * @param maybeNum the thing in question
 */
function isNumber(maybeNum) {
    return !Number.isNaN(Number(maybeNum));
}
exports.isNumber = isNumber;
