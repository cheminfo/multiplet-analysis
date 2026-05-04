import { scalarProduct } from './scalarProduct.ts';

/**
 *
 * @param y
 * @param minimalIntegralKeptInMultiplet
 * @returns
 */
export function measureSymShift(
  y: Float64Array,
  minimalIntegralKeptInMultiplet = 90,
): number {
  // set boundaries for integration (avoid chopping too much of the multiplet)
  const integral = new Float64Array(y.length);
  integral[0] = Math.abs(y[0]);
  for (let i = 1; i < y.length; i++) {
    integral[i] = integral[i - 1] + Math.abs(y[i]);
  }
  let finishingLeftPoint = y.length / 2;
  let finishingRightPoint = y.length / 2;
  const lastIntegralValue = integral.at(-1) as number;

  for (let i = 1; i < y.length / 2; i++) {
    if (
      (lastIntegralValue - integral[i - 1]) / lastIntegralValue <
      minimalIntegralKeptInMultiplet / 100
    ) {
      finishingLeftPoint = i;
      break;
    }
  }
  for (let i = 1; i < y.length / 2; i++) {
    if (
      integral[integral.length - i - 1] / lastIntegralValue <
      minimalIntegralKeptInMultiplet / 100
    ) {
      finishingRightPoint = i;
      break;
    }
  }
  let scalarProductReference;
  let scalarProductNewValue;
  let movedBy = 0;
  scalarProductReference = scalarProduct(y, y, -1, 1);

  // set boudaries of search keep 90% of spectrum
  // search left...
  for (let i = 1; i < finishingLeftPoint; i++) {
    scalarProductNewValue = scalarProduct(y, y, -1, 1, i, y.length);

    if (scalarProductNewValue > scalarProductReference) {
      scalarProductReference = scalarProductNewValue;
      movedBy = i;
    }
  }
  for (let i = 1; i < finishingRightPoint; i++) {
    scalarProductNewValue = scalarProduct(y, y, -1, 1, 0, y.length - i);

    if (scalarProductNewValue > scalarProductReference) {
      scalarProductReference = scalarProductNewValue;
      movedBy = -i;
    }
  }
  return movedBy;
}
