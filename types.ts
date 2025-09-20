export enum Page {
  LANDING,
  JD_UPLOAD,
  RESUME_UPLOAD,
  RESULTS,
}

export interface JDSkills {
  hardSkills: string[];
  softSkills: string[];
}

export interface ResumeAnalysis {
  fileName: string;
  finalScore: number;
  verdict: 'High' | 'Medium' | 'Low';
  hardSkillScore: number;
  softSkillScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

export interface AnalysisResult {
  jdSkills: JDSkills;
  resumeAnalyses: ResumeAnalysis[];
}
