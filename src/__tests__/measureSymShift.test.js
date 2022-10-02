import { measureSymShift } from '../measureSymShift';

describe('analyse multiplet of simulated spectra', () => {
  it('first should be', () => {
    //  it.only
    expect(measureSymShift(Float64Array.from([0, 1, 0, 1, 0]))).toBe(0);
    expect(measureSymShift(Float64Array.from([0, 0, 1, 0, 1, 0]))).toBe(1);
    expect(
      measureSymShift(Float64Array.from([0, 0, 1, 0, 1, 0, 0, 0, 0])),
    ).toStrictEqual(-2);
    expect(
      measureSymShift(Float64Array.from([0, 0, 0, 0, 1, 0, 1.2, 0, 0, 0, 0])),
    ).toBe(0);
    // asym multiplets
    expect(measureSymShift(Float64Array.from([0, 1, 0, 1, 0]))).toBe(0);
    expect(measureSymShift(Float64Array.from([0.0, 1, 0, 0.8, 0]), 30)).toBe(2);
    expect(measureSymShift(Float64Array.from([0.0, 1, 0, 0.8, 0]), 95)).toBe(0);
  });
});
