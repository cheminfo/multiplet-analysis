/**
 * Analyse X / Y array and extract multiplicity
 * @param {object} [data={}] An object containing properties x and y
 * @param {object} [options={}] Options (default is empty object)
 * @param {number} [options.frequency=400] Acquisition frequency, default is 400 MHz
 */
export function analyseSignal(data = {}, options = {}) {
  const { x = [], y = [] } = data;
  const { frequency = 400 } = options;

  let result = {};

  console.log('I want to debug this');

  // we do some complex stuff ...
  result.delta = 7.2;
  result.multiplicity = '';
  result.j = [];
  result.j.push({ multiplicy: 'd', coupling: 7 });
  result.j.push({ multiplicy: 't', coupling: 2 });

  return result;
}
