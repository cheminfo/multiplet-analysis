import ddd from '../data/d=1_J=2,4,6_m=ddd.json';
import { analyseMultiplet } from '../src/index.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

//let result = analyseMultiplet(ddd, { frequency: 400, debug: true , symmetrizeEachStep: true });
//let result = analyseMultiplet(ddd, { frequency: 400, debug: true , symmetrizeEachStep: false });
//let result = analyseMultiplet(ddd, { frequency: 400, debug: true , symmetrizeEachStep: false , takeBestPartMultiplet : true});
//let result = analyseMultiplet(ddd, { frequency: 400, debug: true , symmetrizeEachStep: true , takeBestPartMultiplet : true});

//let result = analyseMultiplet(ddd, { frequency: 400, debug: true });
let result = analyseMultiplet(ddd, {
  frequency: 400,
  debug: true,
  minimalResolution: 0.001,
});

//let result = analyseMultiplet(ddd, { frequency: 400, debug: true , addPhaseInterpolation: 30, interpolate : 0.004});
//let result = analyseMultiplet(ddd, { frequency: 400, debug: true , addPhaseInterpolation: 30, interpolate : 0.004, takeBestPartMultiplet : true});

writeFileSync(
  join(__dirname, 'web', 'result.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);
