import { deco } from '../deco';

describe('check deco', () => {
  it('first should be', () => {
    //  it.only
    expect(Array.from(deco([0, 1, 1, 0, 0], 1))).toStrictEqual([0, 1, 0, 0]);
    expect(Array.from(deco([0, 1, 0, 1, 0], 2))).toStrictEqual([0, 1, 0]);
    expect(Array.from(deco([0, 1, 0, 1, 0], 2, 1))).toStrictEqual([0, 1, 0]);
    expect(Array.from(deco([0, 1, 0, 1, 0], 2, 1, 1))).toStrictEqual([0, 1, 0]);
    expect(Array.from(deco([0, 1, 0, 1, 0], 2, 1, -1))).toStrictEqual([
      0, 1, 0,
    ]);
    expect(Array.from(deco([0, 1, 0, 1, 0], 2, 1, 0.1))).toStrictEqual([
      0, 1, 0,
    ]);
    expect(Array.from(deco([0, 1, 0, 1, 0], 2, 1, 0))).toStrictEqual([0, 1, 0]);
    expect(Array.from(deco([0, 1, 0, -1, 0], 2, -1))).toStrictEqual([0, 1, 0]);
  });
});
