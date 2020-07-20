import { scalarProduct } from './scalarProduct';

export function measureSymShift(y) {
  let scalarProductReference;
  let scalarProductNewValue;
  let movedBy = 0;
  scalarProductReference = scalarProduct(y, y, -1, 1);
  // search left...
  for (let i = 1; i < y.length / 2; i++) {
    scalarProductNewValue = scalarProduct(y, y, -1, 1, i, y.length);
    if (scalarProductNewValue > scalarProductReference) {
      scalarProductReference = scalarProductNewValue;
      movedBy = i;
    }
  }
  for (let i = 1; i < y.length / 2; i++) {
    scalarProductNewValue = scalarProduct(y, y, -1, 1, 0, y.length - i);
    if (scalarProductNewValue > scalarProductReference) {
      scalarProductReference = scalarProductNewValue;
      movedBy = -i;
    }
  }
  return movedBy;
}
