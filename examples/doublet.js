import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import doublet from '../data/d=2_J=7_m=d.json';
import { analyseMultiplet } from '../src/index.ts';

let result = analyseMultiplet(doublet, { frequency: 400, debug: true });

writeFileSync(
  join(__dirname, 'web', 'result.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);

//console.log(result);
