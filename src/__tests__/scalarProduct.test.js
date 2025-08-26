import { scalarProduct } from '../scalarProduct';

import { test, expect } from 'vitest';

test('scalarProduct', () => {
  expect(scalarProduct([0, 1], [0, 1], 1, 1)).toBe(1);
  expect(scalarProduct([0, 1], [1, 0], 1, 1)).toBe(0);
  expect(scalarProduct([0, 1], [0, 1], -1, 1)).toBe(0);
  expect(scalarProduct([0, 1], [1, 0], -1, 1)).toBe(1);
});
