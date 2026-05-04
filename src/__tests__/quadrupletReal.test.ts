/* eslint vitest/expect-expect: ['error', {assertFunctionNames: ['checkJCoupling']}] */

import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { xFindClosestIndex, xMean } from 'ml-spectra-processing';
import { expect, test } from 'vitest';

import quadruplet from '../../data/quadruplet.json' with { type: 'json' };
import quadrupletWithSatelites from '../../data/quadrupletWithSatelitesAndPhaseProblem.json' with { type: 'json' };
import type { AnalyseMultipletJCoupling } from '../index.ts';
import { analyseMultiplet } from '../index.ts';

expect.extend({ toBeDeepCloseTo });

test('real quadruplet', () => {
  const result = analyseMultiplet(quadruplet, {
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
  });
  checkJCoupling(result.js);
});

test('real quadruplet with satellites', () => {
  const result = analyseMultiplet(quadrupletWithSatelites, {
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
  });
  checkJCoupling(result.js);
});

test('real quadruplet left asymmetric range including satellite', () => {
  const { x, y } = quadrupletWithSatelites;
  const closeIndex = xFindClosestIndex(x, 3.8);
  const result = analyseMultiplet(
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
    },
  );
  checkJCoupling(result.js);
});

test('real quadruplet right asymmetric range including satellite', () => {
  const { x, y } = quadrupletWithSatelites;
  const closeIndex = xFindClosestIndex(x, 3.5);
  const result = analyseMultiplet(
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
    },
  );
  checkJCoupling(result.js);
});

function checkJCoupling(jCoupling: AnalyseMultipletJCoupling[]) {
  expect(jCoupling).toHaveLength(3);

  const meanCoupling = xMean(jCoupling.map((j) => j.coupling));

  expect(meanCoupling).toBeDeepCloseTo(7.05, 1);
}
