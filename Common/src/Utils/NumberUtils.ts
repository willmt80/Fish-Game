/**
 * Is the number a natural number [0, infinity]
 * @param num number in question
 */
export function isNaturalNumber(num: number) {
  return Number.isInteger(num) && num >= 0;
}

/**
 * Is the number a positive integer [1, infinity]
 * @param num number in question
 */
export function isPositiveInteger(num: number) {
  return Number.isInteger(num) && num > 0;
}

/**
 * Is the given number divisble by 2
 * @param num number in question
 */
export function isEven(num: number) {
  return Number.isInteger(num / 2);
}

/**
 * Determines if a thing is a number
 *
 * NOTE: In typescript: in order to check if something is Not A number,
 * you must forcibly make it NaN
 *
 * @param maybeNum the thing in question
 */
export function isNumber(maybeNum: any) {
  return !Number.isNaN(Number(maybeNum));
}
