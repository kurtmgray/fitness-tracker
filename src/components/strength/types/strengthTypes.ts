export type Gender = 'male' | 'female';

export type LiftType =
  | 'squat'
  | 'deadlift'
  | 'bench'
  | 'overheadPress'
  | 'romanianDeadlift';

export type StrengthLevel =
  | 'untrained'
  | 'novice'
  | 'intermediate'
  | 'advanced'
  | 'elite';

export interface Weights {
  squat: number;
  deadlift: number;
  bench: number;
  overheadPress: number;
  romanianDeadlift: number;
}

export interface LiftStandards {
  untrained: number;
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
}

export interface GenderStandards {
  male: Record<LiftType, LiftStandards>;
  female: Record<LiftType, LiftStandards>;
}

export interface ProgressInfo {
  nextLevel: StrengthLevel;
  progress: number;
  nextWeight: number;
}

export interface LiftResult {
  level: StrengthLevel;
  ratio: string;
  progress: ProgressInfo;
  color: string;
}

export interface Analysis {
  overallLevel: StrengthLevel;
  strongestLift: string;
  intermediateLifts: number;
  totalLifts: number;
  nextLevel: StrengthLevel;
}

export interface AIAnalysis {
  insights: string[];
  recommendations: string[];
  overallAssessment: StrengthLevel;
}