import { deco } from './deco';
import { scalarProduct } from './scalarProduct';

export function measureDeco(
  y, // input vector
  JStar, // tested value of J in pt
  sign, // sign of the split 1: ++ -1: +-
  chopTail, // 1: cut tail
  multiplicity,
  incrementForSpeed,
) {
  let y1 = deco(y, JStar, sign, 1, chopTail, multiplicity); // dir left to right
  let y2 = deco(y, JStar, sign, -1, chopTail, multiplicity); // dir right to left
  return sign * scalarProduct(y1, y2, 1, incrementForSpeed);
}
