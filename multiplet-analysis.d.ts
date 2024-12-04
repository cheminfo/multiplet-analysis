import { DataXY } from 'cheminfo-types';

declare module 'multiplet-analysis' {
  export interface AnalizeMultipletOptions {
    /**
     * @default 400
     */
    frequency?: number;
    /**
     * @default false
     */
    debug?: boolean;
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
    sign?: number;
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

  export function analyseMultiplet(
    data: DataXY,
    options?: AnalizeMultipletOptions,
  );
}
