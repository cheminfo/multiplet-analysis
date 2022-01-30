import { measureDeco } from '../measureDeco';

describe('test measureDeco', () => {
  it('first should be', () => {
    //  it.only
    expect(
      measureDeco(Float64Array.from([0, 1, 0, 1, 0]), 2, 1, 1, 0.5, 1),
    ).toBe(1);
    expect(
      measureDeco(Float64Array.from([0, 1, 0, 1, 0]), 3, 1, 1, 0.5, 1),
    ).toBe(0);
    expect(
      measureDeco(Float64Array.from([0, 1, 0, -1, 0]), 2, -1, 1, 0.5, 1),
    ).toBe(1);
  });
});
