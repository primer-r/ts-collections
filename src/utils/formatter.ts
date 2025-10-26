export const formatEnum = (str?: string) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(/_AND_/)
    .map(
      (it, i, array) =>
        (i === 0 ? "" : i === array.length - 1 ? " & " : ",") + it
    )
    .join("")
    .replace(/[^\w\s]/g, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const substringOf = (raw?: string, length = 3) => {
  if (!(typeof raw === "string" && raw && raw.length > length)) return raw;
  return raw.slice(0, length);
};

export const plural = (name: string, value?: number) => {
  if (!value) return "";
  return `${value} ${name}${value > 1 ? "s" : ""}`?.trim();
};
