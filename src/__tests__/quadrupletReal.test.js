import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { xFindClosestIndex, xMean } from 'ml-spectra-processing';

import { analyseMultiplet } from '..';
import quadruplet from '../../data/quadruplet.json';
import quadrupletWithSatelites from '../../data/quadrupletWithSatelitesAndPhaseProblem.json';

expect.extend({ toBeDeepCloseTo });

test('real quadruplet', () => {
  let result = analyseMultiplet(quadruplet, {
    frequency: 600.16,
    minimalResolution: 0.3,
    maxTestedJ: 9,
    minTestedJ: 1,
    critFoundJ: 0.75,
    takeBestPartMultiplet: true,
    correctVerticalOffset: true,
    symmetrizeEachStep: false,
    decreasingJvalues: true,
    makeShortCutForSpeed: true,
    debug: true,
  });
  checkJCoupling(result.js);
});

test('real quadruplet with satellites', () => {
  let result = analyseMultiplet(quadrupletWithSatelites, {
    frequency: 600.16,
    minimalResolution: 0.3,
    maxTestedJ: 9,
    minTestedJ: 5,
    critFoundJ: 0.75,
    takeBestPartMultiplet: true,
    correctVerticalOffset: true,
    symmetrizeEachStep: true,
    decreasingJvalues: false,
    makeShortCutForSpeed: true,
    debug: true,
  });
  checkJCoupling(result.js);
});

test('real quadruplet left asymmetric range including satellite', () => {
  const { x, y } = quadrupletWithSatelites;
  const closeIndex = xFindClosestIndex(x, 3.8);
  let result = analyseMultiplet(
    {
      x: x.slice(0, closeIndex),
      y: y.slice(0, closeIndex),
    },
    {
      frequency: 600.16,
      minimalResolution: 0.3,
      maxTestedJ: 9,
      minTestedJ: 5,
      critFoundJ: 0.75,
      takeBestPartMultiplet: true,
      correctVerticalOffset: true,
      symmetrizeEachStep: true,
      decreasingJvalues: false,
      makeShortCutForSpeed: true,
      debug: true,
    },
  );
  checkJCoupling(result.js);
});

test('real quadruplet right asymmetric range including satellite', () => {
  const { x, y } = quadrupletWithSatelites;
  const closeIndex = xFindClosestIndex(x, 3.5);
  let result = analyseMultiplet(
    {
      x: x.slice(closeIndex),
      y: y.slice(closeIndex),
    },
    {
      frequency: 600.16,
      minimalResolution: 0.3,
      maxTestedJ: 9,
      minTestedJ: 5,
      critFoundJ: 0.75,
      takeBestPartMultiplet: true,
      correctVerticalOffset: true,
      symmetrizeEachStep: false,
      decreasingJvalues: false,
      makeShortCutForSpeed: true,
      debug: true,
    },
  );
  checkJCoupling(result.js);
});

function checkJCoupling(jCoupling) {
  expect(jCoupling).toHaveLength(3);
  const meanCoupling = xMean(jCoupling.map((j) => j.coupling));
  expect(meanCoupling).toBeDeepCloseTo(7.05, 1);
}
