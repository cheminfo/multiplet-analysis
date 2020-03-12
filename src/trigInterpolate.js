import { fft, ifft } from 'fft-js';

export function trigInterpolate(
  x,
  y,
  numberOfPointOutput,
  addPhaseInterpolation,
  appliedPhaseCorrectionType,
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
  const shiftMultiplet = nextPowerTwoInput - y.length;
  for (let loop = 0; loop < halfNumPt; loop++) {
    an[shiftMultiplet + loop + halfNumPtB][0] = y[loop]; //Re
    an[shiftMultiplet + loop + halfNumPtB][1] = 0; //Im
  }
  for (let loop = 0; loop < halfNumPtB; loop++) {
    an[loop][0] = y[loop + halfNumPt]; //Re
    an[loop][1] = 0; //Im
  }

  let timeDomain = ifft(an);
  /*an = fft(out);
  for (let loop = 0; loop < 2 * halfNumPt; loop++) {
    an[loop][1] = 0; //* Math.cos((phase / 180) * Math.PI) -
  }
  out = ifft(an);*/

  timeDomain[0][0] = timeDomain[0][0] / 2; // divide first point by 2 Re
  timeDomain[0][1] = timeDomain[0][1] / 2; // divide first point by 2 Im
  // move to larger array...
  let timeDomainZeroFilled = [...Array(numberOfPointOutput)].map(() =>
    Array(2).fill(0),
  ); // n x 2 array
  for (let loop = 0; loop < halfNumPt; loop++) {
    timeDomainZeroFilled[loop][0] = timeDomain[loop][0]; //* Math.cos((phase / 180) * Math.PI) +
    timeDomainZeroFilled[loop][1] = timeDomain[loop][1]; //* Math.cos((phase / 180) * Math.PI) -
  }

  for (let loop = halfNumPt; loop < numberOfPointOutput; loop++) {
    // zero filling
    timeDomainZeroFilled[loop][0] = 0;
    timeDomainZeroFilled[loop][1] = 0;
  }
  let interpolatedSpectrum = fft(timeDomainZeroFilled);
  const halfNumPt2 = Math.floor(numberOfPointOutput / 2);
  let tmp;
  // applies phase correction
  let phaseRad = ((addPhaseInterpolation + 0.0) / 180.0) * Math.PI;
  if (phaseRad !== 0.0) {
    for (let loop = 0; loop < 2 * halfNumPt2; loop++) {
      tmp =
        interpolatedSpectrum[loop][0] * Math.cos(phaseRad) +
        interpolatedSpectrum[loop][1] * Math.sin(phaseRad); // only Re now...
      interpolatedSpectrum[loop][1] =
        -interpolatedSpectrum[loop][0] * Math.sin(phaseRad) +
        interpolatedSpectrum[loop][1] * Math.cos(phaseRad); // only Re now...
      interpolatedSpectrum[loop][0] = tmp;
    }
  }
  let returnedPhase = 0;

  if (appliedPhaseCorrectionType > 0) {
    let localPhaseRad = 0;
    let vectx;
    let vecty;
    let norm;
    let sumNorms = 0;

    for (let loo = 1; loo < 100; loo++) {
      localPhaseRad = 0;
      vectx = 0;
      vecty = 0;
      norm;
      sumNorms = 0;
      if (appliedPhaseCorrectionType > 0) {
        // if ( true ) {
        for (let loop = 0; loop < 2 * halfNumPt2; loop++) {
          if (interpolatedSpectrum[loop][0] !== 0) {
            localPhaseRad = Math.atan(
              interpolatedSpectrum[loop][1] / interpolatedSpectrum[loop][0],
            );
          } else {
            localPhaseRad =
              (Math.sign(interpolatedSpectrum[loop][1]) * Math.PI) / 2.0;
          }
          norm = Math.sqrt(
            interpolatedSpectrum[loop][1] * interpolatedSpectrum[loop][1] +
              interpolatedSpectrum[loop][0] * interpolatedSpectrum[loop][0],
          );
          vectx += Math.cos(localPhaseRad) * norm;
          vecty += Math.sin(localPhaseRad) * norm;
          sumNorms += norm;
        }
        if (vectx !== 0) {
          localPhaseRad = Math.atan(vecty / vectx);
        } else {
          localPhaseRad = (Math.sign(vecty) * Math.PI) / 2.0;
        }
      }
      norm = Math.sqrt(vecty * vecty + vectx * vectx);
      phaseRad = -(10.0 / (loo * loo)) * Math.sign(vecty);

      returnedPhase -= (180.0 * phaseRad) / Math.PI;

     // console.log('localPhase ' + (180.0 * localPhaseRad) / Math.PI);
      //console.log('returnedPhase ' + returnedPhase);
    


      if (phaseRad !== 0.0) {
        for (let loop = 0; loop < 2 * halfNumPt2; loop++) {
          tmp =
            interpolatedSpectrum[loop][0] * Math.cos(phaseRad) +
            interpolatedSpectrum[loop][1] * Math.sin(phaseRad); // only Re now...
          interpolatedSpectrum[loop][1] =
            -interpolatedSpectrum[loop][0] * Math.sin(phaseRad) +
            interpolatedSpectrum[loop][1] * Math.cos(phaseRad); // only Re now...
          interpolatedSpectrum[loop][0] = tmp;
        }
      }
    }
  }

  // applies fftshift
  for (let loop = 0; loop < halfNumPt2; loop++) {
    spe[loop] = interpolatedSpectrum[loop + halfNumPt2][0]; // only Re now...
  }
  for (let loop = 0; loop < halfNumPt2; loop++) {
    spe[loop + halfNumPt2] = interpolatedSpectrum[loop][0];
  }
  if (returnedPhase > 360.0) {
    returnedPhase -= 360.0;
  }
  return {
    spectrum: spe,
    scale: sca,
    phaseCorrectionOnMultipletInHz: returnedPhase,
  };
}
