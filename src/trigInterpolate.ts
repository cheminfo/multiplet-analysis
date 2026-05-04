import FFT from 'fft.js';

export function trigInterpolate(
  x: Float64Array,
  y: Float64Array,
  numberOfPointOutput: number,
  addPhaseInterpolation: number,
  appliedPhaseCorrectionType = 0,
) {
  const scale = new Float64Array(numberOfPointOutput);
  const spectrum = new Float64Array(numberOfPointOutput);

  const scaIncrement = ((x.at(-1) as number) - x[0]) / (x.length - 1); // delta one pt
  let scaPt = x[0]; // move to limit side - not middle of first point (half a pt left...)
  const trueWidth = scaIncrement * x.length;
  const scaIncrementInterp = trueWidth / numberOfPointOutput;

  for (let i = 0; i < numberOfPointOutput; i++) {
    scale[i] = scaPt;
    scaPt += scaIncrementInterp;
  }

  // interpolate spectrum
  // prepare input for fft apply fftshift
  const nextPowerTwoInput = 2 ** Math.ceil(Math.log2(y.length));
  const nextPowerTwoOut = 2 ** Math.ceil(Math.log2(numberOfPointOutput));

  const fft = new FFT(nextPowerTwoInput);
  const an = fft.createComplexArray();
  const halfNumPt = Math.floor(y.length / 2); // may ignore last pt... if odd number
  const halfNumPtB = y.length - halfNumPt;
  const shiftMultiplet = nextPowerTwoInput - y.length;
  for (let i = 0; i < halfNumPt; i++) {
    an[(shiftMultiplet + i + halfNumPtB) * 2] = y[i];
  }
  for (let i = 0; i < halfNumPtB; i++) {
    an[i * 2] = y[i + halfNumPt];
  }
  const timeDomain = fft.createComplexArray();
  fft.inverseTransform(timeDomain, an);
  timeDomain[0] /= 2; // divide first point by 2 Re
  timeDomain[1] /= 2; // divide first point by 2 Im

  // move to larger array...
  const fft2 = new FFT(nextPowerTwoOut);
  const timeDomainZeroFilled = fft2.createComplexArray();
  for (let i = 0; i < halfNumPt * 2; i++) {
    timeDomainZeroFilled[i] = timeDomain[i]; //* Math.cos((phase / 180) * Math.PI)
  }

  const interpolatedSpectrum = fft2.createComplexArray();
  fft2.transform(interpolatedSpectrum, timeDomainZeroFilled);

  const halfNumPt2 = Math.floor(numberOfPointOutput / 2);

  // applies phase change
  let phaseRad = ((addPhaseInterpolation + 0) / 180) * Math.PI; // this is for testing additional phases
  if (phaseRad !== 0) {
    for (let i = 0; i < 2 * halfNumPt2; i++) {
      const tmp =
        interpolatedSpectrum[i * 2] * Math.cos(phaseRad) +
        interpolatedSpectrum[i * 2 + 1] * Math.sin(phaseRad); // only Re now...
      interpolatedSpectrum[i * 2 + 1] =
        -interpolatedSpectrum[i * 2] * Math.sin(phaseRad) +
        interpolatedSpectrum[i * 2 + 1] * Math.cos(phaseRad); // only Re now...
      interpolatedSpectrum[i * 2] = tmp;
    }
  }

  let returnedPhase = 0;
  let norm;
  if (appliedPhaseCorrectionType > 0) {
    for (let i = 1; i < 100; i++) {
      let localPhaseRad = 0;
      let vectx = 0;
      let vecty = 0;
      if (appliedPhaseCorrectionType > 0) {
        for (let loop = 0; loop < 2 * halfNumPt2; loop++) {
          if (interpolatedSpectrum[loop * 2] !== 0) {
            localPhaseRad = Math.atan(
              interpolatedSpectrum[loop * 2 + 1] /
                interpolatedSpectrum[loop * 2],
            );
          } else {
            localPhaseRad =
              (Math.sign(interpolatedSpectrum[loop * 2 + 1]) * Math.PI) / 2;
          }
          norm = Math.sqrt(
            interpolatedSpectrum[loop * 2 + 1] *
              interpolatedSpectrum[loop * 2 + 1] +
              interpolatedSpectrum[loop * 2] * interpolatedSpectrum[loop * 2],
          );
          vectx += Math.cos(localPhaseRad) * norm;
          vecty += Math.sin(localPhaseRad) * norm;
        }
        if (vectx !== 0) {
          localPhaseRad = Math.atan(vecty / vectx);
        } else {
          localPhaseRad = (Math.sign(vecty) * Math.PI) / 2;
        }
      }
      norm = Math.hypot(vecty, vectx);
      phaseRad = -(10 / (i * i)) * Math.sign(vecty);

      returnedPhase -= (180 * phaseRad) / Math.PI;

      if (phaseRad !== 0) {
        for (let loop = 0; loop < 2 * halfNumPt2; loop++) {
          const tmp =
            interpolatedSpectrum[loop * 2] * Math.cos(phaseRad) +
            interpolatedSpectrum[loop * 2 + 1] * Math.sin(phaseRad); // only Re now...
          interpolatedSpectrum[loop * 2 + 1] =
            -interpolatedSpectrum[loop * 2] * Math.sin(phaseRad) +
            interpolatedSpectrum[loop * 2 + 1] * Math.cos(phaseRad); // only Re now...
          interpolatedSpectrum[loop * 2] = tmp;
        }
      }
    }
  }

  // applies fftshift
  const dropPoints = nextPowerTwoOut - numberOfPointOutput;
  for (let i = 0; i < halfNumPt2; i++) {
    spectrum[i] = interpolatedSpectrum[(halfNumPt2 + dropPoints + i) * 2]; // only Re now...
  }
  for (let i = 0; i < halfNumPt2; i++) {
    spectrum[i + halfNumPt2] = interpolatedSpectrum[i * 2];
  }
  if (returnedPhase > 360) {
    returnedPhase -= 360;
  }

  return {
    spectrum,
    scale,
    phaseCorrectionOnMultipletInDeg: returnedPhase,
  };
}
