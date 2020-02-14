export function appendDebug(
  xin,
  yin,
  JStarArray,
  scalProd,
  loopoverJvalues,
  result,
  beforeSymSpe,
) {
  if (!result.debug) {
    result.debug = {
      steps: [],
    };
  }
  const data = {
    x: [],
    y: [],
    s: [],
  };

  let step = {};
  result.debug.steps.push(step);

  for (let i = 0; i < xin.length; i++) {
    if (yin[i] !== undefined) {
      data.x.push(xin[i]);
      data.y.push(yin[i]);
      if (!(typeof beforeSymSpe === 'undefined')) {
        data.s.push(beforeSymSpe[i]);
      }
    }
  }

  step.multiplet = data;

  const data2 = {
    x: [],
    y: [],
  };

  for (let i = 0; i < scalProd.length; i++) {
    data2.x.push(JStarArray[i]);
    data2.y.push(scalProd[i]);
  }

  step.errorFunction = data2;
}
