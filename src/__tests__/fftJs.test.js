import { fft, ifft } from 'fft-js';

//https://www.npmjs.com/package/fft-js
describe('subroutine', () => {
  it('test basic fft from fft-js', () => {
    const pw2 = 3;
    const si = Math.pow(2, pw2);
    let an = [...Array(si / 2)].map((x) => Array(2).fill(0)); // n x 2 array
    let te = [...Array(si / 2)].map((x) => Array(2).fill(0));

    for (let i = 0; i < si / 2; i++) {
      for (let j = 0; j < 2; j++) {
        //an[i] = Math.random ;
        an[i][j] = i * 2 + j + 1;
        //an[i][j] = 1;
      }
    }
    //console.log(`in-fft  ${an}`); //there is no inplace ifft!!!!!!!!
    /*an = fftInPlace(an);
    an = ifftInPlace(an); */

    let out = fft(an);
    let out2 = ifft(out);
    //console.log(`out2 ifft(fft) ${out2}`);
    //console.log(`si: ${si}`);
    expect(out2).toStrictEqual(an);

    for (let i = 0; i < si / 2; i++) {
      for (let j = 0; j < 2; j++) {
        //re[i] = + 1 Math.random * 10;
        an[i][j] = 0;
        te[i][j] = 1 - j;
        //re[i][j] = 1;
      }
    }
    an[0][0] = 1;
    //console.log(`in fftInPlace ${an} should be 1 1 1 1 after FT`);
    let out3 = fft(an);

    //fftInPlace(an);//??
    //console.log(
    //// `out fftInPlace ${out3} should be 1 0 1 0 1 0 1 0 (Re, Im, ...)`,
    //);
    expect(out3).toStrictEqual(te);
  });
});

/* matlab output fft and ifft
>> fft([1 0 0 0])
ans =    1     1     1     1
>> ifft([1 0 0 0])
ans =  0.2500    0.2500    0.2500    0.2500
*/
