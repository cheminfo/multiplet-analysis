import { writeFileSync } from 'fs';
import { join } from 'path';

export function saveStep(xin, yin, JStarArray, scalProd, fileNumber) {
  const data = {
    x: [],
    y: [],
  };

  for (let i = 0; i < xin.length; i++) {
    data.x.push(xin[i]);
    data.y.push(yin[i]);
  }

  writeFileSync(
    join('./web/', `multiplet${fileNumber}.json`),
    JSON.stringify(data),
    'utf8',
  );

  const data2 = {
    x: [],
    y: [],
  };

  for (let i = 0; i < scalProd.length; i++) {
    data2.x.push(JStarArray[i]);
    data2.y.push(scalProd[i]);
  }

  writeFileSync(
    join('./web/', `errfun${fileNumber}.json`),
    JSON.stringify(data2),
    'utf8',
  );
  return 1;
}
