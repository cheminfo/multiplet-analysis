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

    const results1 = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 4, 30);
    expect(results1.spectrum).toHaveLength(4);
    expect(results1.spectrum).toStrictEqual([
      0.125,
      0.5580127018922193,
      0.30801270189221935,
      -0.12499999999999996,
    ]);

    const results11 = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 4, 90);
    expect(results11.spectrum).toHaveLength(4);
    expect(results11.spectrum).toStrictEqual([
      0.25,
      0.25000000000000006,
      -0.24999999999999997,
      -0.25,
    ]);

    const results2 = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 8, 0);
    expect(results2.spectrum).toHaveLength(8);
    expect(results2.spectrum).toStrictEqual([
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
