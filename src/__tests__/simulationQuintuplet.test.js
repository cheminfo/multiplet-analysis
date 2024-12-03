import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { signalsToXY } from 'nmr-processing';

import { analyseMultiplet } from '../index';

expect.extend({ toBeDeepCloseTo });

test('', () => {
  const signalCouplings = [
    { atoms: [2], coupling: 10.1 },
    { atoms: [3], coupling: 6.12317 },
    { atoms: [4], coupling: 6.12317 },
    { atoms: [8], coupling: 4.2 },
    { atoms: [5, 9], coupling: 4.12317 },
    { atoms: [6], coupling: 2.12317 },
    { atoms: [7], coupling: 1.12317 },
  ];
  const spectrum = signalsToXY(
    [
      {
        atoms: [1],
        delta: 1.1,
        js: signalCouplings,
      },
      {
        atoms: [2],
        delta: 1.4,
        js: [{ atoms: [3], coupling: 2 }],
      },
      {
        atoms: [3],
        delta: 5.0,
        js: [],
      },
      {
        atoms: [4],
        delta: 7.0,
        js: [],
      },
      {
        atoms: [5],
        delta: 9.0,
        js: [],
      },
      {
        atoms: [6],
        delta: 11.0,
        js: [],
      },
      {
        atoms: [7],
        delta: 13.0,
        js: [],
      },
      {
        atoms: [8],
        delta: 15.0,
        js: [],
      },
      {
        atoms: [9],
        delta: 15.0,
        js: [],
      },
    ],
    { from: 1.05, to: 1.15, nbPoints: 1024 },
  );

  let result = analyseMultiplet(spectrum, {
    frequency: 400,
    debug: true,
    minimalResolution: 0.1,
    critFoundJ: 0.85,
    decreasingJvalues: true,
    maxTestedJ: 11,
    minTestedJ: 1,
    symmetrizeEachStep: true,
    takeBestPartMultiplet: true,
  });

  expect(result.js).toHaveLength(7);
  expect(result.js.map((j) => j.coupling)).toBeDeepCloseTo(
    signalCouplings.map((j) => j.coupling),
    0,
  );
});
