import doublet from '../data/dd-exp.json';
import { analyseMultiplet } from '../src/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

let result = analyseMultiplet(doublet, { frequency: 400, debug: true });

writeFileSync(
  join(__dirname, 'web', 'result.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);

//console.log(result);
