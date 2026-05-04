import { expect, test } from 'vitest';

import { getGeneralPascal } from '../getGeneralPascal.ts';

test('should generate pascal triangle', () => {
  expect(getGeneralPascal(0)).toStrictEqual([1]);
  expect(getGeneralPascal(1)).toStrictEqual([1, 1]);
  expect(getGeneralPascal(2)).toStrictEqual([1, 2, 1]);
  expect(getGeneralPascal(3)).toStrictEqual([1, 3, 3, 1]);
  expect(getGeneralPascal(4)).toStrictEqual([1, 4, 6, 4, 1]);
  expect(getGeneralPascal(0, 1)).toStrictEqual([1]);
  expect(getGeneralPascal(1, 1)).toStrictEqual([1, 1, 1]); // coupling to a spin 1
  expect(getGeneralPascal(2, 1)).toStrictEqual([1, 2, 3, 2, 1]);
  expect(getGeneralPascal(3, 1)).toStrictEqual([1, 3, 6, 7, 6, 3, 1]);
  expect(getGeneralPascal(1, 1.5)).toStrictEqual([1, 1, 1, 1]); // coupling to a spin 3/2
  expect(getGeneralPascal(1, 2)).toStrictEqual([1, 1, 1, 1, 1]); // coupling to a spin 2
});
