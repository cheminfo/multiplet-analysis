# multiplet-analysis

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

The goal of this project is to be able to determine the multiplicity of
a NMR signal as well as the coupling constants. It is based on a delta-function deconvolution
developed by D. Jeannerat and G. Bodenhausen
and [published](https://www.sciencedirect.com/science/article/abs/pii/S1090780799918451?via%3Dihub) in *J. Magn. Reson.* **1999**, 141(1), p133 doi:10.1006/jmre.1999.1845. 
More info and discussion in doc/README.md 
The result of the analysis that is an object composed:

- delta
- multiplicity : m (massif if delta is unspecified), s, s br, d br. We can repeat the multiplicity in this field but if it is empty we should use it from coupling constants array.
- peak: [{x: , y:, z:, width}, {x: , y:, z:, width}, ]
- j []
  - multiplicity: (d, t, q, p pent quint, sext hex, sept hept, oct, non)
  - coupling: (Hz)

[Technical information](docs/index.html)

## Run example

```
node -r esm examples/quadruplet.js
node -r esm examples/ddd.js
node -r esm examples/ddd_ABCD.js
node -r esm examples/doublet.js

node -r esm examples/simulate.js; # to simulate from a user-defined spin system
node -r esm examples/dd-exp.js; # to simulate from a user-defined spin system
node -r esm examples/asymDoublet.js; # to simulate from a user-defined spin system
```


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

### Debugging data

In order to debug algorithm it is important to be able to visualize them. In the project we added a folder `/examples/web` that contains `index.html`.
This webpage will load `data.json` and `annotations.json` and display a chart.

To automatically use and refresh this webpage you should install the plugin `Live server` typing `code --install-extension ritwickdey.liveserver`. Then, right click on `index.html` and `open with live server`.
This will open the webpage in the browser and reload it if the files change.

There are also 2 examples files to create the data:

- exampleGenerateAnnotations : create an array of annotations
- exampleGenerateData : create an object like {x:[], y:[]}

When you clone / update the project don't forget to `npm i` to load possible new dependencies.

If you want to execute those scripts written as module you need to use `esm` that is installed as a development dependency.
`npm install esm`
`node -r esm ./examples/web/exampleGenerateAnnotations.js`

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

## Demo and examples

[Main scientific page](docs/main.md).

[example 1](docs/index3.html).

[example 2](docs/index2.html).
