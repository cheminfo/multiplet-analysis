//import { writeFileSync } from 'fs';
//import { join } from 'path';

import { analyseMultiplet } from '..';
import noisyCarbon from '../../data/noisy-carbon.json';

describe('analyse multiplet of simulated spectra', () => {
  it.skip('noiseCarbon', () => {
    let result = analyseMultiplet(noisyCarbon, {
      frequency: 400,
      symmetrizeEachStep: true,
    });
    expect(result.js[0].coupling).toBeCloseTo(7, 1); // one decimal at low resolution (no interpolation)
    expect(result.js[0].multiplicity).toBe('d');
    expect(result.js).toHaveLength(1);
    expect(result.chemShift).toBeCloseTo(2.0, 5);
  });
});
