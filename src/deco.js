/**
 *
 * @param {number} [yi]
 * @param {number} [jStar]
 * @param {number} [sign=1]  ++ multiplet :1 +- multiplet : -1
 * @param {number} [dir=1] from left to right : 1 -1 from right to left, 0: sum of both
 * @param {number} [chopTail=1] run the end of the multiplet
 * @param {number} [multiplicity] value for spin 1/2
 */
export function deco(
  yi,
  jStar,
  sign = 1,
  dir = 1,
  chopTail = 1,
  multiplicity = 0.5,
) {
  let nbLines = parseInt(2 * multiplicity, 10); // 1 for doublet (spin 1/2) 2, for spin 1, etc... never tested...
  let y1;
  let y2;
  if (dir > -1) {
    y1 = yi.slice();
    if (nbLines === 1) {
      for (let scan = 0; scan < y1.length - jStar * nbLines; scan++) {
        y1[scan + jStar] -= sign * y1[scan];
      }
    } else {
      for (let scan = 0; scan < y1.length - jStar * nbLines; scan++) {
        for (let line = 0; line < nbLines; line++) {
          y1[scan + (line + 1) * jStar] -= sign * y1[scan];
        }
      }
    }
    if (dir > 0.5) {
      return new Float64Array(
        y1.buffer,
        0,
        y1.length - chopTail * jStar * nbLines,
      );
    }
  }
  if (dir < 1) {
    y2 = yi.slice();
    if (nbLines === 1) {
      for (let scan = y2.length - 1; scan >= jStar * nbLines; scan -= 1) {
        y2[scan - jStar] -= sign * y2[scan];
      }
    } else {
      for (let scan = y2.length - 1; scan >= jStar * nbLines; scan -= 1) {
        for (let line = 0; line < nbLines; line++) {
          y2[scan - (line + 1) * jStar] -= sign * y2[scan];
        }
      }
    }

    if (dir < -0.2) {
      return new Float64Array(
        y2.buffer,
        chopTail * jStar * nbLines * 8,
        y2.length - chopTail * jStar * nbLines,
      );
    }
  }
  if (!y1) y1 = new Float64Array(yi.length);
  if (!y2) y2 = new Float64Array(yi.length);
  if (dir === 0) {
    for (let scan = 0; scan < y2.length - jStar * nbLines; scan++) {
      y1[scan] = (y1[scan] + sign * y2[scan + jStar * nbLines]) / 2;
    }
    return new Float64Array(y1.buffer, 0, y1.length - jStar * nbLines);
  }
  let half = ((y1.length - jStar * nbLines) / 2.0) | 0;
  if (dir === 0.1) {
    for (let scan = half; scan < y2.length - jStar * nbLines; scan++) {
      y1[scan] = sign * y2[scan + jStar * nbLines];
    }
    return new Float64Array(y1.buffer, 0, y1.length - jStar * nbLines);
  }
}
