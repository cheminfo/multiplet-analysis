import { scalarProduct } from './scalarProduct';

export function measureSymShift(y) {
  let ScalarProductReference;
  let ScalarProductNewValue;
  let movedBy = 0;
  ScalarProductReference = scalarProduct(y, y, -1, 1);
  // search left...
  for (let i = 1; i < y.length / 2; i++) {
    ScalarProductNewValue = scalarProduct(
      y.slice(i, y.length),
      y.slice(i, y.length),
      -1,
      1,
    );
    if (ScalarProductNewValue > ScalarProductReference) {
      //  console.log(`${ScalarProductNewValue} > ${ScalarProductReference} size: ${y.length}`);
      ScalarProductReference = ScalarProductNewValue;
      movedBy = i;
    } else {
      // console.log('OK+ ' + movedBy + " " + i + ' ' + ScalarProductNewValue);
    }
  }
  if (movedBy === 0) {
    for (let i = 1; i < y.length / 2; i++) {
      ScalarProductNewValue = scalarProduct(
        y.slice(0, y.length - i),
        y.slice(0, y.length - i),
        -1,
        1,
      );
      if (ScalarProductNewValue > ScalarProductReference) {
        //  console.log(`${ScalarProductNewValue} > ${ScalarProductReference} size: ${y.length}`);
        ScalarProductReference = ScalarProductNewValue;
        movedBy = -i;
      } else {
        // console.log('OK- ' + movedBy + ' ' + i + ' ' + ScalarProductNewValue);
      }
    }
  }
  //console.log('OK  ' + movedBy);
  return movedBy;
}
