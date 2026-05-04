import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import mult from '../data/asymDoublet.json';
import { analyseMultiplet } from '../src/index.ts';

let result = analyseMultiplet(mult, {
  frequency: 500,
  symmetrizeEachStep: true,
  takeBestPartMultiplet: true,
  debug: true,
  minimalResolution: 0.01,
});

writeFileSync(
  join(__dirname, 'web', 'multiplet-analisys-toDebbug.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);
