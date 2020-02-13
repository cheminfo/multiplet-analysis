/**
 * Analyse X / Y array and extract multiplicity
 * @param {object} [data={}] An object containing properties x and y
 * @param {object} [options={}] Options (default is empty object)
 * @param {number} [options.frequency=400] Acquisition frequency, default is 400 MHz
 */
import { appendDebug } from './appendDebug';
import { fft } from 'fft-js';
import { ifft } from 'fft-js';

export function analyseMultiplet(data = {}, options = {}) {
  let { x = [], y = [] } = data;
  const { frequency = 400 } = options;
  const { debug = false } = options;
  const { maxTestedJ = 20 } = options;
  const { minTestedJ = 0.5 } = options;
  const { minimalResolution = 0.01 } = options; // in Hz / pt
  const { makeShortCutForSpeed = 0 } = options;
  const { critFoundJ = 0.95 } = options;
  const { sign = 1 } = options;
  const { chopTail = 1 } = options;
  const { multiplicity = 0.5 } = options;
  const { symmetrizeEachStep = false } = options;
  const { takeBestPartMultiplet = false } = options;
  const { addPhaseInterpolation = 0 } = options;
  let scalProd = [];
  let JStarArray = [];

  let result = {};
  result.j = [];
  const maxNumberOfCoupling = 12;
  //option see if cut is good. (should we cut more or interpolate if cut too close to peak - cause artifacts in both cases)

  // determine if need interpolation
  let resolutionPpm = Math.abs(x[0] - x[x.length - 1]) / (x.length - 1);
  let resolutionHz = resolutionPpm * frequency;

  let factorResolution = resolutionHz / minimalResolution;
  /*console.log(`>minimalResolution ${minimalResolution}`);
  console.log(`>factorResolution ${factorResolution}`);

  console.log(`>resolutionHz ${resolutionHz}`);*/
  //console.log(`factorResolution ${factorResolution}`);
  //console.log(`nb pt before ${x.length}`);

  let nextPowerTwo = Math.pow( 2, Math.round( Math.log((x.length - 1) * factorResolution) / Math.log(2.0) + 0.5, ), );
  factorResolution = (factorResolution * nextPowerTwo) / x.length;

  /*console.log(`factorResolution ${factorResolution}`);
  console.log(`x.length ${x.length}`);
  console.log(
    `Math.abs(x[0] - x[x.length - 1]) ${Math.abs(x[0] - x[x.length - 1])}`,
  );*/
  let movedBy;
  let sca = [];
  let spe = [];
  let topPosJ = 0;

  if (resolutionHz > minimalResolution) {
    // need increase resolution
    let returned = trigInterpolate(x, y, nextPowerTwo, addPhaseInterpolation);
    if (debug) console.log(`interpolating`);

    spe = returned.spectrum;
    sca = returned.scale;
  } else {
    sca = x;
    spe = y;
  }
/// for testing break symmetry before running...
/*
  movedBy = 120;
  if (movedBy > 0) { 
    spe = spe.slice(0, spe.length - movedBy);
    sca = sca.slice(0, sca.length - movedBy);
  }
  if (movedBy < 0) { 
    spe = spe.slice(-movedBy, spe.length);
    sca = sca.slice(-movedBy, sca.length);
  }*/
 /// end 

  resolutionPpm = Math.abs(sca[0] - sca[sca.length - 1]) / (sca.length - 1);
  resolutionHz = resolutionPpm * frequency;
  let maxTestedPt = Math.trunc(maxTestedJ / resolutionHz);
  let minTestedPt = Math.trunc(minTestedJ / resolutionHz) + 1;
  // will find center of symetry of the multiplet
  // add zeroes as to make it symetrical if requested... and needed

  // main J-coupling determination
  // not calculated - set to -1

  for (let jStar = 0; jStar < minTestedPt; jStar++) {
    JStarArray[jStar] = jStar * resolutionHz;
    scalProd[jStar] = -1;
  }
  let incrementForSpeed = 1;
  let curIncrementForSpeed;

  if (!debug) {
    incrementForSpeed = (1 + 0.5 / minimalResolution) | 0; // 1 could be set better (according to line widht ?!)
  }
  for (
    let loopoverJvalues = 1;
    loopoverJvalues < maxNumberOfCoupling;
    loopoverJvalues++
  ) {
    let beforeSymSpe = new Array(spe.length);

    //symmetrize if requested to
    if (symmetrizeEachStep === true) {
      movedBy = -measureSym(spe);
      if (movedBy > 0) {
        spe = spe.slice(0, spe.length - movedBy);
        sca = sca.slice(0, sca.length - movedBy);
      }
      if (movedBy < 0) {
        spe = spe.slice(-movedBy, spe.length);
        sca = sca.slice(-movedBy, sca.length);
      }
      if (debug) {// save this to plot it as well
        for (let index = 0; index < spe.length; index++) {
          beforeSymSpe[index] = spe[index];
        }
      }
      spe = symmetrize(spe);
    }

    let topValue = -1;
    let gotJValue = false;
    let LimitCoupling = Math.floor(sca.length / 2) - 1;//limit with respect to size of spectrum (which is reducing at each step)
    let critFoundJLow = critFoundJ - 0.3;
    if (maxTestedPt > LimitCoupling) {
      maxTestedPt = LimitCoupling;
    }
    if ((loopoverJvalues > 1) && !debug) {
      if (maxTestedPt > Math.floor(topPosJ + 1.0 / resolutionHz)) {
        maxTestedPt = Math.floor(topPosJ + 1.0 / resolutionHz);
        //console.log(`recuded size to :: ` + maxTestedPt);
        //console.log(`recuded size to :: ` + maxTestedPt + " = " + (maxTestedPt*resolutionHz));
       }
    }
    curIncrementForSpeed = incrementForSpeed;
    let jStarFine;
    for (
      let jStar = maxTestedPt;
      jStar >= minTestedPt;
      jStar -= curIncrementForSpeed
    ) {
      scalProd[jStar] = measureDeco(
        spe,
        jStar,
        sign,
        chopTail,
        multiplicity,
        curIncrementForSpeed,
      );
      JStarArray[jStar] = jStar * resolutionHz;
      if (!gotJValue) {
        if (scalProd[jStar] > topValue) {
          topValue = scalProd[jStar];
          topPosJ = jStar;
        }
        if (jStar < maxTestedPt) {
          if (
            scalProd[jStar] < scalProd[jStar + curIncrementForSpeed] &&
            topValue > critFoundJLow
          ) {
            // here refine...
            jStarFine = jStar;
            while (curIncrementForSpeed > 1) {
              //console.log(`curIncrementForSpeed:: ` + curIncrementForSpeed);

              curIncrementForSpeed = Math.floor(curIncrementForSpeed / 2); // get smaller and smaller step
              for (
                jStarFine = topPosJ - 2 * curIncrementForSpeed;
                jStarFine < topPosJ + 2 * curIncrementForSpeed;
                jStarFine += curIncrementForSpeed
              ) {
                scalProd[jStarFine] = measureDeco(
                  spe,
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

            // end refine
            if (topValue > critFoundJ) {
              if (debug)
                         console.log(`J:: ` + (topPosJ * resolutionHz));

              result.j.push({
                multiplicity: 'd',
                coupling: topPosJ * resolutionHz,
              });
              gotJValue = true;
              if (makeShortCutForSpeed) break;
            }
          }
        }
      }
      /*console.log(
      `${jStar} J* = ${JStarArray[jStar]} ${scalProd[jStar]} lenght ${y.length}`,
    );*/
    }

    if (debug) {
      if(symmetrizeEachStep === true)
       appendDebug(sca, spe, JStarArray, scalProd, loopoverJvalues, result, beforeSymSpe );
      else
       appendDebug(sca, spe, JStarArray, scalProd, loopoverJvalues, result);
    }

    if (!gotJValue) {
      break;
    } else {
      // apply here the deconvolution for the next step of the recursive process
      spe = deco(
        spe,
        topPosJ,
        sign,
        0 + 0.1 * takeBestPartMultiplet,
        chopTail,
        multiplicity,
      ); // for next step
      if (chopTail) {
        let remove = 0.5 * topPosJ * (2 * multiplicity);
        sca = sca.slice(remove, sca.length - remove);
      }
      if (sca.length !== spe.length) {
        ErrorEvent('sts');
      }
    }
  }
  return result;
}

function measureDeco(y, JStar, sign, chopTail, multiplicity, incrementForSpeed) {
  let y1 = [];
  let y2 = [];
  y1 = deco(y, JStar, sign, 1, chopTail, multiplicity); // dir left to right
  y2 = deco(y, JStar, sign, -1, chopTail, multiplicity); // dir right to left
  return scalarProduct(y1, y2, 1, incrementForSpeed);
}

function scalarProduct(y1, y2, sens, incrementForSpeed) {
  // sens = 1; crude scalar product
  // sens =-1: flip spectrum first
  let v11 = 0;
  let v22 = 0;
  let v12 = 0;
  if (sens > 0) {
    for (let index = 0; index < y1.length; index += incrementForSpeed) {
      v12 += y1[index] * y2[index];
      v11 += y1[index] * y1[index];
      v22 += y2[index] * y2[index];
    }
  } else {// Here as if flip left/right array
    for (let index = 0; index < y1.length; index += incrementForSpeed) {
      v12 += y1[index] * y2[y1.length - index - 1];
      v11 += y1[index] * y1[index];
      v22 += y2[index] * y2[index];
    }
  }
  return v12 / Math.sqrt(v11 * v22);
}
function deco(yi, JStar, sign, dir, chopTail, multiplicity) {
  if (typeof sign === 'undefined') {
    sign = 1;
  } // set default value : ++ multiplet :1 +- multiplet : -1
  if (typeof dir === 'undefined') {
    dir = 1;
  } // set default value : from left to right : 1 -1 from right to left, 0: sum of both
  if (typeof chopTail === 'undefined') {
    chopTail = 1;
  } // set default value : run the end of the multiplet
  if (typeof multiplicity === 'undefined') {
    multiplicity = 0.5;
  } // set default value for spin 1/2
  let nbLines = parseInt(2 * multiplicity); // 1 for doublet (spin 1/2) 2, for spin 1, etc... never tested...
  let y1 = new Array(yi.length);
  let y2 = new Array(yi.length);

  if (dir > -1) {
    for (let scan = 0; scan < y1.length; scan++) y1[scan] = yi[scan];
    for (let scan = 0; scan < y1.length - JStar * nbLines; scan++) {
      for (let line = 0; line < nbLines; line++) {
        y1[scan + (line + 1) * JStar] -= sign * y1[scan];
      }
    }
    if (dir > 0.5) {
      return y1.slice(0, y1.length - chopTail * JStar * nbLines);
    }
  }
  if (dir < 1) {
    for (let scan = 0; scan < y2.length; scan++) y2[scan] = yi[scan];
    for (let scan = y2.length - 1; scan >= JStar * nbLines; scan -= 1) {
      for (let line = 0; line < nbLines; line++) {
        y2[scan - (line + 1) * JStar] -= sign * y2[scan];
      }
    }
    if (dir < -0.2) {
      return y2.slice(chopTail * JStar * nbLines, y2.length);
    }
  }
  if (dir === 0) {
    for (let scan = 0; scan < y2.length - JStar * nbLines; scan++) {
      y1[scan] += sign * y2[scan + JStar * nbLines];
    }
    return y1.slice(0, y1.length - JStar * nbLines);
  }
  // multiply by two because take best half of both...
  let half = ((y1.length - JStar * nbLines) / 2.0) | 0;
  if (dir === 0.1) {
    for (let scan = 0; scan < half; scan++) {
      y1[scan] = 2 * y1[scan];
    }
    for (let scan = half; scan < y2.length - JStar * nbLines; scan++) {
      y1[scan] =  2 * sign * y2[scan  + JStar * nbLines];
    }
    return y1.slice(0, y1.length - JStar * nbLines);
  }
}

function trigInterpolate(x, y, nextPowerTwo, addPhaseInterpolation) {
  let sca = Array(nextPowerTwo);
  let spe = Array(nextPowerTwo);

  let scaIncrement = (x[x.length - 1] - x[0]) / (x.length - 1); // delta one pt
  let scaPt = x[0] - scaIncrement / 2; // move to limit side - not middle of first point (half a pt left...)
  let trueWidth = scaIncrement * x.length;
  scaIncrement = trueWidth / nextPowerTwo;
  scaPt += scaIncrement / 2; // move from limit side to middle of first pt
  // set scale

  for (let loop = 0; loop < nextPowerTwo; loop++) {
    sca[loop] = scaPt;
    scaPt += scaIncrement;
  }

  // interpolate spectrum
  // prepare input for fft apply fftshift
  let an = [...Array(y.length)].map((x) => Array(2).fill(0)); // n x 2 array
  let halfNumPt = y.length / 2;
  for (let loop = 0; loop < halfNumPt; loop++) {
    an[loop + halfNumPt][0] = y[loop]; //Re
    an[loop + halfNumPt][1] = 0; //Im
    an[loop][0] = y[loop + halfNumPt]; //Re
    an[loop][1] = 0; //Im
  }
  let out = ifft(an);
  out[0][0] = out[0][0] / 2; // divide first point by 2 Re
  out[0][1] = out[0][1] / 2; // divide first point by 2 Im
  // move to larger array...
  let an2 = [...Array(nextPowerTwo)].map((x) => Array(2).fill(0)); // n x 2 array
  for (let loop = 0; loop < halfNumPt; loop++) {
    an2[loop][0] = out[loop][0];//* Math.cos((phase / 180) * 3.1416) +
    an2[loop][1] = out[loop][1];//* Math.cos((phase / 180) * 3.1416) -
  }

  for (let loop = halfNumPt; loop < nextPowerTwo; loop++) {
    // zero filling
    an2[loop][0] = 0;
    an2[loop][1] = 0;
  }
  let out2 = fft(an2);
  halfNumPt = nextPowerTwo / 2;
  // applies fftshift
  let phase = addPhaseInterpolation;
  for (let loop = 0; loop < halfNumPt; loop++) {
    //spe[loop] = out2[loop + halfNumPt][0]; // only Re now...
    spe[loop] = out2[loop + halfNumPt][0] * Math.cos((phase / 180) * 3.1416) + out2[loop + halfNumPt][1] * Math.sin((phase / 180) * 3.1416); // only Re now...
  }
  for (let loop = 0; loop < halfNumPt; loop++) {
    //spe[loop + halfNumPt] = out2[loop][0]; // only Re now...
    spe[loop + halfNumPt] = out2[loop ][0] * Math.cos((phase / 180) * 3.1416) + out2[loop ][1] * Math.sin((phase / 180) * 3.1416); // only Re now...
  }
  return { spectrum: spe, scale: sca };
}

function symmetrize(y) {
  let tmp;
  for (let indi = 0; indi < y.length / 2; indi++) {
    tmp = y[indi] * 0.5 + 0.5 * y[y.length - 1 - indi];
    y[indi] = tmp;
    y[y.length - 1 - indi] = tmp;
  }
  return y;
}

function measureSym(y) {
  let spref, spnew, movedBy = 0;
  spref = scalarProduct(y, y, -1, 1);
  // search left...
  for (let indi = 1; indi < y.length / 2; indi++) {
    spnew = scalarProduct(y.slice(indi, y.length), y.slice(indi, y.length), -1, 1);
    if (spnew > spref) {
    //  console.log(`${spnew} > ${spref} size: ${y.length}`);
      spref = spnew;
      movedBy = indi;
    } else {
       // console.log('OK+ ' + movedBy + " " + indi + ' ' + spnew);
    }
  }
  if (movedBy === 0) {
    for (let indi = 1; indi < y.length / 2; indi++) {
      spnew = scalarProduct(y.slice(0, y.length - indi), y.slice(0, y.length - indi), -1, 1);
      if (spnew > spref) {
      //  console.log(`${spnew} > ${spref} size: ${y.length}`);
        spref = spnew;
        movedBy = -indi;
      } else {
       // console.log('OK- ' + movedBy + ' ' + indi + ' ' + spnew);
      }
    }
  }
  //console.log('OK  ' + movedBy);
 return(movedBy);
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
      nbpt=symj(top_pos);
      [v1, v2]=deco(segment_int',nbpt);
      segment_int=(v1*0.5+0.5*v2)';
      table_of_J(1,main_j_loop)=symj(top_pos)*hz_per_pt_interp;
  else
      break
  end

end
table_of_J
*/
