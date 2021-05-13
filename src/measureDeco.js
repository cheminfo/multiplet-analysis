import { decofast1, decofast2 } from './deco';
import { scalarProduct } from './scalarProduct';

export function measureDeco(
  y, // input vector
  jStar, // tested value of J in pt
  sign, // sign of the split 1: ++ -1: +-
  chopTail, // 1: cut tail
  multiplicity,
  incrementForSpeed,
) {
  let nbLines = parseInt(2 * multiplicity, 10); // 1 for doublet (spin 1/2) 2, for spin 1, etc... never tested...
  let y1 = decofast1(y, jStar, sign, nbLines, jStar);
  let y2 = decofast2(y, jStar, sign, nbLines, jStar);
  return sign * scalarProduct(y1, y2, 1, incrementForSpeed);
}
