//import { writeFileSync } from 'fs';
//import { join } from 'path';

import { analyseMultiplet } from '..';
import androstenData from '../../data/allAndrosten.json';
import asymDoublet from '../../data/asymDoublet.json';
import ddd from '../../data/d=1_J=2,4,6_m=ddd.json';
import quadruplet from '../../data/d=1_J=7_m=q.json';
import doublet from '../../data/d=2_J=7_m=d.json';
import massive from '../../data/massive.json';
import toDebbug from '../../data/multiplet-analisys-toDebbug.json';

describe('analyse multiplet of simulated spectra', () => {
  it('d=2_J=7_m=d 1', () => {
    let result = analyseMultiplet(doublet, { frequency: 400 });
    expect(result.js[0].coupling).toBeCloseTo(7, 1); // one decimal at low resolution (no interpolation)
    expect(result.js[0].multiplicity).toBe('d');
    expect(result.js).toHaveLength(1);
    expect(result.chemShift).toBeCloseTo(2.0, 5);
  });

  it('d=1_J=7_m=q 2', () => {
    let result = analyseMultiplet(quadruplet, {
      frequency: 400,
      minimalResolution: 0.1,
      symmetrizeEachStep: true,
    });
    expect(result.js[0].coupling).toBeCloseTo(7, 0); // one decimal at low resolution (no interpolation)
    expect(result.js[1].coupling).toBeCloseTo(7, 0); // no decimal at low resolution (no interpolation)
    expect(result.js[2].coupling).toBeCloseTo(7, 0); // no decimal at low resolution (no interpolation)
    expect(result.chemShift).toBeCloseTo(1.0, 3);
  });

  it('d=1_J=7_m=q high resolution', () => {
    let result = analyseMultiplet(quadruplet, {
      frequency: 400,
      symmetrizeEachStep: true,
    });
    expect(result.js[0].coupling).toBeCloseTo(7, 0); // improve....
    expect(result.js[1].coupling).toBeCloseTo(7, 0);
    expect(result.js[2].coupling).toBeCloseTo(7, 0);
    expect(result.chemShift).toBeCloseTo(1.0, 3);
    expect(result.js).toHaveLength(3);
  });

  it('d=1_J=2,4,6_m=ddd', () => {
    let result = analyseMultiplet(ddd, { frequency: 400 });
    expect(result.js[0].coupling).toBeCloseTo(6, 2);
    expect(result.js[1].coupling).toBeCloseTo(4, 2);
    expect(result.js[2].coupling).toBeCloseTo(2, 2);
    expect(result.chemShift).toBeCloseTo(1.0, 3);
    expect(result.js).toHaveLength(3);
  });

  it('multiplet-analisys-toDebbug', () => {
    let result = analyseMultiplet(toDebbug, {
      frequency: 500,
      symmetrizeEachStep: true,
      takeBestPartMultiplet: true,
      debug: true,
      minimalResolution: 0.05,
    });
    expect(result.js).toHaveLength(3);
    expect(result.js[0].coupling).toBeCloseTo(8.85, 1);
    expect(result.js[1].coupling).toBeCloseTo(8.85, 1);
    expect(result.js[2].coupling).toBeCloseTo(8.7, 1);
    expect(result.chemShift).toBeCloseTo(3.77, 2);
  });
  it('Asym doublet', () => {
    let result = analyseMultiplet(asymDoublet, {
      frequency: 600,
      symmetrizeEachStep: true,
      takeBestPartMultiplet: true,
      debug: true,
      minimalResolution: 0.01,
    });

    expect(result.js).toHaveLength(1);
    expect(result.js[0].coupling).toBeCloseTo(15.5, 1);
    expect(result.chemShift).toBeCloseTo(4.037, 2);
  });
  it('multiplet-analisys-toDebbug 2', () => {
    let result = analyseMultiplet(toDebbug, {
      frequency: 500,
      symmetrizeEachStep: true,
      takeBestPartMultiplet: true,
      debug: true,
      minimalResolution: 0.01,
    });
    expect(result.js).toHaveLength(3);
    expect(result.js[0].coupling).toBeCloseTo(8.85, 1);
    expect(result.js[1].coupling).toBeCloseTo(8.85, 1);
    expect(result.js[2].coupling).toBeCloseTo(8.7, 1);
    expect(result.chemShift).toBeCloseTo(3.77, 2);
  });

  it('androsten multiplets 1', () => {
    let results = [];

    let x;
    let y;
    for (let i = 0; i < androstenData.length; i++) {
      x = [];
      y = [];
      x = androstenData[i].debug.steps[0].multiplet.x;
      y = androstenData[i].debug.steps[0].multiplet.y;

      results[i] = analyseMultiplet(
        { x, y },
        {
          frequency: 500,
          symmetrizeEachStep: true,
          //takeBestPartMultiplet: true,
          debug: true,
          minimalResolution: 0.005,
          critFoundJ: 0.6,
        },
      );
    }

    let i = 1;
    expect(results[i].js).toHaveLength(androstenData[i].js.length - 1);
    let k = 0;
    expect(results[i].js[k].coupling).toBeCloseTo(
      androstenData[i].js[k].coupling,
      1,
    );
    k++;
    expect(results[i].js[k].coupling).toBeCloseTo(
      androstenData[i].js[k].coupling,
      1,
    );
    k++;
    expect(results[i].js[k].coupling).toBeCloseTo(
      androstenData[i].js[k].coupling,
      0,
    );

    i = 2;
    expect(results[i].js).toHaveLength(androstenData[i].js.length - 1);
    k = 0;
    expect(results[i].js[k].coupling).toBeCloseTo(
      androstenData[i].js[k].coupling,
      1,
    );
    k++;
    expect(results[i].js[k].coupling).toBeCloseTo(
      androstenData[i].js[k].coupling,
      1,
    );
    k++;
    expect(results[i].js[k].coupling).toBeCloseTo(
      androstenData[i].js[k].coupling,
      1,
    );
    k++;
    expect(results[i].js[k].coupling).toBeCloseTo(
      androstenData[i].js[k].coupling,
      1,
    );
  });

  it('massive: checkSymmetryFirst option true', () => {
    let result = analyseMultiplet(massive, {
      frequency: 400,
      checkSymmetryFirst: true,
    });
    expect(result.js).toHaveLength(0);
    expect(result.chemShift).toBeCloseTo(7, 0);
  });
});
