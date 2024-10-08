export function formatDateStr(date = new Date()) {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function useTemplate<T extends readonly string[]>(
  staticStr: readonly string[],
  ...groupNames: T
) {
  const regexpStr = staticStr
    .flatMap((str, index) => [
      str,
      groupNames[index] ? `(?<${groupNames[index]}>.+?)` : "$",
    ])
    .join("");

  const matchExp = new RegExp(regexpStr);

  return {
    getData(str: string) {
      return matchExp.test(str)
        ? (str.match(matchExp)!.groups as Record<T[number], string>)
        : null;
    },
    setDate(data: Record<T[number], string | number>) {
      return staticStr
        .flatMap((str, index) => [str, data[groupNames[index] as T[number]]])
        .join("");
    },
  };
}
