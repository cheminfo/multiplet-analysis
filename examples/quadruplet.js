import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import quadruplet from '../data/d=1_J=7_m=q.json';
import { analyseMultiplet } from '../src/index.ts';

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
