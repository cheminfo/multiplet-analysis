import doublet from '../../data/d=2_J=7_m=d.json';
import quadruplet from '../../data/d=1_J=7_m=q.json';

import { analyseMultiplet } from '..';

describe('analyse multiplet of simulated spectra', () => {
  it('d=2_J=7_m=d', () => {
    // was it.only
    let result = analyseMultiplet(doublet, { frequency: 400 });
    //expect(result.multiplicity).toBe('');
    //expect(result.j[0]).toStrictEqual({ multiplicity: 'd', coupling: 7 });
    expect(result.j[0].coupling).toBeCloseTo(7, 1); // one decimal at low resolution (no interpolation)
    expect(result.j[0].multiplicity).toStrictEqual('d');
    expect(result.j).toHaveLength(1);
  });

  it('d=1_J=7_m=q2', () => {
    //let result = analyseMultiplet(quadruplet, { frequency: 400, minimalResolution: 0.01});
    let result = analyseMultiplet(quadruplet, { frequency: 400 , minimalResolution: 0.1});
    expect(result.j[0].coupling).toBeCloseTo(7, 1); // one decimal at low resolution (no interpolation)
    expect(result.j[1].coupling).toBeCloseTo(7, 0); // no decimal at low resolution (no interpolation)
    expect(result.j[2].coupling).toBeCloseTo(7, 0); // no decimal at low resolution (no interpolation)
   // expect(result.j).toHaveLength(3);
  });

});
