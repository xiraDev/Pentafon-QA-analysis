/**
 * It returns true if the dataStr is a string that is equal to 'true' or if the dataStr is a boolean
 * that is true.
 * @param dataStr - The string to convert to a boolean.
 */
export const toBoolean = (dataStr) => !!(dataStr?.toLowerCase?.() === 'true' || dataStr === true);
