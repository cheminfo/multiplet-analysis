import doublet from './data/d=2_J=7_m=d.json';
import quadruplet from './data/d=1_J=7_m=q.json';

import { analyseMultiplet } from '..';

describe('analyse multiplet of simulated spectra', () => {
  it('d=2_J=7_m=d', () => {
    // was it.only
    let result = analyseMultiplet(doublet, { frequency: 400 });
    expect(result.multiplicity).toBe('');
    expect(result.j[0]).toStrictEqual({ multiplicity: 'd', coupling: 7 });
  });

  it('d=1_J=7_m=q', () => {
    let result = analyseMultiplet(quadruplet, { frequency: 400 });
    expect(result.j).toHaveLength(2);
  });
});
