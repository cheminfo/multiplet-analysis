import { expect, test } from 'vitest';

import { scalarProduct } from '../scalarProduct.ts';

test('scalarProduct', () => {
  const y1 = Float64Array.from([0, 1]);

  expect(scalarProduct(y1, Float64Array.from([0, 1]), 1, 1)).toBe(1);
  expect(scalarProduct(y1, Float64Array.from([1, 0]), 1, 1)).toBe(0);
  expect(scalarProduct(y1, Float64Array.from([0, 1]), -1, 1)).toBe(0);
  expect(scalarProduct(y1, Float64Array.from([1, 0]), -1, 1)).toBe(1);
});
