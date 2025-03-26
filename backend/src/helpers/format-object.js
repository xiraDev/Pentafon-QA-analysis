/**
 * This will return true for following cases:
 * {}, [], "", undefined, null, object in above snippet(no enumerable property)
 * If the value is undefined, null, an empty object, or an empty string, then it is empty.
 * @param value - The value to check.
 */
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === "null" ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

/**
 * It returns true if the dataStr is a string that is equal to "true" or if the dataStr is a boolean
 * that is equal to true
 * @param dataStr - The string to convert to a boolean.
 * @returns A function that takes a string and returns a boolean.
 */
const toBoolean = (dataStr) => {
  return !!(dataStr?.toLowerCase?.() === "true" || dataStr === true);
};

module.exports = {
  isEmpty,
  toBoolean,
};
