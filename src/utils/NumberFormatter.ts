export function NumberFormat(v: number): number {
  return parseFloat(v.toPrecision(4));
}
