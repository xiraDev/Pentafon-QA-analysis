// locales
import { es, enUS } from 'date-fns/locale';
import {
  parse,
  format,
  getTime,
  endOfDay,
  subMonths,
  startOfDay,
  endOfMonth,
  startOfMonth,
  setDefaultOptions,
  formatDistanceToNow,
} from 'date-fns';

// ----------------------------------------------------------------------

function configureDateFns(options) {
  setDefaultOptions(options);
}

configureDateFns({ locale: localStorage.getItem('i18nextLng') === 'en' ? enUS : es });

// ----------------------------------------------------------------------

/**
 * The function fDate formats a given date into a string with the format "dd MMMM yyyy".
 * @param date - The input date that needs to be formatted.
 * @returns The function `fDate` is returning a formatted date string in the format of "dd MMMM yyyy".
 * The input `date` is being converted to a JavaScript `Date` object using the `new Date()`
 * constructor, and then formatted using the `format()` function.
 */
export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateSql(date) {
  try {
    const parsedDate = parse(date, 'yyyy-mm-dd', new Date());
    return format(parsedDate, 'dd MMMM yyyy');
  } catch (error) {
    console.error('Error parsing date', date, error);
    return '';
  }
}

/**
 * The function fDateTime formats a given date into a string with the format "dd MMM yyyy HH:mm".
 * @param date - The input date that needs to be formatted.
 * @returns The function `fDateTime` is returning a formatted date string in the format of "dd MMM yyyy
 * HH:mm". The input `date` is being converted to a `Date` object and then formatted using the `format`
 * function.
 */
export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fFullDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm:ss');
}

/**
 * The function fTimestamp returns the time in milliseconds since January 1, 1970 for a given date.
 * @param date - The input parameter "date" is a date object that represents a specific point in time.
 * It can be in any valid date format recognized by the JavaScript Date constructor.
 * @returns The function `fTimestamp` takes a `date` parameter and returns the timestamp of that date
 * in milliseconds. The `getTime` method of the `Date` object is used to get the timestamp. Therefore,
 * the function returns the number of milliseconds since January 1, 1970, 00:00:00 UTC, for the given
 * date.
 */
export function fTimestamp(date) {
  return getTime(new Date(date));
}

/**
 * The function formats a given date and time into a string with a day/month/year and hour:minute AM/PM
 * format.
 * @param date - The input date that needs to be formatted with a date-time suffix.
 * @returns The function `fDateTimeSuffix` is returning a formatted date string in the format of
 * "dd/MM/yyyy hh:mm p" with the given date and time in 12-hour format with AM/PM suffix.
 */
export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

/**
 * The function returns a string representing the time elapsed between a given date and the current
 * time in a human-readable format.
 * @param date - The input date that we want to calculate the distance to now from. It can be a Date
 * object or a string that can be parsed into a Date object.
 * @returns The function `fToNow` is returning a string that represents the time distance between the
 * input `date` and the current time, using the `formatDistanceToNow` function from the `date-fns`
 * library. The `addSuffix` option is set to `true`, which adds the words "ago" or "in" to the returned
 * string to indicate whether the input date is in
 */
export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

/**
 * The function returns the current time in 24-hour format.
 * @returns The function `fTime24` returns the current time in 24-hour format (hours and minutes only)
 * as a string.
 */
export function fTime24(date = new Date()) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, 'HH:mm');
}

/**
 * The function "startDay" returns the formatted start of the day for a given date.
 * @param [date] - The `date` parameter is an optional parameter that represents the date and time for
 * which the start of the day needs to be calculated. If no value is provided for `date`, it defaults
 * to the current date and time.
 * @returns a formatted string representing the start of the day for the given date. The format of the
 * string is 'yyyy-MM-dd HH:mm:ss'.
 */
export function startDay(date = new Date()) {
  return format(startOfDay(date), 'yyyy-MM-dd HH:mm:ss');
}

/**
 * The function "endDay" returns the formatted end time of a given date.
 * @param [date] - The `date` parameter is an optional parameter that represents the date for which the
 * end of the day should be calculated. If no value is provided, it defaults to the current date and
 * time.
 * @returns a formatted string representation of the end of the day for the given date. The format of
 * the string is 'yyyy-MM-dd HH:mm:ss'.
 */
export function endDay(date = new Date()) {
  return format(endOfDay(date), 'yyyy-MM-dd HH:mm:ss');
}

/**
 * The function `fDate2RecordMedia` takes a date string in the format 'dd MMM yyyy HH:mm', parses it,
 * and returns the date in the format 'yyyy-MM-dd'.
 * @param date - The `fDate2RecordMedia` function takes a date string in the format 'dd MMM yyyy HH:mm'
 * and converts it to the format 'yyyy-MM-dd'. If the input date string is invalid, it returns 'Invalid
 * Date'.
 * @returns The function `fDate2RecordMedia` is returning the formatted date in the 'yyyy-MM-dd' format
 * if the input date is valid. If the input date is invalid, it will return 'Invalid Date'.
 */
export function fDate2RecordMedia(date) {
  const parsedDate = parse(date, 'dd MMM yyyy HH:mm', new Date());

  if (Number.isNaN(parsedDate)) {
    return 'Invalid Date';
  }

  return format(parsedDate, 'yyyy-MM-dd');
}

/**
 * The function `fDate2RecordMediaFile` converts a date string to a formatted media file record date.
 * @param date - The `fDate2RecordMediaFile` function takes a date string in the format 'dd MMM yyyy
 * HH:mm' and converts it to the format 'yyyy-MM-dd'. If the input date is invalid, it returns 'Invalid
 * Date'.
 * @returns The function `fDate2RecordMediaFile` takes a date string as input, parses it using the
 * format 'dd MMM yyyy HH:mm', and then returns the parsed date in the format 'yyyy-MM-dd'. If the
 * input date is invalid and cannot be parsed, the function will return 'Invalid Date'.
 */
export function fDate2RecordMediaFile(date) {
  const parsedDate = parse(date, 'dd MMM yyyy HH:mm', new Date());

  if (Number.isNaN(parsedDate)) {
    return 'Invalid Date';
  }

  return format(parsedDate, 'yyyy-MM-dd');
}

/**
 * The function `fDateTimeForFile` combines a formatted date and time into a string suitable for use in
 * a file name.
 * @param date - The `fDateTimeForFile` function takes a `date` parameter as input. This parameter
 * represents a date and time value that will be used to generate a formatted string for a file name.
 * @returns The function `fDateTimeForFile` is returning a string that combines the date and time parts
 * formatted for a file name.
 */
export function fDateTimeForFile(date) {
  const datePart = fDate2RecordMediaFile(date);

  const timePart = fTime24(date);

  return `${datePart}_${timePart}`;
}

/**
 * The function `getMonthStartAndEnd` returns the start and end dates of a specified month along with
 * the month name.
 * @param [offset=0] - The `offset` parameter in the `getMonthStartAndEnd` function allows you to
 * specify how many months before the current month you want to get the start and end dates for. By
 * default, if no offset is provided, it will return the start and end dates for the current month. If
 * @returns The function `getMonthStartAndEnd` returns an object with the following properties:
 * - `month`: The formatted month name (e.g., 'Jan' for January)
 * - `startOfFirstDay`: The start of the first day of the month
 * - `endOfLastDay`: The end of the last day of the month
 */
export function getMonthStartAndEnd(offset = 0) {
  const date = subMonths(new Date(), offset);
  const startOfFirstDay = startOfDay(startOfMonth(date));
  const endOfLastDay = endOfDay(endOfMonth(date));
  const monthName = format(date, 'MMM');

  return {
    month: monthName,
    startOfFirstDay,
    endOfLastDay,
  };
}

export function formatDateForFileName(dateString) {
  const [year, month, day] = dateString.split('-');

  return `${year}${month}${day}`;
}

/**
 * Convert a Date object to ISO format.
 * @param {Date} inputDate - The input Date object.
 * @returns {string} - The ISO formatted date string.
 */
export function convertToISO(inputDate) {
  try {
    // Ensure the input is a valid Date object
    if (!(inputDate instanceof Date) || Number.isNaN(inputDate)) {
      throw new Error('Invalid Date object');
    }

    // Format the Date object to ISO format
    const isoDate = format(inputDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    return isoDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return null; // Return null if the input is invalid
  }
}

export function extractFormattedTime(input) {
  if (!input) {
    throw new Error('El string de entrada no es válido');
  }

  // Dividir la cadena y obtener la parte de la hora
  const parts = input.split(' ');
  const time = parts[3]; // La hora es el cuarto elemento (índice 3)

  // Reemplazar ':' por '_'
  return time.replace(':', '-');
}

export function getFirstAndLastDayOfMonth(date) {
  const currentDate = date ? new Date(date) : new Date();

  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);

  return {
    firstDay: format(firstDay, 'yyyy-MM-dd'),
    lastDay: format(lastDay, 'yyyy-MM-dd'),
  };
}
