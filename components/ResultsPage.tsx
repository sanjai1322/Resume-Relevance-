import React from 'react';
import { AnalysisResult } from '../types';
import JDSkills from './JDSkills';
import ResumeCard from './ResumeCard';
import ResultsCharts from './ResultsCharts';

interface ResultsPageProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, onReset }) => {

  const handleDownloadCSV = () => {
    if (!result?.resumeAnalyses) return;

    const escapeCSV = (str: string | number): string => {
        const text = String(str);
        if (/[",\n]/.test(text)) {
            return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
    };

    const headers = [
        "File Name",
        "Final Score",
        "Verdict",
        "Hard Skill Score",
        "Soft Skill Score",
        "Matched Skills",
        "Missing Skills",
        "Summary"
    ];

    const rows = result.resumeAnalyses.map(analysis => [
        escapeCSV(analysis.fileName),
        escapeCSV(analysis.finalScore),
        escapeCSV(analysis.verdict),
        escapeCSV(analysis.hardSkillScore),
        escapeCSV(analysis.softSkillScore),
        escapeCSV(analysis.matchedSkills.join('; ')),
        escapeCSV(analysis.missingSkills.join('; ')),
        escapeCSV(analysis.summary)
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "resume_analysis_results.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
          Analysis Results
        </h1>
        <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadCSV}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all"
            >
              Download CSV
            </button>
            <button
              onClick={onReset}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-slate-200 font-bold py-2 px-6 rounded-lg transition-all"
            >
              Start Over
            </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
        <ResultsCharts analyses={result.resumeAnalyses} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <JDSkills skills={result.jdSkills} />
        </div>
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-poppins text-slate-300">Candidate Rankings</h2>
            {result.resumeAnalyses
                .sort((a, b) => b.finalScore - a.finalScore)
                .map((analysis, index) => (
                    <ResumeCard key={index} analysis={analysis} jdSkills={result.jdSkills} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;