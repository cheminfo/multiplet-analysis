export function getGeneralPascal(n, spin = 0.5) {
  //spin = typeof spin !== 'undefined' ? spin : 0.5;
  if (n === 0) return [1];
  conts mult = 2 * spin + 1;
  if (mult === 2) {
    // this algorithm is faster for spin 1/2 from https://gist.github.com/lpatiny/5956d1866998fc565d4c676cf4a2be3b
    var line = [1];
    for (var i = 0; i < n - 0; i++) {
      line.push((line[i] * (n - i - 0)) / (i + 1));
    }
    return line;
  } else {
    // this is a more general algorithm
    line = [1];
    if (n === 0) return line;
    var mult = 2 * spin + 1;
    for (var j = 0; j < mult - 1; j++) line.push(1);
    // complete with "1 1" or "1 1 1" for spin 1/2 and 1 respectively
    var previousLine = line;
    for (var i = 0; i < n - 1; i++) {
      var line = [];
      for (j = 0; j < mult; j++) {
        if (j === 0) {
          for (var k = 0; k < previousLine.length; k++)
            line.push(previousLine[k]); // copy the line
        } else {
          for (k = 0; k < previousLine.length - 1; k++)
            line[k + j] += previousLine[k]; // add the previous line
          line.push(1); // complete the line
        }
      }
      previousLine = line;
    }
    return line;
  }
}
