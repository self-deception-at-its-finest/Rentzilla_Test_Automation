export function sortUnitNames (names: string[]) {
  const isLatin = (str: string) => /^[A-Z]/i.test(str);

  return [...names].sort((a, b) => {
    if (isLatin(a) && !isLatin(b)) return -1;
    if (!isLatin(a) && isLatin(b)) return 1;
    return a.localeCompare(b, "uk", { sensitivity: "base" });
  });
};