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

export type Duration =
  | "ONE_WEEK"
  | "TWO_WEEKS"
  | "THREE_WEEKS"
  | "ONE_MONTH"
  | "TWO_MONTHS"
  | "THREE_MONTHS"
  | "FOUR_MONTHS"
  | "FIVE_MONTHS"
  | "SIX_MONTHS"
  | "NOT_ALLOWED";

export type DateInput = string | Date;

export type Difference = {
  time: number;
  day: number;
  week: number;
  month: number;
  year: number;
};

export type DatesDifference = Difference & {
  formatter: (format?: string) => string; // NOTE: format picks keys from Difference
  meta: Partial<{ d1: Date; d2: Date; time: number; day: number }>; // NOTE: d1<d2
};
