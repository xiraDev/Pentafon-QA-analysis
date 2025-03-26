/**
 * This will return true for following cases:
 * {}, [], "", undefined, null, object in above snippet(no enumerable property)
 * If the value is undefined, null, an empty object, or an empty string, then it is empty.
 * @param value - The value to check.
 */
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}
