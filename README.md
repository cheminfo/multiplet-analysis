# multiplet-analysis

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

The goal of this project is to be able to determine the multiplicity of 
a NMR signal as well as the coupling constants.

The result of the analysis that is an object composed:
- delta
- multiplicity : m (massif if delta is unspecified), s, s br, d br. We can repeat the multiplicity in this field but if it is empty we should use it from coupling constants array.
- peak: [{x: , y:, z:, width}, {x: , y:, z:, width}, ]
- j []
  - multiplicity: (d, t, q, p pent quint, sext hex, sept hept, oct, non)
  - coupling:  (Hz)


## Developement


```bash
git clone https://github.com/cheminfo/multiplet-analysis.git
cd multiplet-analysis
code .
```

To run the `jest` tests in an interactive way (preferably on a second screen):
`npx jest --watch`

In order to debug you may anytime add a `console.log` in the code. The result of the log will appear in the `jest --watch`.

In the `jest --.watch` terminal you may as well select only one specific test.

In is also possible to select a specific test in the code by
adding `.only` after `describe` or `it` like for example: `it.only('s`

## Creating simulated data

Spectra can be simulated on

http://www.nmrdb.org/simulator/

And the data can be download as a JSON file.

## Installation

`npm i multiplet-analysis`

## Usage

```js
import library from 'multiplet-analysis';

const result = library(args);
// result is ...
```

## [API Documentation](https://cheminfo.github.io/multiplet-analysis/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/multiplet-analysis.svg
[npm-url]: https://www.npmjs.com/package/multiplet-analysis
[ci-image]: https://github.com/cheminfo/multiplet-analysis/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/multiplet-analysis/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/multiplet-analysis.svg
[download-url]: https://www.npmjs.com/package/multiplet-analysis

npm i ml-fft
npm home ml-fft
