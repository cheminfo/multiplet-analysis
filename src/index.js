/**
 * Analyse X / Y array and extract multiplicity
 * @param {object} [data={}] An object containing properties x and y
 * @param {object} [options={}] Options (default is empty object)
 * @param {number} [options.frequency=400] Acquisition frequency, default is 400 MHz
 */
export function analyseSignal(data = {}, options = {}) {
  const { x = [], y = [] } = data;
  const { frequency = 400 } = options;
  const { debug = true } = options;
  const { maxTestedJ = 20 } = options;
  const { minTestedJ = 5 } = options;
  const { minimalResolution = 0.01 } = options;
  let scalProd = new Array();
  let result = {};

  //option see if cut is good. (should we cut more or interpolate if cut too close to peak - cause artifacts in both cases)

  // determine if need interpolation
  let resolutionPpm = Math.abs(x[0] - y[x.length - 1]) / x.length;
  let resolutionHz = resolutionPpm * frequency;
  // test if interpolation is needed.
  if (resolutionHz < minimalResolution) {
    // if yes interpolate and update x and y
  }

  // recalculate resolution after interpolation
  resolutionPpm = Math.abs(x[0] - y[x.length - 1]) / x.length;
  resolutionHz = resolutionPpm * frequency;
  let maxTestedPt = Math.trunc(maxTestedJ / resolutionHz);
  let minTestedPt = Math.trunc(minTestedJ / resolutionHz);
  console.log(maxTestedJ);
  // will find center of symetry of the multiplet
  // add zeroes as to make it symetrical if requested... and needed

  // main J-coupling determination
  // not calculated - set to -1
  for (let jStar = 0; jStar < minTestedPt; jStar++) {
    scalProd[jStar] = -1;
  }
  for (let jStar = maxTestedPt; jStar >= minTestedPt; jStar -= 1) {
    scalProd[jStar] = deco(y, jStar);
  }
  if (debug) {
    console.log(`${resolutionHz} Hz per point`);
    console.log(`min ${minTestedPt} in pt`);
    console.log(`max ${maxTestedPt} in pt`);
    console.log(`array ${scalProd} in pt`);
    console.log(`array ${scalProd[0]}${scalProd[6]} in pt`);
  }

  // we do some complex stuff ...
  result.delta = 7.2;
  result.multiplicity = '';
  result.j = [];
  result.j.push({ multiplicity: 'd', coupling: 7 });
  result.j.push({ multiplicity: 't', coupling: 2 });
  return result;
}

function deco(y, JStar) {
  return JStar;
}
