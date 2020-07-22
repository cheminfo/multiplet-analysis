import { fft, ifft } from 'fft-js';

export function trigInterpolate(
  x,
  y,
  numberOfPointOutput,
  addPhaseInterpolation,
  appliedPhaseCorrectionType,
) {
  let scale = new Float64Array(numberOfPointOutput);
  let spectrum = new Float64Array(numberOfPointOutput);

  let scaIncrement = (x[x.length - 1] - x[0]) / (x.length - 1); // delta one pt
  //let scaPt = x[0] - scaIncrement / 2; // move to limit side - not middle of first point (half a pt left...)
  let scaPt = x[0]; // move to limit side - not middle of first point (half a pt left...)
  let trueWidth = scaIncrement * x.length;
  let scaIncrementInterp = trueWidth / numberOfPointOutput;
  //scaPt += scaIncrement / 2; // move from limit side to middle of first pt
  // set scale

  for (let i = 0; i < numberOfPointOutput; i++) {
    scale[i] = scaPt;
    scaPt += scaIncrementInterp;
  }

  // interpolate spectrum
  // prepare input for fft apply fftshift
  let nextPowerTwoInput = 2 ** Math.ceil(Math.log2(y.length));
  let nextPowerTwoOut = 2 ** Math.ceil(Math.log2(numberOfPointOutput));

  let an = [...Array(nextPowerTwoInput)].map(() => Array(2).fill(0)); // n x 2 array
  const halfNumPt = Math.floor(y.length / 2); // may ignore last pt... if odd number
  const halfNumPtB = y.length - halfNumPt;
  const shiftMultiplet = nextPowerTwoInput - y.length;
  for (let i = 0; i < halfNumPt; i++) {
    an[shiftMultiplet + i + halfNumPtB][0] = y[i]; //Re
    an[shiftMultiplet + i + halfNumPtB][1] = 0; //Im
  }
  for (let i = 0; i < halfNumPtB; i++) {
    an[i][0] = y[i + halfNumPt]; //Re
    an[i][1] = 0; //Im
  }
  let timeDomain = ifft(an);
  timeDomain[0][0] = timeDomain[0][0] / 2; // divide first point by 2 Re
  timeDomain[0][1] = timeDomain[0][1] / 2; // divide first point by 2 Im
  // move to larger array...
  let timeDomainZeroFilled = [...Array(nextPowerTwoOut)].map(() =>
    Array(2).fill(0),
  ); // n x 2 array
  for (let i = 0; i < halfNumPt; i++) {
    timeDomainZeroFilled[i][0] = timeDomain[i][0]; //* Math.cos((phase / 180) * Math.PI) +
    timeDomainZeroFilled[i][1] = timeDomain[i][1]; //* Math.cos((phase / 180) * Math.PI) -
  }
  for (let i = halfNumPt; i < nextPowerTwoInput; i++) {
    // zero filling
    timeDomainZeroFilled[i][0] = 0;
    timeDomainZeroFilled[i][1] = 0;
  }

  let interpolatedSpectrum = fft(timeDomainZeroFilled);
  const halfNumPt2 = Math.floor(numberOfPointOutput / 2);

  // applies phase change
  let phaseRad = ((addPhaseInterpolation + 0.0) / 180.0) * Math.PI; // this is for testing additional phases
  if (phaseRad !== 0.0) {
    for (let i = 0; i < 2 * halfNumPt2; i++) {
      let tmp =
        interpolatedSpectrum[i][0] * Math.cos(phaseRad) +
        interpolatedSpectrum[i][1] * Math.sin(phaseRad); // only Re now...
      interpolatedSpectrum[i][1] =
        -interpolatedSpectrum[i][0] * Math.sin(phaseRad) +
        interpolatedSpectrum[i][1] * Math.cos(phaseRad); // only Re now...
      interpolatedSpectrum[i][0] = tmp;
    }
  }

  let returnedPhase = 0;
  let norm;
  if (appliedPhaseCorrectionType > 0) {
    for (let i = 1; i < 100; i++) {
      let localPhaseRad = 0;
      let vectx = 0;
      let vecty = 0;
      // sumNorms = 0;
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
          //  sumNorms += norm;
        }
        if (vectx !== 0) {
          localPhaseRad = Math.atan(vecty / vectx);
        } else {
          localPhaseRad = (Math.sign(vecty) * Math.PI) / 2.0;
        }
      }
      norm = Math.sqrt(vecty * vecty + vectx * vectx);
      phaseRad = -(10.0 / (i * i)) * Math.sign(vecty);

      returnedPhase -= (180.0 * phaseRad) / Math.PI;

      if (phaseRad !== 0.0) {
        for (let loop = 0; loop < 2 * halfNumPt2; loop++) {
          let tmp =
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
  let dropPoints = nextPowerTwoOut - numberOfPointOutput;
  for (let i = 0; i < halfNumPt2; i++) {
    spectrum[i] = interpolatedSpectrum[halfNumPt2 + dropPoints + i][0]; // only Re now...
  }
  for (let i = 0; i < halfNumPt2; i++) {
    spectrum[i + halfNumPt2] = interpolatedSpectrum[i][0];
  }
  if (returnedPhase > 360.0) {
    returnedPhase -= 360.0;
  }

  return {
    spectrum,
    scale,
    phaseCorrectionOnMultipletInDeg: returnedPhase,
  };
}
