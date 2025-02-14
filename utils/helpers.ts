export const SHOULD_LOG = false;
export const sleep = (time: number = 2000) =>
  new Promise((res) => {
    setTimeout(() => res(true), time);
  });

export const removeDuplicates = <T>(items: T[]): T[] => [...new Set(items)];

export const responseData = <T = null>(
  message: string,
  data: T,
  status = true,
  shouldLogout = false
) => ({
  message,
  data,
  status,
  shouldLogout,
});

export const isEmpty = (obj: Record<any, any>): boolean =>
  Boolean(Object.keys(obj).length);

export const log = (...args: any[]) => {
  if (!SHOULD_LOG) return;

  const logs = [];
  for (const arg of args) {
    if (typeof arg === "object") {
      logs.push(JSON.stringify(arg, null, 4));
      continue;
    }
    logs.push(arg);
  }
  console.log(...logs);
};

export const arraySplitter = <T>(array: T[], length = 3): T[][] => {
  const num = Math.ceil(array.length / length);
  const result: T[][] = [];
  for (let i = 0; i < num; i++) {
    result.push(array.slice(i * length, (i + 1) * length));
  }
  return result;
};

export const arrayToSelectObject = <T>(arr: T[]) => {
  if(!Array.isArray(arr)) return []
  return arr.map((item) => ({ label: item, value: item }));
};
