import { writeFileSync } from 'fs';
import { join } from 'path';
import { SpinSystem, simulate1D } from 'nmr-simulation';

// a prediction should contain only once the couplings

const prediction = [
  {
    atomIDs: [1],
    delta: 1.2,
    j: [
      { assignment: [2], coupling: 10 },
      { assignment: [3], coupling: 6 },
    ],
  },
  {
    atomIDs: [2],
    delta: 1.3,
    j: [{ assignment: [3], coupling: 2 }],
  },
  {
    atomIDs: [3],
    delta: 1.5,
  },
];

const options1h = {
  frequency: 400,
  from: 1,
  to: 2,
  lineWidth: 1,
  nbPoints: 16384,
  maxClusterSize: 8,
  output: 'xy',
};

const spinSystem = SpinSystem.fromPrediction(prediction);
spinSystem.ensureClusterSize(options1h);
const spectrum = simulate1D(spinSystem, options1h);

writeFileSync(
  join(__dirname, 'web-simulated', 'simulated.json'),
  JSON.stringify(spectrum),
  'utf8',
);
