import { measureDeco } from '../measureDeco';

describe('test measureDeco', () => {
  it('first should be', () => {
    //  it.only
    expect(measureDeco([0, 1, 0, 1, 0], 2, 1, 1, 0.5, 1)).toStrictEqual(1);
    expect(measureDeco([0, 1, 0, 1, 0], 3, 1, 1, 0.5, 1)).toStrictEqual(0);
    expect(measureDeco([0, 1, 0, -1, 0], 2, -1, 1, 0.5, 1)).toStrictEqual(1);
  });
});
