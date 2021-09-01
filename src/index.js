/**
 * Analyse X / Y array and extract multiplicity
 * @param {object} [data={}] An object containing properties x and y
 * @param {object} [options={}] Options (default is empty object)
 * @param {number} [options.frequency=400] Acquisition frequency, default is 400 MHz
 */

import maxY from 'ml-array-xy-max-y';

import { appendDebug } from './appendDebug';
import { deco } from './deco';
import { measureDeco } from './measureDeco';
import { measureSymShift } from './measureSymShift';
import { symmetrize } from './symmetrize';
import { trigInterpolate } from './trigInterpolate';

/**
 * Analyse a multiplet
 * @param {object} [data] object of the kind {x:[], y:[]} containing the multiplet
 * @param {object} [options={}]
 * @param {number} [options.frequency=400] frequency
 * @param {boolean} [options.debug=false] generate debug information if true
 */

export function analyseMultiplet(data = {}, options = {}) {
  let { x = [], y = [] } = data;

  if (!(x instanceof Float64Array)) x = Float64Array.from(x);
  if (!(y instanceof Float64Array)) y = Float64Array.from(y);

  const {
    frequency = 400,
    debug = false,
    maxTestedJ = 20,
    minTestedJ = 1,
    minimalResolution = 0.01,
    correctVerticalOffset = true,
    makeShortCutForSpeed = true,
    critFoundJ = 0.9,
    sign = 1,
    chopTail = true,
    multiplicity = 0.5,
    symmetrizeEachStep = false,
    takeBestPartMultiplet = false,
    addPhaseInterpolation = 0,
    forceFirstDeconvolutionToThisValue = 0,
    appliedPhaseCorrectionType = 0,
    decreasingJvalues = true,
    jumpUpAfterFoundValue = 2.0,
  } = options;

  let result = {};
  result.js = [];
  const maxNumberOfCoupling = 12;
  //option see if cut is good. (should we cut more or interpolate if cut too close to peak - cause artifacts in both cases)

  // determine if need interpolation
  let resolutionPpm = Math.abs(x[0] - x[x.length - 1]) / (x.length - 1);
  let resolutionHz = resolutionPpm * frequency;

  let factorResolution = resolutionHz / minimalResolution;

  let nextPowerTwo = 2 ** Math.ceil(Math.log2(x.length * factorResolution));
  let nextPowerTwoInital = 2 ** Math.ceil(Math.log2(x.length));

  let integerFactorResolution = nextPowerTwo / nextPowerTwoInital;

  let movedBy;
  let scale;
  let spectrum;
  let topPosJ = 0;
  // adjust vertical offset
  if (correctVerticalOffset) {
    let minValue = 1e20;
    for (let index = 0; index < y.length; index++) {
      if (minValue > y[index]) {
        minValue = y[index];
      }
    }
    if (minValue > 0) {
      for (let index = 0; index < y.length; index++) {
        y[index] -= minValue;
      }
    }
  }
  if (resolutionHz > minimalResolution) {
    // need increase resolution
    let returned = trigInterpolate(
      x,
      y,
      integerFactorResolution * y.length,
      addPhaseInterpolation,
      appliedPhaseCorrectionType,
    );

    spectrum = returned.spectrum;
    scale = returned.scale;
    result.phaseCorrectionOnMultipletInDeg =
      returned.phaseCorrectionOnMultipletInDeg;
  } else {
    scale = x;
    spectrum = y;
  }

  resolutionPpm =
    Math.abs(scale[0] - scale[scale.length - 1]) / (scale.length - 1);
  resolutionHz = resolutionPpm * frequency;
  let maxTestedPt = Math.trunc(maxTestedJ / resolutionHz);
  let minTestedPt = Math.trunc(minTestedJ / resolutionHz) + 1;
  // will find center of symmetry of the multiplet
  // add zeroes as to make it symetrical if requested... and needed

  // main J-coupling determination
  // not calculated - set to -1

  let incrementForSpeed = 1;
  let curIncrementForSpeed;

  incrementForSpeed = (1 + 0.3 / minimalResolution) | 0; // 1 could be set better (according to line widht ?!)
  for (
    let loopoverJvalues = 1;
    loopoverJvalues < maxNumberOfCoupling;
    loopoverJvalues++
  ) {
    let scalProd = [];
    let jStarArray = [];
    for (let jStar = 0; jStar < minTestedPt; jStar++) {
      jStarArray[jStar] = jStar * resolutionHz;
      scalProd[jStar] = 0;
    }
    let beforeSymSpe = new Float64Array(spectrum.length);

    //symmetrize if requested to
    if (symmetrizeEachStep === true) {
      movedBy = -measureSymShift(spectrum);
      if (movedBy > 0) {
        spectrum = spectrum.slice(0, spectrum.length - movedBy);
        scale = scale.slice(0, scale.length - movedBy);
      }
      if (movedBy < 0) {
        spectrum = spectrum.slice(-movedBy, spectrum.length);
        scale = scale.slice(-movedBy, scale.length);
      }
      if (debug) {
        // save this to plot it as well
        for (let index = 0; index < spectrum.length; index++) {
          beforeSymSpe[index] = spectrum[index];
        }
      }
      spectrum = symmetrize(spectrum);
    }

    let topValue = -1;
    let gotJValue = false;
    let limitCoupling = scale.length - 1; //limit with respect to size of spectrum (which is reducing at each step)
    let critFoundJLow = critFoundJ - 0.3;
    if (maxTestedPt > limitCoupling) {
      maxTestedPt = limitCoupling;
    }
    if (loopoverJvalues > 1 && decreasingJvalues) {
      if (
        maxTestedPt > Math.floor(topPosJ + jumpUpAfterFoundValue / resolutionHz)
      ) {
        maxTestedPt = Math.floor(
          topPosJ + jumpUpAfterFoundValue / resolutionHz,
        );
      }
    }
    curIncrementForSpeed = incrementForSpeed;
    let jStarFine;
    for (let jStar = minTestedPt; jStar < maxTestedPt; jStar++) {
      jStarArray[jStar] = jStar * resolutionHz;
      scalProd[jStar] = -1;
    }
    for (
      let jStar = maxTestedPt;
      jStar >= minTestedPt;
      jStar -= incrementForSpeed
    ) {
      scalProd[jStar] = measureDeco(
        spectrum,
        jStar,
        sign,
        chopTail,
        multiplicity,
        curIncrementForSpeed,
      );

      jStarArray[jStar] = jStar * resolutionHz;
      if (!gotJValue) {
        if (scalProd[jStar] > topValue) {
          topValue = scalProd[jStar];
          topPosJ = jStar;
        }

        if (jStar < maxTestedPt - 2 * curIncrementForSpeed) {
          if (
            scalProd[jStar] < scalProd[jStar + curIncrementForSpeed] &&
            scalProd[jStar + curIncrementForSpeed] >=
              scalProd[jStar + 2 * curIncrementForSpeed] &&
            scalProd[jStar + curIncrementForSpeed] > critFoundJLow
          ) {
            while (curIncrementForSpeed > 1) {
              curIncrementForSpeed = Math.floor(curIncrementForSpeed / 2); // get smaller and smaller step
              let froms = topPosJ - 2 * curIncrementForSpeed; // maybe 1 is enough....
              while (froms < 0) froms += curIncrementForSpeed;
              let tos = topPosJ + 2 * curIncrementForSpeed; // maybe 1 is enough....
              while (tos >= maxTestedPt) tos -= curIncrementForSpeed;
              topValue = -1; // reset because increased precision may make the top lower
              for (
                jStarFine = froms;
                jStarFine <= tos;
                jStarFine += curIncrementForSpeed
              ) {
                scalProd[jStarFine] = measureDeco(
                  spectrum,
                  jStarFine,
                  sign,
                  chopTail,
                  multiplicity,
                  curIncrementForSpeed,
                );
                if (scalProd[jStarFine] > topValue) {
                  topValue = scalProd[jStarFine];
                  topPosJ = jStarFine;
                }
              }
            }
            curIncrementForSpeed = incrementForSpeed;
            // end refine
            if (topValue > critFoundJ) {
              // ugly force value for tests
              if (
                forceFirstDeconvolutionToThisValue > 0 &&
                loopoverJvalues === 1 &&
                gotJValue === false
              ) {
                topPosJ = Math.floor(
                  forceFirstDeconvolutionToThisValue / resolutionHz,
                );
                topValue = 1.1;
              }

              result.js.push({
                multiplicity: 'd',
                coupling: topPosJ * resolutionHz,
              });
              gotJValue = true;

              if (makeShortCutForSpeed) {
                break;
              }
            }
          }
        }
      }
    }

    if (debug) {
      if (symmetrizeEachStep === true) {
        appendDebug(
          scale,
          spectrum,
          jStarArray,
          scalProd,
          loopoverJvalues,
          result,
          beforeSymSpe,
        );
      } else {
        appendDebug(
          scale,
          spectrum,
          jStarArray,
          scalProd,
          loopoverJvalues,
          result,
        );
      }
    }

    if (!gotJValue) {
      break;
    } else {
      // apply here the deconvolution for the next step of the recursive process
      spectrum = deco(
        spectrum,
        topPosJ,
        sign,
        0 + 0.1 * takeBestPartMultiplet,
        chopTail,
        multiplicity,
      ); // for next step
      if (chopTail) {
        let remove = 0.5 * topPosJ * (2 * multiplicity);
        scale = scale.slice(remove, scale.length - remove);
      }
      if (scale.length !== spectrum.length) {
        throw Error('sts');
      }
    }
  }
  // to be tested ...

  let maxAmplitudePosition = maxY({ x: scale, y: spectrum });
  result.chemShift = scale[maxAmplitudePosition.index];
  return result;
}

/* matlab code :
%%  demo deconvolution of J. coupling
clear all

%% deconvolution constants
min_j=1.5;%depend on the linewidth of the signal
max_j=21;%typically largest JHH couling
symmetrize=1;%symetrize multiplet at each step of deconvolution
center=1;%center multiplet before analysis

%spectral parameter (to be fixed)
hz_per_pt=0.1;% to be fixed and set to swh/si

%% interplation parameter
interpolate_factor=4;

%% read data

figure(100)
plot(segment)

%% interpolate segment
segment_int=interpft(segment,size(segment,1)*interpolate_factor);

figure(101)
plot(segment_int)

hz_per_pt_interp=hz_per_pt/interpolate_factor;
figure(2);clf;plot(segment_int);hold on
plot(round(size(segment_int,1)/2),0,'k+')

%% verify centered
figure(3);clf;
plot(segment_int);hold on
plot(flipud(segment_int));hold on
plot(round(size(segment_int,1)/2),0,'k+')
title('check centered')

%%determin range of tested couplings
from_pt=round(min_j/hz_per_pt_interp);
top_pt=round(max_j/hz_per_pt_interp);

min_val_for_scal_prod=0.9;
fast_skip=1;
number_of_coupling_looked_in_multiplet=5;
figure(10);clf
figure(11);clf
table_of_J=zeros(1,number_of_coupling_looked_in_multiplet);

figure(4);clf;
plot(segment_int);hold on
plot(flipud(segment_int));hold on
plot(round(size(segment_int,1)/2),0,'k+')
title('check centered')
for main_j_loop=1:number_of_coupling_looked_in_multiplet%:10
  if top_pt>size(segment_int,1)
      top_pt=size(segment_int,1);
  end

  % center
  if center
  [segment_int, shifted_by]=center_spectrum(segment_int');
  segment_int=segment_int';
  disp(['Shifted by ' num2str(shifted_by) ' pt'])
  end

  % symmetrize
  if symmetrize
  segment_int= flipud(segment_int)*0.5+0.5*segment_int;
      disp(['Symmetrized'])

  end
  list_of_j=top_pt:-1:from_pt;
  sijl=size(list_of_j,2);
  symt=zeros(1,sijl);
  symj=zeros(1,sijl);
  figure(11)
  subplot(number_of_coupling_looked_in_multiplet,1,main_j_loop)
  plot(segment_int);hold on
  plot(flipud(segment_int));
  figure(10)
  subplot(number_of_coupling_looked_in_multiplet,1,main_j_loop)
  inc2=0;
  top_pos=0;
  for jstarpt=list_of_j
      %apply doublet deconvolution
      [v1, v2]=deco(segment_int',jstarpt);
      v1=v1';v2=v2';
      %test symetry of result
      levelp_now=sum(sum((v1.*v2)))/(sqrt(sum(sum(((v1.*v1)))))*sqrt(sum(sum(v2.*v2))));
      %store data
      symt(1,sijl-inc2+1)=levelp_now;
      symj(1,sijl-inc2+1)=jstarpt;
      %search extrema
      if inc2>3
          if ( symt(1,sijl-inc2+3)<(symt(1,sijl-inc2+2))) && (symt(1,sijl-inc2+2)>levelp_now)
              if symt(1,sijl-inc2+2)>min_val_for_scal_prod
                  if top_pos==0
                      top_pos=sijl-inc2+2;
                      plot(symj(top_pos)*hz_per_pt_interp,symt(top_pos),'r+');hold on
                      if fast_skip==0
                          break
                      end
                  end
              end
              %  break;
          end
      end
      inc2=inc2+1;
  end
  plot([min_j max_j],min_val_for_scal_prod*[ 1 1],'r:');hold on
  plot(symj*hz_per_pt_interp,symt);hold on
  title(['No max above ' num2str(min_val_for_scal_prod,3)])
  axis([min_j max_j 0 1.1])
  axis([min_j max_j 0 1.1])
  if top_pos~=0
      title(['J(' num2str(main_j_loop) ')=' num2str(symj(top_pos)*hz_per_pt_interp,3) ' Hz'])

      =symj(top_pos);
      [v1, v2]=deco(segment_int',nbpt);
      segment_int=(v1*0.5+0.5*v2)';
      table_of_J(1,main_j_loop)=symj(top_pos)*hz_per_pt_interp;
  else
      break
  end

end
table_of_J
*/
