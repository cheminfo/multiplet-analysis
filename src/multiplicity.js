export function getGeneralPascal(n, spin = 0.5) {
  //spin = typeof spin !== 'undefined' ? spin : 0.5;
  if (n === 0) return [1];
  const nbLine = 2 * spin + 1;
  let line;
  if (nbLine === 2) {
    // this algorithm is faster for spin 1/2 from https://gist.github.com/lpatiny/5956d1866998fc565d4c676cf4a2be3b
    line = [1];
    for (let i = 0; i < n - 0; i++) {
      line.push((line[i] * (n - i - 0)) / (i + 1));
    }
    return line;
  } else {
    // this is a more general algorithm
    line = [1];
    if (n === 0) return line;
    for (let j = 0; j < nbLine - 1; j++) line.push(1);
    // complete with "1 1" or "1 1 1" for spin 1/2 and 1 respectively
    let previousLine = line;
    for (let i = 0; i < n - 1; i++) {
      line = [];
      for (let j = 0; j < nbLine; j++) {
        if (j === 0) {
          for (let k = 0; k < previousLine.length; k++) {
            line.push(previousLine[k]); // copy the line
          }
        } else {
          for (let k = 0; k < previousLine.length - 1; k++) {
            line[k + j] += previousLine[k]; // add the previous line
          }
          line.push(1); // complete the line
        }
      }
      previousLine = line;
    }
    return line;
  }
}
