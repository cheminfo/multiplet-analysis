import { decofast1, decofast2 } from './deco.ts';
import { scalarProduct } from './scalarProduct.ts';
import type { Sign } from './types.ts';

export function measureDeco(
  y: Float64Array, // input vector
  jStar: number, // tested value of J in pt
  sign: Sign, // sign of the split 1: ++ -1: +-
  multiplicity: number,
  incrementForSpeed: number,
) {
  const nbLines = Math.trunc(2 * multiplicity); // 1 for doublet (spin 1/2) 2, for spin 1, etc... never tested...
  const y1 = decofast1(y, jStar, sign, nbLines, jStar);
  const y2 = decofast2(y, jStar, sign, nbLines, jStar);
  return sign * scalarProduct(y1, y2, 1, incrementForSpeed);
}
