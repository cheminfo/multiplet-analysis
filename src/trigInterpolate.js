import { fft, ifft } from 'fft-js';

export function trigInterpolate(
  x,
  y,
  numberOfPointOutput,
  addPhaseInterpolation,
) {
  let sca = Array(numberOfPointOutput);
  let spe = Array(numberOfPointOutput);

  let scaIncrement = (x[x.length - 1] - x[0]) / (x.length - 1); // delta one pt
  //let scaPt = x[0] - scaIncrement / 2; // move to limit side - not middle of first point (half a pt left...)
  let scaPt = x[0]; // move to limit side - not middle of first point (half a pt left...)
  let trueWidth = scaIncrement * x.length;
  scaIncrement = trueWidth / numberOfPointOutput;
  //scaPt += scaIncrement / 2; // move from limit side to middle of first pt
  // set scale

  for (let loop = 0; loop < numberOfPointOutput; loop++) {
    sca[loop] = scaPt;
    scaPt += scaIncrement;
  }

  // interpolate spectrum
  // prepare input for fft apply fftshift
  let nextPowerTwoInput = Math.pow(
    2,
    Math.round(Math.log(y.length - 1) / Math.log(2.0) + 0.5),
  );
  //nextPowerTwoAn = Math.pow(2, Math.ceil(Math.log(y.length) / Math.log(2)));
  let an = [...Array(nextPowerTwoInput)].map(() => Array(2).fill(0)); // n x 2 array
  const halfNumPt = Math.floor(y.length / 2); // may ignore last pt... if odd number
  const halfNumPtB = y.length - halfNumPt;
  const shiftMult = nextPowerTwoInput - y.length;
  for (let loop = 0; loop < halfNumPt; loop++) {
    an[shiftMult + loop + halfNumPtB][0] = y[loop]; //Re
    an[shiftMult + loop + halfNumPtB][1] = 0; //Im
  }
  for (let loop = 0; loop < halfNumPtB; loop++) {
    an[loop][0] = y[loop + halfNumPt]; //Re
    an[loop][1] = 0; //Im
  }

  let out = ifft(an);

  out[0][0] = out[0][0] / 2; // divide first point by 2 Re
  out[0][1] = out[0][1] / 2; // divide first point by 2 Im
  // move to larger array...
  let an2 = [...Array(numberOfPointOutput)].map(() => Array(2).fill(0)); // n x 2 array
  for (let loop = 0; loop < halfNumPt; loop++) {
    an2[loop][0] = out[loop][0]; //* Math.cos((phase / 180) * Math.PI) +
    an2[loop][1] = out[loop][1]; //* Math.cos((phase / 180) * Math.PI) -
  }

  for (let loop = halfNumPt; loop < numberOfPointOutput; loop++) {
    // zero filling
    an2[loop][0] = 0;
    an2[loop][1] = 0;
  }
  let out2 = fft(an2);
  const halfNumPt2 = Math.floor(numberOfPointOutput / 2);
  
  // applies fftshift
  let phase = addPhaseInterpolation;
  for (let loop = 0; loop < halfNumPt2; loop++) {
    //spe[loop] = out2[loop + halfNumPt2][0]; // only Re now...
    spe[loop] =
      out2[loop + halfNumPt2][0] * Math.cos((phase / 180) * Math.PI) +
      out2[loop + halfNumPt2][1] * Math.sin((phase / 180) * Math.PI); // only Re now...
  }
  for (let loop = 0; loop < halfNumPt2; loop++) {
    //spe[loop + halfNumPt2] = out2[loop][0]; // only Re now...
    spe[loop + halfNumPt2] =
      out2[loop][0] * Math.cos((phase / 180) * Math.PI) +
      out2[loop][1] * Math.sin((phase / 180) * Math.PI); // only Re now...
  }

  return { spectrum: spe, scale: sca };
}
