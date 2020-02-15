import { writeFileSync } from 'fs';
import { join } from 'path';
import { SpinSystem, simulate1D } from 'nmr-simulation';

// a prediction should contain only once the couplings

const prediction = [
  {
    atomIDs: [1],
    delta: 1.1,
    j: [
      { assignment: [2], coupling: 10.1 },
      { assignment: [3], coupling: 9.97 },
      { assignment: [4], coupling: 8.7 },
      { assignment: [5], coupling: 5.12317 },
      { assignment: [6], coupling: 5.01317 },
      { assignment: [7], coupling: 1.12317 },
      { assignment: [8], coupling: 4.2 },
    ],
  },
  {
    atomIDs: [2],
    delta: 3.0,
    j: [{ assignment: [3], coupling: 2 }],
  },
  {
    atomIDs: [3],
    delta: 5.0,
  },
  {
    atomIDs: [4],
    delta: 7.0,
  },
  {
    atomIDs: [5],
    delta: 9.0,
  },
  {
    atomIDs: [6],
    delta: 11.0,
  },
  {
    atomIDs: [7],
    delta: 13.0,
  },
  {
    atomIDs: [8],
    delta: 15.0,
  },
];

const options1h = {
  frequency: 400,
  from: 1,
  to: 1.2,
  lineWidth: 1,
  nbPoints: 4096,
  maxClusterSize: 9,
  output: 'xy',
};

const spinSystem = SpinSystem.fromPrediction(prediction);
spinSystem.ensureClusterSize(options1h);
const spectrum = simulate1D(spinSystem, options1h);

writeFileSync(
  join(__dirname, 'web-simulated', 'simulated2.json'),
  JSON.stringify(spectrum),
  'utf8',
);

import { analyseMultiplet } from '../src/index';

//let result = analyseMultiplet(simulated, { frequency: 400, debug: true });
//let result = analyseMultiplet(simulated, { frequency: 400, debug: true, symmetrizeEachStep: true});
let result = analyseMultiplet(spectrum, { frequency: 400, debug: true , takeBestPartMultiplet : true});
//let result = analyseMultiplet(spectrum, { frequency: 400, debug: true , forceFirstDeconvolutionToThisValue : 14.145});
//let result = analyseMultiplet(spectrum, { frequency: 400, debug: true , forceFirstDeconvolutionToThisValue : 4.2, takeBestPartMultiplet : true});
//let result = analyseMultiplet(simulated, { frequency: 400, debug: true , takeBestPartMultiplet : true});
//let result = analyseMultiplet(simulated, { frequency: 400, debug: true , symmetrizeEachStep: true});

writeFileSync(
  join(__dirname, 'web', 'result2.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);
