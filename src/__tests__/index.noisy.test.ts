import { describe, expect, it } from 'vitest';

import noisyCarbon from '../../data/noisy-carbon.json' with { type: 'json' };
import { analyseMultiplet } from '../index.ts';

describe('analyse multiplet of simulated spectra', () => {
  it.todo('noiseCarbon - never finishes', () => {
    const result = analyseMultiplet(noisyCarbon, {
      frequency: 400,
      symmetrizeEachStep: true,
    });

    expect(result.js[0].coupling).toBeCloseTo(7, 1); // one decimal at low resolution (no interpolation)
    expect(result.js[0].multiplicity).toBe('d');
    expect(result.js).toHaveLength(1);
    expect(result.chemShift).toBeCloseTo(2, 5);
  });
});
