import React, { useState, useCallback, useMemo } from 'react';
import { ResumeAnalysis, JDSkills as JDSkillsType } from '../types';
import { getExplanation } from '../services/geminiService';
import Spinner from './Spinner';

interface ResumeCardProps {
  analysis: ResumeAnalysis;
  jdSkills: JDSkillsType;
}

const getVerdictClasses = (verdict: 'High' | 'Medium' | 'Low') => {
  switch (verdict) {
    case 'High':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Low':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let colorClass = 'stroke-red-500';
    if (score >= 75) {
        colorClass = 'stroke-green-500';
    } else if (score >= 50) {
        colorClass = 'stroke-yellow-500';
    }

    return (
        <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="h-full w-full" viewBox="0 0 70 70">
                <circle
                    className="stroke-slate-700"
                    strokeWidth="5"
                    fill="transparent"
                    r={radius}
                    cx="35"
                    cy="35"
                />
                <circle
                    className={`transition-all duration-1000 ease-out ${colorClass}`}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="35"
                    cy="35"
                    transform="rotate(-90 35 35)"
                />
            </svg>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-slate-200">
                {score}
            </span>
        </div>
    );
};


const ResumeCard: React.FC<ResumeCardProps> = ({ analysis, jdSkills }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const verdictClasses = getVerdictClasses(analysis.verdict);

  const allJdSkills = useMemo(() => {
    const skillSet = new Set([...jdSkills.hardSkills, ...jdSkills.softSkills]);
    return Array.from(skillSet);
  }, [jdSkills.hardSkills, jdSkills.softSkills]);

  const handleGetExplanation = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await getExplanation(analysis, jdSkills);
      setExplanation(result);
    } catch (err) {
      console.error("Failed to get explanation:", err);
      setError("Could not generate explanation.");
    } finally {
      setIsGenerating(false);
    }
  }, [analysis, jdSkills]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-lg transition-all hover:shadow-amber-500/10 hover:border-slate-600">
      <div className="p-5 flex items-start gap-4">
        <ScoreCircle score={analysis.finalScore} />
        <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-slate-200 truncate pr-2" title={analysis.fileName}>{analysis.fileName}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${verdictClasses} flex-shrink-0`}>{analysis.verdict} Match</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{analysis.summary}</p>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-semibold text-amber-400 hover:text-amber-300 w-full text-left flex items-center">
          {isExpanded ? 'Hide Details' : 'Show Details'}
          <span className={`ml-1 transition-transform transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>▼</span>
        </button>

        {isExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                 <div>
                    <h4 className="font-semibold text-slate-300 text-sm mb-2">JD Skill Checklist</h4>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-1 text-sm custom-scrollbar">
                        {allJdSkills.map(skill => {
                            const isMatched = analysis.matchedSkills.includes(skill);
                            return (
                                <div key={skill} className="flex items-center">
                                    <span className={`mr-2 flex-shrink-0 ${isMatched ? 'text-green-400' : 'text-red-400'}`}>
                                        {isMatched ? '✅' : '❌'}
                                    </span>
                                    <span className={isMatched ? 'text-slate-300' : 'text-slate-500 line-through'}>
                                        {skill}
                                    </span>
                                </div>
                            );
                        })}
                         {allJdSkills.length === 0 && <p className="text-slate-500">No skills were extracted from the job description.</p>}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                    {!explanation && !isGenerating && !error && (
                        <button 
                            onClick={handleGetExplanation}
                            className="bg-slate-700 hover:bg-slate-600 text-amber-400 font-semibold py-2 px-4 rounded-lg w-full transition-colors text-sm"
                        >
                           Get AI Explanation
                        </button>
                    )}
                    {isGenerating && (
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <Spinner small />
                            <span>Generating...</span>
                        </div>
                    )}
                     {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    {explanation && (
                        <div>
                            <h4 className="font-semibold text-slate-300 text-sm mb-2">AI Explanation</h4>
                            <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-md border border-slate-700">{explanation}</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCard;