import { scalarProduct } from './scalarProduct';
import { deco } from './deco';

export function measureDeco(
  y,
  JStar,
  sign,
  chopTail,
  multiplicity,
  incrementForSpeed,
) {
  let y1 = [];
  let y2 = [];
  y1 = deco(y, JStar, sign, 1, chopTail, multiplicity); // dir left to right
  y2 = deco(y, JStar, sign, -1, chopTail, multiplicity); // dir right to left
  return scalarProduct(y1, y2, 1, incrementForSpeed);
}