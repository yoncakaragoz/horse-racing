export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * picks k distinct random elements
 */
export function pickDistinct<T>(array: T[], k: number): T[] {
  const copy = [...array];
  const result: T[] = [];

  while (result.length < k && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }

  return result;
}
