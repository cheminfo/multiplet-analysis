import type {
  AnalyseMultipletDebugData,
  AnalyseMultipletDebugStep,
} from './types.ts';

export function appendDebug(
  debugData: AnalyseMultipletDebugData,
  xin: Float64Array,
  yin: Float64Array,
  jStarArray: ArrayLike<number>,
  scalProd: ArrayLike<number>,
  beforeSymSpe?: Float64Array,
) {
  const multiplet: AnalyseMultipletDebugStep['multiplet'] = {
    x: [],
    y: [],
    s: [],
  };

  for (let i = 0; i < xin.length; i++) {
    if (yin[i] !== undefined) {
      multiplet.x.push(xin[i]);
      multiplet.y.push(yin[i]);
      if (!(beforeSymSpe === undefined)) {
        multiplet.s.push(beforeSymSpe[i]);
      }
    }
  }

  const errorFunction: AnalyseMultipletDebugStep['errorFunction'] = {
    x: [],
    y: [],
  };

  for (let i = 0; i < scalProd.length; i++) {
    errorFunction.x.push(jStarArray[i]);
    errorFunction.y.push(scalProd[i]);
  }

  debugData.steps.push({ multiplet, errorFunction });
}
