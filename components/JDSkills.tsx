import React from 'react';
import { JDSkills as JDSkillsType } from '../types';

interface JDSkillsProps {
  skills: JDSkillsType;
}

const JDSkills: React.FC<JDSkillsProps> = ({ skills }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl h-full">
      <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-4">Extracted JD Skills</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-slate-300 mb-3">Hard Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.hardSkills.map((skill, index) => (
            <span key={index} className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-xs font-bold px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-slate-300 mb-3">Soft Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.softSkills.map((skill, index) => (
            <span key={index} className="bg-gradient-to-r from-indigo-400 to-purple-500 text-indigo-950 text-xs font-bold px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JDSkills;