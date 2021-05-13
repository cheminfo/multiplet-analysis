import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { trigInterpolate } from '../trigInterpolate';

expect.extend({ toBeDeepCloseTo });

describe('test measureDeco', () => {
  it('first should be', () => {
    const results = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 4, 0);
    expect(Array.from(results.spectrum)).toStrictEqual([0, 0.5, 0.5, 0]);
    expect(Array.from(results.scale)).toStrictEqual([0, 1, 2, 3]);

    const results1 = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 4, 30);
    expect(Array.from(results1.spectrum)).toBeDeepCloseTo([
      0.125, 0.5580127018922193, 0.30801270189221935, -0.125,
    ]);

    const results11 = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 4, 90);
    expect(Array.from(results11.spectrum)).toBeDeepCloseTo([
      0.25, 0.25, -0.25, -0.25,
    ]);

    const results2 = trigInterpolate([0, 1, 2, 3], [0, 1, 1, 0], 8, 0);
    expect(Array.from(results2.spectrum)).toBeDeepCloseTo([
      0, 0.25, 0.5, 0.6035533905932737, 0.5, 0.25, 0, -0.10355339059327373,
    ]);
    expect(Array.from(results2.scale)).toStrictEqual([
      0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5,
    ]);
  });
});
