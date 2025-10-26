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
