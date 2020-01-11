import doublet from './data/d=2_J=7_m=d.json';
import quadruplet from './data/d=1_J=7_m=q.json';

import { analyseSignal } from '..';

describe('analyseSignal of simulated spectra', () => {
  it.only('d=2_J=7_m=d', () => {
    let result = analyseSignal(doublet, { frequency: 400 });
    expect(result.multiplicity).toBe('');
    expect(result.j[0]).toStrictEqual({ multiplicy: 'd', coupling: 7 });
  });

  it('d=1_J=7_m=q', () => {
    let result = analyseSignal(quadruplet, { frequency: 400 });
    expect(result.j).toHaveLength(2);
  });
});
