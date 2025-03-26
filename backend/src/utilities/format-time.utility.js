const {
  isAfter,
  setDefaultOptions,
  format,
  subMinutes,
  subHours,
  getUnixTime,
  getDay,
  isWithinInterval,
  parse
} = require("date-fns");
const { utcToZonedTime, format: tzFormat } = require("date-fns-tz");

// locale
const { es } = require("date-fns/locale");
//
setDefaultOptions({ locale: es });

// ----------------------------------------------------------------------

/**
 * The function validates if a given date is the same or after the current date.
 * @param value - The value being passed to the function, which is expected to be a date string in a
 * format that can be parsed by the JavaScript Date constructor.
 * @returns a boolean value of `true` if the `value` parameter is the same or after the current date,
 * and throwing an error with the message "La fecha debe ser igual o posterior al día actual" if it is
 * not.
 */
const validateIsSameOrAfterDate = (value) => {
  console.log(
    "🚀 ~ file: format-time.utility.js:19 ~ validateIsSameOrAfterDate ~ new Date(value):",
    new Date(value)
  );
  console.log(
    "🚀 ~ file: format-time.utility.js:23 ~ validateIsSameOrAfterDate ~ new Date():",
    new Date()
  );
  if (!isAfter(new Date(value), new Date())) {
    throw new Error("La fecha debe ser igual o posterior al día actual");
  }
  return true;
};

/**
 * The function returns the current month in a long format using the date-fns library.
 * @returns The function `getTodayMonth` returns the current month in the format of the full month name
 * (e.g. "January", "February", etc.).
 */
const getCurrentMonth = () => {
  return format(new Date(), "LLLL");
};

/**
 * The getCurrentYear function returns the current year in the format "yyyy".
 * @returns The current year in the format "yyyy".
 */
const getCurrentYear = () => {
  return format(new Date(), "yyyy");
};

/**
 * The function `subTimeGetUnix` subtracts a specified number of minutes and hours from a given date and returns
 * the resulting Unix timestamp.
 * @param date - The `date` parameter is a JavaScript `Date` object that represents the date and
 * time. It is an optional parameter and if not provided, it defaults to the current date and time.
 * @param minutes - The `minutes` parameter is the number of minutes that you want to subtract from the
 * given date.
 * @param hours - The `hours` parameter is the number of hours that you want to subtract from the
 * given date.
 * @returns the Unix timestamp of the date that is obtained by subtracting the specified number of
 * minutes from the given date.
 */
const subTimeGetUnix = ({ date = new Date(), minutes = 1, hours = 0 }) => {
  // Subtract hours
  const newDateWithHoursSubtracted = subHours(date, hours);
  // Subtract minutes
  const newDate = subMinutes(newDateWithHoursSubtracted, minutes);
  // Convert to Unix Timestamp
  return getUnixTime(newDate);
};

/**
 * The function fFullDate formats a given date into the format "dd/MM/yyyy HH:mm:ss".
 * @param date - The `date` parameter is a string representing a date and time in a specific format.
 * @returns The function `fFullDate` returns a formatted string representing the input date in the
 * format "dd/MM/yyyy HH:mm:ss".
 */
const fFullDate = (date) => {
  const mexicoTimeZone = "America/Mexico_City";
  const dateInMexico = utcToZonedTime(date, mexicoTimeZone);

  return tzFormat(dateInMexico, "dd/MM/yyyy HH:mm:ss", {
    timeZone: mexicoTimeZone,
  });
};

/**
 * The function returns the current date in the format of "yyyyMMdd".
 * @returns The function `getTodayToFile` is returning a string representing today's date in the format
 * "yyyyMMdd".
 */
const getTodayToFile = () => {
  return format(new Date(), "yyyyMMdd_HHmmss");
};

const getNowDate = () => {
  const nowUTC = new Date(new Date().toUTCString());
  nowUTC.setHours(nowUTC.getHours() - 6);

  return nowUTC;
};

/**
 * The function formats a given date to the format "dd/MM/yy".
 * @param date - The `date` parameter is a string or a Date object representing the date you want to format.
 * @returns A formatted string representing the input date in the format "dd/MM/yy".
 */
const formatToShortDate = (date) => {
  return format(new Date(date), "dd/MM/yy"); // Formato DD/MM/YY
};

const time = () => {
  return new Date().toTimeString().split(" ")[0];
};

const holidays = [
  '2025-03-17',
  '2025-05-01',
  '2025-09-16',
  '2025-11-17',
  '2025-12-25',
]

const isTimeInRange = () => {
  const timeZone = 'America/Mexico_City';
  const now = utcToZonedTime(new Date(), timeZone);
  const dayOfWeek = getDay(now);
  const currentDate = format(now, 'yyy-MM-dd');
  const currentTime = format(now, 'HH:mm');

  const startTime = '8:00';
  const endTime = '21:00';
  // const endTime = (dayOfWeek === 0 || holidays.includes(currentDate)) ? '20:00' : '21:00';

  return isWithinInterval(parse(currentTime, 'HH:mm', now), {
    start: parse(startTime, 'HH:mm', now),
    end: parse(endTime, 'HH:mm', now),
  });
}

module.exports = {
  validateIsSameOrAfterDate,
  getCurrentMonth,
  getCurrentYear,
  subTimeGetUnix,
  fFullDate,
  getTodayToFile,
  getNowDate,
  formatToShortDate,
  time,
  isTimeInRange
};
