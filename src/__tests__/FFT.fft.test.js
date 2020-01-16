import { FFT } from 'ml-fft';

describe('subroutine', () => {
  it('test basic fft ', () => {
    var re = new Array(4);
    var im = new Array(4);
    for (var i = 0; i < 4; i++) {
      re[i] = i;
      im[i] = 4 - i - 1;
    }
    console.log('in-fft ' + re);
    FFT.init(4);
    FFT.fft(re, im);
    console.log('out-fft ' + re + ' should be 1 1 1 1 after FT');
    re = [1, 0, 0, 0];
    im = [0, 0, 0, 0];
    console.log('in fft ' + re);
    console.log('in fft ' + im);
    FFT.fft(re, im);
    console.log('out fft ' + re + ' should be 1 1 1 1 after FT');
    console.log('out fft ' + im + ' should be 0 0 0 0 after FT: ');
    re = [1, 0, 0, 0];
    im = [0, 0, 0, 0];
    console.log('in ifft ' + re);
    console.log('in ifft ' + im);
    FFT.ifft(re, im);
    console.log('out ifft ' + re + ' should be 0.25 0.25 0.25 0.25 ');
    console.log('out ifft ' + im + ' should be 0 0 0 0: OK');

    /*
      it('Test nmredata read async', async () => {
        var nr = await readNMRR(zipBrukerSeveralSDF);
        var sdfFileList = nr.getSDFList();
        expect(6).toBe(sdfFileList.length);
        expect(sdfFileList[nr.activeElement]).toBe(sdfFileList[0]);
      });
      it('Test nmredata read sync', () => {
        var nr = readNMRRSync(resolve('testFiles/menthol_1D_1H_assigned_J.zip'));
        var sdfFileList = nr.getSDFList();
        expect(6).toBe(sdfFileList.length);
        expect(sdfFileList[nr.activeElement]).toBe(sdfFileList[0]);
      });
      it('nmrRecord with jcamp, sync reading', () => {
*/
    re = [1, 0, 0, 0];
    im = [0, 0, 0, 0];
    /* FFT.fft(re, im);
    FFT.ifft(re, im);
    expect(re).toStrictEqual([1, 0, 0, 0]);
    expect(im).toStrictEqual([0, 0, 0, 0]);*/

    console.log('array ' + re);

    FFT.fft(re, im); // LP: re is left untouched...
    console.log('out fft ' + re + ' should be 1 1 1 1 ');
    console.log('out fft ' + re + ' should be 0 0 0 0 ');

    expect(re).toStrictEqual([1, 1, 1, 1]);
    expect(im).toStrictEqual([0, 0, 0, 0]);
    //expect(subroutine()).toBe([1]);
  });
});

/* matlab output fft and ifft
>> fft([1 0 0 0])
ans =    1     1     1     1
>> ifft([1 0 0 0])
ans =  0.2500    0.2500    0.2500    0.2500
*/
