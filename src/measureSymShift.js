import { scalarProduct } from './scalarProduct';

export function measureSymShift(y, options) {
  let minimalIntegralKeptInMultiplet = 90.0;
  if (options !== undefined) {
    minimalIntegralKeptInMultiplet = options;
  }
  // set boundaries for integration (avoid chopping too much of the multiplet)
  let integral = new Float64Array(y.length);
  integral[0] = Math.abs(y[0]);
  for (let i = 1; i < y.length; i++) {
    integral[i] = integral[i - 1] + Math.abs(y[i]);
  }
  let finishingLeftPoint = y.length / 2;
  let finishingRightPoint = y.length / 2;
  // console.log(y);
  // console.log(integral);

  for (let i = 1; i < y.length / 2; i++) {
    if (
      (integral[integral.length - 1] - integral[i - 1]) /
        integral[integral.length - 1] <
      minimalIntegralKeptInMultiplet / 100.0
    ) {
      finishingLeftPoint = i;
      //   console.log( " 1<< " + finishingLeftPoint);

      break;
    }
  }
  for (let i = 1; i < y.length / 2; i++) {
    if (
      integral[integral.length - i - 1] / integral[integral.length - 1] <
      minimalIntegralKeptInMultiplet / 100.0
    ) {
      finishingRightPoint = i;
      //      console.log( " 2>>" + finishingRightPoint);

      break;
    }
  }
  //startingLeftFirstPoint = 1; ////////////////////////////////
  //startingRightFirstPoint = 1; ////////////////////////////////
  let scalarProductReference;
  let scalarProductNewValue;
  let movedBy = 0;
  scalarProductReference = scalarProduct(y, y, -1, 1);
  //  console.log("=========");
  //    console.log(0 + "  " + scalarProductReference);

  // set boudaries of search keep 90% of spectrum
  // search left...
  for (let i = 1; i < finishingLeftPoint; i++) {
    scalarProductNewValue = scalarProduct(y, y, -1, 1, i, y.length);
    //   console.log(i + "  " + scalarProductNewValue);

    if (scalarProductNewValue > scalarProductReference) {
      scalarProductReference = scalarProductNewValue;
      movedBy = i;
    }
  }
  for (let i = 1; i < finishingRightPoint; i++) {
    scalarProductNewValue = scalarProduct(y, y, -1, 1, 0, y.length - i);
    // console.log(-i + "  " + scalarProductNewValue);

    if (scalarProductNewValue > scalarProductReference) {
      scalarProductReference = scalarProductNewValue;
      movedBy = -i;
    }
  }
  return movedBy;
}
