// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce<T extends Function>(func: T, wait = 150) {
  let h: NodeJS.Timeout;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => func(...args), wait);
  };
  return callable as any as T;
}
