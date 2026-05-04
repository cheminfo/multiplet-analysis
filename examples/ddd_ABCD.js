import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import ddd from '../data/d=1_J=2,4,6_m=ddd_ABCD.json';
import { analyseMultiplet } from '../src/index.ts';

let result = analyseMultiplet(ddd, {
  frequency: 400,
  symmetrizeEachStep: true,
  takeBestPartMultiplet: true,
  debug: true,
});

writeFileSync(
  join(__dirname, 'web', 'result.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);
