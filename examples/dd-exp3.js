import doublet from '../data/dd-exp3.json';

import { analyseMultiplet } from '../src/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

//let result = analyseMultiplet(doublet, { frequency: 400, debug: true });
let result = analyseMultiplet(doublet, {
  frequency: 600,
  debug: true,
  takeBestPartMultiplet: true,
});

writeFileSync(
  join(__dirname, 'web', 'result.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);

//console.log(result);
