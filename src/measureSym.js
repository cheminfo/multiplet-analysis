import { scalarProduct } from './scalarProduct';

export function measureSym(y) {
  let spref;
  let spnew;
  let movedBy = 0;
  spref = scalarProduct(y, y, -1, 1);
  // search left...
  for (let indi = 1; indi < y.length / 2; indi++) {
    spnew = scalarProduct(
      y.slice(indi, y.length),
      y.slice(indi, y.length),
      -1,
      1,
    );
    if (spnew > spref) {
      //  console.log(`${spnew} > ${spref} size: ${y.length}`);
      spref = spnew;
      movedBy = indi;
    } else {
      // console.log('OK+ ' + movedBy + " " + indi + ' ' + spnew);
    }
  }
  if (movedBy === 0) {
    for (let indi = 1; indi < y.length / 2; indi++) {
      spnew = scalarProduct(
        y.slice(0, y.length - indi),
        y.slice(0, y.length - indi),
        -1,
        1,
      );
      if (spnew > spref) {
        //  console.log(`${spnew} > ${spref} size: ${y.length}`);
        spref = spnew;
        movedBy = -indi;
      } else {
        // console.log('OK- ' + movedBy + ' ' + indi + ' ' + spnew);
      }
    }
  }
  //console.log('OK  ' + movedBy);
  return movedBy;
}
