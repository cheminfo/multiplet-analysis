import type { Sign } from './types.ts';

export function scalarProduct(
  y1: Float64Array,
  y2: Float64Array,
  direction: Sign,
  incrementForSpeed: number,
  first = 0,
  last = y1.length,
): number {
  // direction = 1; crude scalar product
  // direction =-1: flip spectrum first
  let v11 = 0;
  let v22 = 0;
  let v12 = 0;
  if (direction === 1) {
    for (let index = first; index < last; index += incrementForSpeed) {
      v12 += y1[index] * y2[index];
      v11 += y1[index] * y1[index];
      v22 += y2[index] * y2[index];
    }
  } else {
    // Here as if flip left/right array
    for (let index = first; index < last; index += incrementForSpeed) {
      v12 += y1[index] * y2[last - (index - first) - 1];
      v11 += y1[index] * y1[index];
      v22 += y2[index] * y2[index];
    }
  }
  return v12 / Math.sqrt(v11 * v22);
}
