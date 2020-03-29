/**
 *
 * @param {number} [yi]
 * @param {number} [JStar]
 * @param {number} [sign=1]  ++ multiplet :1 +- multiplet : -1
 * @param {number} [dir=1] from left to right : 1 -1 from right to left, 0: sum of both
 * @param {number} [chopTail=1] run the end of the multiplet
 * @param {number} [multiplicity] value for spin 1/2
 */
export function deco(
  yi,
  JStar,
  sign = 1,
  dir = 1,
  chopTail = 1,
  multiplicity = 0.5,
) {
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
      y1[scan] = (y1[scan] + sign * y2[scan + JStar * nbLines]) / 2;
    }
    return y1.slice(0, y1.length - JStar * nbLines);
  }
  let half = ((y1.length - JStar * nbLines) / 2.0) | 0;
  if (dir === 0.1) {
    for (let scan = half; scan < y2.length - JStar * nbLines; scan++) {
      y1[scan] = sign * y2[scan + JStar * nbLines];
    }
    return y1.slice(0, y1.length - JStar * nbLines);
  }
}
