import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import doublet from '../data/dd-exp3.json';
import { analyseMultiplet } from '../src/index.ts';

//let result = analyseMultiplet(doublet, { frequency: 400, debug: true });
let result = analyseMultiplet(doublet, {
  frequency: 600,
  debug: true,
  takeBestPartMultiplet: true,
  appliedPhaseCorrectionType: 1,
});

writeFileSync(
  join(__dirname, 'web', 'result.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);

console.log(result);
