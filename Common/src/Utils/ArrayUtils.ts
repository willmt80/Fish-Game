/**
 * Abstracted version of ormap for use throughout functions
 *
 * if any element in the list matches the predicate, then return true
 *
 * @param array an array to iterate over
 * @param predicate the predicate function
 */
export function orMap<T>(
  array: Array<T>,
  predicate: (element: T) => boolean
): boolean {
  let predicateMatch = false;

  array.forEach((element) => {
    if (predicate(element)) {
      predicateMatch = true;
    }
  });

  return predicateMatch;
}

/**
 * Abstracted version of andMap for use throughout functions
 *
 * if any element in the list matches the predicate, then return true
 *
 * @param array an array to iterate over
 * @param predicate the predicate function
 */
export function andMap<T>(
  array: Array<T>,
  predicate: (element: T) => boolean
): boolean {
  let predicateMatch = true;

  array.forEach((element) => {
    predicateMatch = predicateMatch && predicate(element);
  });

  return predicateMatch;
}

/**
 * Abstracted version of arrayEqual for use throughout functions
 *
 * if all elements in the list match the predicate, then return true
 *
 * @param array1 the first array
 * @param array2 the second array
 * @param equalityPredicate the predicate function
 */
export function areArraysEqual<T>(
  array1: Array<T>,
  array2: Array<T>,
  equalityPredicate: (element1: T, element2: T) => boolean
): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (!equalityPredicate(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
}
