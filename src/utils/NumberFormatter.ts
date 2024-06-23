export function NumberFormat(v: number): number | undefined {
  if (v == undefined) return undefined;
  return parseFloat(v.toPrecision(4));
}
