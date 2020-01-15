import { FFT } from 'ml-fft';

export function subroutine() {
  var nCols = 4; 
FFT.init(nCols);
var re = new Array(nCols);
var im = new Array(nCols);

for(var i=0; i<nCols; i++){
   re[i] = i;
   im[i] = nCols - i - 1;
}
console.log('Testing FFT.fft and FFT.ifft ');
re=[1, 0, 0, 0];
im=[0, 0, 0, 0];
console.log('in fft ' + re );
console.log('in fft ' + im)
FFT.fft(re, im);
console.log('out fft ' + re + ' should be 1 1 1 1: OK');
console.log('out fft ' + im + ' should be 0 0 0 0: OK');
re=[1, 0, 0, 0];
im=[0, 0, 0, 0];
console.log('in ifft ' + re );
console.log('in ifft ' + im)
FFT.ifft(re, im);
console.log('out ifft ' + re + ' should be 0.25 0.25 0.25 0.25 : OK');
console.log('out ifft ' + im + ' should be 0 0 0 0: OK');


  return 1;
}

// https://github.com/mljs/fft
