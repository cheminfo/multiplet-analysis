import { expect, test } from 'vitest';

import { deco } from '../deco.ts';

test('first should be', () => {
  expect(Array.from(deco(Float64Array.from([0, 1, 1, 0, 0]), 1))).toStrictEqual(
    [0, 1, 0, 0],
  );
  expect(Array.from(deco(Float64Array.from([0, 1, 0, 1, 0]), 2))).toStrictEqual(
    [0, 1, 0],
  );
  expect(
    Array.from(deco(Float64Array.from([0, 1, 0, 1, 0]), 2, 1)),
  ).toStrictEqual([0, 1, 0]);
  expect(
    Array.from(deco(Float64Array.from([0, 1, 0, 1, 0]), 2, 1, 1)),
  ).toStrictEqual([0, 1, 0]);
  expect(
    Array.from(deco(Float64Array.from([0, 1, 0, 1, 0]), 2, 1, -1)),
  ).toStrictEqual([0, 1, 0]);
  expect(
    Array.from(deco(Float64Array.from([0, 1, 0, 1, 0]), 2, 1, 0.1)),
  ).toStrictEqual([0, 1, 0]);
  expect(
    Array.from(deco(Float64Array.from([0, 1, 0, 1, 0]), 2, 1, 0)),
  ).toStrictEqual([0, 1, 0]);
  expect(
    Array.from(deco(Float64Array.from([0, 1, 0, -1, 0]), 2, -1)),
  ).toStrictEqual([0, 1, 0]);
});
