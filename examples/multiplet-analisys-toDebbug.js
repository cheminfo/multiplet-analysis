import { writeFileSync } from 'fs';
import { join } from 'path';

import mult from '../data/multiplet-analisys-toDebbug.json';
import { analyseMultiplet } from '../src/index';

let result = analyseMultiplet(mult, {
  frequency: 500,
  symmetrizeEachStep: true,
  takeBestPartMultiplet: false,
  debug: true,
});

writeFileSync(
  join(__dirname, 'web', 'multiplet-analisys-toDebbug.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);
