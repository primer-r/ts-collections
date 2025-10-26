export const formatDate = (
  raw?: string | Date,
  format: string = "dd MMM yyyy"
) => {
  if (!(raw && format)) return raw;
  const meta = getDateMeta(raw);
  const keys = Object.keys(meta).sort((a, b) => b.length - a.length);

  return format.replace(
    new RegExp(`${keys.join("|")}`, "g"),
    (mtachedKey) => meta[mtachedKey as DateFormat] + ""
  );
};

export const getDateMeta = (
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
    MMMM = Months[M],
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
    EEEE = Weekdays[day],
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

export type DateFormat =
  | "yyyy"
  | "yy"
  | "MM"
  | "M"
  | "MMM"
  | "MMMM"
  | "dd"
  | "d"
  | "HH"
  | "H"
  | "hh"
  | "h"
  | "mm"
  | "m"
  | "ss"
  | "s"
  | "a"
  | "EEE"
  | "EEEE";

export const Months = [
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

export const MonthAbbreviations = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const Weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WeekdayAbbreviations = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const pad = (val: number, len = 2) => val.toString().padStart(len, "0");
