import quadruplet from '../data/d=1_J=7_m=q.json';
import { analyseMultiplet } from '../src/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

//let result = analyseMultiplet(quadruplet, { frequency: 400, debug: true });
//let result = analyseMultiplet(quadruplet, { frequency: 400, debug: true, symmetrizeEachStep: true});
//let result = analyseMultiplet(quadruplet, { frequency: 400, debug: true , symmetrizeEachStep: true , takeBestPartMultiplet : true});
let result = analyseMultiplet(quadruplet, {
  frequency: 400,
  debug: true,
  symmetrizeEachStep: true,
});

writeFileSync(
  join(__dirname, 'web', 'result.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);
