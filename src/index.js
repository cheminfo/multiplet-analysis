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
  const { minTestedJ = 0.5 } = options;
  const { minimalResolution = 0.01 } = options;
  var jStar = new Array();
  let result = {};

  // determine if need interpolation
  let resolutionPpm = Math.abs(x[0]-y[x.length-1]) / x.length;
  let resolutionHz = resolutionPpm * frequency;
  // test if interpolation is needed. 
  // if (resolutionHz < minimalResolution) {}
  // if yes interpolate and update x and y

  // recalculate resolution after interpolation
   resolutionPpm = Math.abs(x[0]-y[x.length-1]) / x.length;
   resolutionHz = resolutionPpm * frequency;
   let minTestedPt = Math.trunc(maxTestedJ * resolutionHz);
   let maxTestedPt = Math.trunc(minTestedJ * resolutionHz);
  for (let index = maxTestedPt; index >= minTestedPt; index -= 1) {
    result[index] = 4;
  }
 if (debug) {
  console.log(resolutionHz + " Hz per point");
  console.log("min " + minTestedPt + " in pt");
  console.log("max " + maxTestedPt + " in pt");
}
  
  // we do some complex stuff ...
  result.delta = 7.2;
  result.multiplicity = '';
  result.j = [];
  result.j.push({ multiplicity: 'd', coupling: 7 });
  result.j.push({ multiplicity: 't', coupling: 2 });

  return result;
}
