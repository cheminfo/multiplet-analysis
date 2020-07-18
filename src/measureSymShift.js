import { scalarProduct } from './scalarProduct';

export function measureSymShift(y) {
  if (!(y instanceof Float64Array)) {
    throw 'measureSymShift requires Float64Array';
  }

  let scalarProductReference;
  let scalarProductNewValue;
  let movedBy = 0;
  scalarProductReference = scalarProduct(y, y, -1, 1);
  // search left...
  for (let i = 1; i < y.length / 2; i++) {
    scalarProductNewValue = scalarProduct(
      y.slice(i, y.length),
      y.slice(i, y.length),
      -1,
      1,
    );
    if (scalarProductNewValue > scalarProductReference) {
      //  console.log(`${ScalarProductNewValue} > ${ScalarProductReference} size: ${y.length}`);
      scalarProductReference = scalarProductNewValue;
      movedBy = i;
    } else {
      // console.log('OK+ ' + movedBy + " " + i + ' ' + ScalarProductNewValue);
    }
  }
  if (movedBy === 0) {
    for (let i = 1; i < y.length / 2; i++) {
      scalarProductNewValue = scalarProduct(
        y.slice(0, y.length - i),
        y.slice(0, y.length - i),
        -1,
        1,
      );
      if (scalarProductNewValue > scalarProductReference) {
        //  console.log(`${ScalarProductNewValue} > ${ScalarProductReference} size: ${y.length}`);
        scalarProductReference = scalarProductNewValue;
        movedBy = -i;
      } else {
        // console.log('OK- ' + movedBy + ' ' + i + ' ' + ScalarProductNewValue);
      }
    }
  }
  //console.log('OK  ' + movedBy);
  return movedBy;
}
