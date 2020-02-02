/**
 * Analyse X / Y array and extract multiplicity
 * @param {object} [data={}] An object containing properties x and y
 * @param {object} [options={}] Options (default is empty object)
 * @param {number} [options.frequency=400] Acquisition frequency, default is 400 MHz
 */
import { appendDebug } from './appendDebug';

export function analyseMultiplet(data = {}, options = {}) {
  let { x = [], y = [] } = data;
  const { frequency = 400 } = options;
  const { debug = false } = options;
  const { maxTestedJ = 20 } = options;
  const { minTestedJ = 1 } = options;
  const { minimalResolution = 0.01 } = options;
  const { makeShortCutForSpeed = 0 } = options;
  const { critFoundJ = 0.95 } = options;
  const { sign = 1 } = options;
  const { chopTail = 1 } = options;
  const { multiplicity = 0.5 } = options;
  let scalProd = [];
  let JStarArray = [];
  let JArray = [];
  let result = {};
  result.j = [];
  const maxNumberOfCoupling = 10;
  //option see if cut is good. (should we cut more or interpolate if cut too close to peak - cause artifacts in both cases)

  // determine if need interpolation
  let resolutionPpm = Math.abs(x[0] - x[x.length - 1]) / (x.length - 1);
  let resolutionHz = resolutionPpm * frequency;
  // test if interpolation is needed.
  if (resolutionHz < minimalResolution) {
    // if yes interpolate and update x and y
  }

  // recalculate resolution after interpolation
  resolutionPpm = Math.abs(x[0] - x[x.length - 1]) / (x.length - 1);
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

  for (let loopoverJvalues = 1; loopoverJvalues < maxNumberOfCoupling; loopoverJvalues++) {
    let topValue = -1;
    let topPosJ = 0;
    let gotJValue = false;
    for (let jStar = maxTestedPt; jStar >= minTestedPt; jStar -= 1) {
      scalProd[jStar] = measureDeco(y, jStar, sign, chopTail, multiplicity);
      JStarArray[jStar] = jStar * resolutionHz;
      if (!gotJValue) {
        if (scalProd[jStar] > topValue) {
          topValue = scalProd[jStar];
          topPosJ = jStar;
        }
        if (jStar < maxTestedPt) {
          if (scalProd[jStar] < scalProd[jStar + 1] && topValue > critFoundJ) {
            result.j.push({
              multiplicity: 'd',
              coupling: topPosJ * resolutionHz,
            });
            gotJValue = true;
            if (makeShortCutForSpeed) break;
          }
        }
      }
      /*console.log(
      `${jStar} J* = ${JStarArray[jStar]} ${scalProd[jStar]} lenght ${y.length}`,
    );*/
    }
    if (debug) {
      appendDebug(x, y, JStarArray, scalProd, loopoverJvalues, result);
    }

    if (!gotJValue) break;
    else y = deco(y, topPosJ, sign, 0, chopTail, multiplicity);
  }
  /*console.log(`array ${JStarArray} in pt`);*/
  // LP: I would like to plot JStarArray over scalProd
  if (debug) {
    console.log(`${resolutionHz} Hz per point`);
    console.log(`min ${minTestedPt} in pt`);
    console.log(`max ${maxTestedPt} in pt`);
    console.log(`array ${JStarArray} in pt`);
    console.log(`array ${scalProd} in pt`);
  }

  // we do some complex stuff ...
  //result.delta = 7.2;
  //result.multiplicity = '';
  //result.j.push({ multiplicity: 'd', coupling: 7 });
  //result.j.push({ multiplicity: 't', coupling: 2 });
  return result;
}

function measureDeco(y, JStar, sign, chopTail, multiplicity) {
  let y1 = [];
  let y2 = [];
  let v11 = 0;
  let v22 = 0;
  let v12 = 0;
  y1 = deco(y, JStar, sign, 1, chopTail, multiplicity); // dir left to right
  y2 = deco(y, JStar, sign, -1, chopTail, multiplicity); // dir right to left
  for (let index = 0; index < y1.length; index++) {
    v12 += y1[index] * y2[index];
    v11 += y1[index] * y1[index];
    v22 += y2[index] * y2[index];
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

  if (dir >= 0) {
    for (let scan = 0; scan < y1.length; scan++) y1[scan] = yi[scan];
    for (let scan = 0; scan < y1.length - JStar * nbLines; scan++) {
      for (let line = 0; line < nbLines; line++) {
        y1[scan + (line + 1) * JStar] -= sign * y1[scan];
      }
    }
    if (dir > 0) {
      return y1.slice(0, y1.length - chopTail * JStar * nbLines - 1);
    }
  }
  if (dir <= 0) {
    for (let scan = 0; scan < y2.length; scan++) y2[scan] = yi[scan];
    for (let scan = y2.length - 1; scan >= JStar * nbLines; scan -= 1) {
      for (let line = 0; line < nbLines; line++) {
        y2[scan - (line + 1) * JStar] -= sign * y2[scan];
      }
    }
    if (dir < 0) {
      return y2.slice(chopTail * JStar * nbLines, y2.length - 1);
    }
  }
  if (dir == 0) {
    let yout = new Array(yi.length + JStar * nbLines);
    for (let scan = 0; scan < JStar * nbLines; scan++) yout[scan] = 0; // initialize
    for (let scan = 0; scan < y2.length; scan++) {
      yout[scan + JStar * nbLines] = y2[scan];
    } // fill
    for (let scan = 0; scan < y1.length; scan++) {
      yout[scan + JStar * nbLines] += y1[scan];
    }
    return y1.slice(0, y1.length - chopTail * JStar * nbLines - 1);
  }
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
