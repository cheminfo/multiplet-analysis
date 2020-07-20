import { scalarProduct } from './scalarProduct';

export function measureSymShift(y) {
  if (!(y instanceof Float64Array)) {
    throw Error('measureSymShift requires Float64Array');
  }

  let scalarProductReference;
  let scalarProductNewValue;
  let movedBy = 0;
  scalarProductReference = scalarProduct(y, y, -1, 1);
  // search left...
  for (let i = 1; i < y.length / 2; i++) {
    const tmpY = new Float64Array(y.buffer, i * 8, y.length - i);
    scalarProductNewValue = scalarProduct(tmpY, tmpY, -1, 1);
    if (scalarProductNewValue > scalarProductReference) {
      scalarProductReference = scalarProductNewValue;
      movedBy = i;
    }
  }
  //if (movedBy === 0) {
    for (let i = 1; i < y.length / 2; i++) {
      const tmpY = new Float64Array(y.buffer, 0, y.length - i);
      scalarProductNewValue = scalarProduct(tmpY, tmpY, -1, 1);
      if (scalarProductNewValue > scalarProductReference) {
        scalarProductReference = scalarProductNewValue;
        movedBy = -i;
      }
    }
  //}
  return movedBy;
}
