import { trigInterpolate } from '../trigInterpolate';

describe('test measureDeco', () => {
  it('first should be', () => {
    //  it.only
    const results = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 4, 0);
    expect(results.spectrum).toHaveLength(4);
    expect(results.spectrum).toStrictEqual([
      2.7755575615628914e-17,
      0.5,
      0.5,
      2.7755575615628914e-17,
    ]);
    expect(results.scale).toStrictEqual([0, 1, 2, 3]);

    const results2 = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 8, 0);
    expect(results2.spectrum).toHaveLength(8);
    expect(results2.spectrum).toEqual([
      2.7755575615628914e-17,
      0.25,
      0.5,
      0.6035533905932737,
      0.5,
      0.25,
      2.7755575615628914e-17,
      -0.10355339059327373,
    ]);
    expect(results2.scale).toStrictEqual([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]);
  });
});
