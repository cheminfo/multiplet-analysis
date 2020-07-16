import FFT from 'fft.js';

//https://www.npmjs.com/package/fft-js
describe('subroutine', () => {
  it('test basic fft from fft.js', () => {
    const pw2 = 2;
    const size = Math.pow(2, pw2);
    const fft = new FFT(size);
    const interlacedData = new Float64Array(size * 2); // array of [r,i,r,i,...]

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < 2; j++) {
        interlacedData[i * 2 + j] = i * 2 + j + 1;
      }
    }

    const output = new Float64Array(size * 2);
    fft.transform(output, interlacedData);

    const inverseOutput = new Float64Array(size * 2);
    fft.inverseTransform(inverseOutput, output);

    expect(inverseOutput).toStrictEqual(interlacedData);
  });
  it('test another basic fft from fft.js', () => {
    const pw2 = 2;
    const size = Math.pow(2, pw2);
    const fft = new FFT(size);
    const interlacedData = new Float64Array(size * 2); // array of [r,i,r,i,...]
    interlacedData[0] = 1;

    const expectedResult = new Float64Array(size * 2);
    for (let i = 0; i < size; i++) {
      expectedResult[i * 2] = 1;
    }

    const output = new Float64Array(size * 2);
    fft.transform(output, interlacedData);

    expect(output).toStrictEqual(expectedResult);
  });
});
