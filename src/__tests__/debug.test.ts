import { expect, test } from 'vitest';

import quadruplet from '../../data/d=1_J=7_m=q.json' with { type: 'json' };
import doublet from '../../data/d=2_J=7_m=d.json' with { type: 'json' };
import { analyseMultiplet } from '../index.ts';

test('no debug should not have the debug property', () => {
  const result = analyseMultiplet(doublet, { frequency: 400 });

  expect(result).not.toHaveProperty('debug');
});

test('debug with doublet', () => {
  const result = analyseMultiplet(doublet, { frequency: 400, debug: true });

  expect(result.debug.steps).toHaveLength(2);
});

test('debug with quadruplet and symmetrize', () => {
  const result = analyseMultiplet(quadruplet, {
    frequency: 400,
    symmetrizeEachStep: true,
    debug: true,
  });

  expect(result.debug.steps).toHaveLength(4);
});
