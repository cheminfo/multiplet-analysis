export function symmetrize(y) {
  for (let indi = 0; indi < y.length / 2; indi++) {
    const average = (y[indi] + y[y.length - 1 - indi]) / 2;
    y[indi] = average;
    y[y.length - 1 - indi] = average;
  }
  return y;
}
