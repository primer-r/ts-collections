import type {
  DateFormat,
  DateInput,
  DatesDifference,
  Difference,
} from "@/types/date";
import { plural, substringOf } from "./formatter";

export const DAYS_PER_WEEK = 7;
export const WEEKS_PER_MONTH = 4;
export const MONTHS_PER_YEAR = 12;
export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
export const MonthAbbreviations = MONTHS.map(substringOf);
export const WeekdayAbbreviations = WEEKDAYS.map(substringOf);

export const formatDate = (raw?: DateInput, format: string = "dd MMM yyyy") => {
  if (!(raw && format)) return raw;
  const meta = dateMetaOf(raw);
  const keys = Object.keys(meta).sort((a, b) => b.length - a.length);

  return format.replace(
    new RegExp(`${keys.join("|")}`, "g"),
    (mtachedKey) => meta[mtachedKey as DateFormat] + ""
  );
};

export const diffDates = (
  a?: DateInput,
  b?: DateInput
): Partial<DatesDifference> => {
  const meta = datesMetaOf(a, b);
  const { d1, d2 } = meta;
  if (!(d1 && d2)) return {};

  let [year, month, date] = [0, 0, 0];
  while (toNewDate(d1, year + 1) <= d2) {
    year++;
  }
  while (toNewDate(d1, year, month + 1) <= d2) {
    month++;
  }
  while (toNewDate(d1, year, month, date + 1) <= d2) {
    date++;
  }

  const difference = roundUp(year, month, 0, date);
  return {
    meta,
    ...difference,
    formatter: durationFormatter(difference),
  };
};

export const durationFormatter =
  (difference: Partial<Difference>) =>
  (format = "year month week") => {
    if (!(format && difference.time)) return "";
    return format
      .replace(
        /year|month|week|day|time/gi,
        (matched) =>
          plural(matched, difference[matched as keyof Difference]) ?? matched
      )
      .replace(/\s+/g, " "); // NOTE: replace multiple spaces with single space
  };

export const roundUp = (
  years: number = 0,
  months: number = 0,
  weeks: number = 0,
  days: number = 0,
  time: number = 0
) => {
  if (!years && !months && !weeks && !days && !time) return {};
  const day = (days || 0) % DAYS_PER_WEEK,
    totalWeek = (weeks || 0) + Math.floor((days || 0) / DAYS_PER_WEEK),
    totalMonth = (months || 0) + Math.floor(totalWeek / WEEKS_PER_MONTH);
  return {
    time: time || 0,
    day,
    week: totalWeek % WEEKS_PER_MONTH,
    month: totalMonth % MONTHS_PER_YEAR,
    year: (years || 0) + Math.floor(totalMonth / MONTHS_PER_YEAR),
  };
};

export const datesMetaOf = (
  a?: DateInput,
  b?: DateInput
): DatesDifference["meta"] => {
  if (!(a && b && a !== b)) return {};
  const [d1, d2] = [toDate(a), toDate(b)];
  if (!(d1 && d2)) return {};
  const [start, end] = d1 < d2 ? [d1, d2] : [d2, d1];
  const time = Math.abs(d1.getTime() - d2.getTime()),
    day = Math.floor(time / MILLISECONDS_PER_DAY);
  return { d1: start, d2: end, time, day };
};

export const dateMetaOf = (
  raw?: Date | string
): Partial<Record<DateFormat, string | number>> => {
  if (!raw) return {};
  const date = new Date(raw);
  if (isNaN(date.getTime())) return {};
  const yyyy = date.getFullYear(),
    yy = (yyyy + "").slice(-2),
    M = date.getMonth(),
    MM = M > 8 ? M + 1 : "0" + (M + 1),
    MMM = MonthAbbreviations[M],
    MMMM = MONTHS[M],
    d = date.getDate(),
    dd = pad(d),
    H = date.getHours(),
    HH = pad(H),
    h = H % 12 === 0 ? 12 : H % 12,
    hh = pad(h),
    m = date.getMinutes(),
    mm = pad(m),
    s = date.getSeconds(),
    ss = pad(s),
    day = date.getDay(),
    EEE = WeekdayAbbreviations[day],
    EEEE = WEEKDAYS[day],
    a = H > 12 ? "PM" : "AM";
  return {
    yyyy,
    yy,
    M: M + 1,
    MM,
    MMM,
    MMMM,
    d,
    dd,
    H,
    HH,
    h,
    hh,
    m,
    mm,
    s,
    ss,
    EEE,
    EEEE,
    a,
  };
};

export const pad = (val: number, len = 2) => val.toString().padStart(len, "0");

export const toNewDate = (
  date: DateInput,
  yearsToAdd: number = 0,
  monthsToAdd: number = 0,
  datesToAdd: number = 0
) => {
  if (!date) return date;
  const copy = toDate(date);
  if (!copy) return date;
  return new Date(
    copy.getFullYear() + (yearsToAdd || 0),
    copy.getMonth() + (monthsToAdd || 0),
    copy.getDate() + (datesToAdd || 0)
  );
};

export const toDate = (raw?: DateInput): Date | null => {
  if (!raw) return null;
  const date = new Date(raw);
  return isValidDate(date) ? date : null;
};

export const isValidDate = (date?: Date) =>
  date instanceof Date && isNaN(date.getTime());
