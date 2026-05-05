export type Sign = 1 | -1;

export interface AnalyseMultipletOptions {
  /**
   * @default 400
   */
  frequency?: number;
  /**
   * @default 20
   */
  maxTestedJ?: number;
  /**
   * @default 1
   */
  minTestedJ?: number;
  /**
   * @default false
   */
  checkSymmetryFirst?: boolean;
  /**
   * @default 0.01
   */
  minimalResolution?: number;
  /**
   * @default true
   */
  correctVerticalOffset?: boolean;
  /**
   * @default true
   */
  makeShortCutForSpeed?: boolean;
  /**
   * @default 0.9
   */
  critFoundJ?: number;
  /**
   * @default 1
   */
  sign?: Sign;
  /**
   * @default true
   */
  chopTail?: boolean;
  /**
   * @default 0.5
   */
  multiplicity?: number;
  /**
   * @default false
   */
  symmetrizeEachStep?: boolean;
  /**
   * @default false
   */
  takeBestPartMultiplet?: boolean;
  /**
   * @default 0
   */
  addPhaseInterpolation?: number;
  /**
   * @default 0
   */
  forceFirstDeconvolutionToThisValue?: number;
  /**
   * @default 0
   */
  appliedPhaseCorrectionType?: number;
  /**
   * @default true
   */
  decreasingJvalues?: boolean;
  /**
   * @default 2
   */
  jumpUpAfterFoundValue?: number;
}

export interface AnalyseMultipletJCoupling {
  multiplicity: string;
  coupling: number;
}

export interface AnalyseMultipletResult {
  js: AnalyseMultipletJCoupling[];
  phaseCorrectionOnMultipletInDeg: number;
  chemShift: number;
}

export interface AnalyseMultipletDebugStep {
  multiplet: {
    x: number[];
    y: number[];
    s: number[];
  };
  errorFunction: {
    x: number[];
    y: number[];
  };
}

export interface AnalyseMultipletDebugData {
  steps: AnalyseMultipletDebugStep[];
}
