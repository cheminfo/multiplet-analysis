import { scalarProduct } from '../scalarProduct';

describe('scalarProduct', () => {
  it('test', () => {
    //  it.only
    expect(scalarProduct([0, 1], [0, 1], 1, 1)).toStrictEqual(1);
    expect(scalarProduct([0, 1], [1, 0], 1, 1)).toStrictEqual(0);
    expect(scalarProduct([0, 1], [0, 1], -1, 1)).toStrictEqual(0);// flip left-right
    expect(scalarProduct([0, 1], [1, 0], -1, 1)).toStrictEqual(1);// flip left-right
  });
});
