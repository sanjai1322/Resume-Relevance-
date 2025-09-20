import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-5xl md:text-7xl font-bold font-poppins bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
        🚀 Resume Relevance Checker
      </h1>
      <p className="mt-4 text-lg md:text-xl max-w-2xl text-slate-300">
        A smart AI-powered system that evaluates resumes against job descriptions.
      </p>
      
      <div className="mt-10 max-w-3xl mx-auto">
          <ul className="space-y-4 text-left text-slate-300">
              <li className="flex items-start">
                  <span className="bg-amber-400 text-indigo-950 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-1 text-sm flex-shrink-0">✓</span>
                  <span><strong>Save Time for Recruiters:</strong> Instantly filter and rank candidates based on skill alignment, cutting down manual review hours.</span>
              </li>
              <li className="flex items-start">
                  <span className="bg-amber-400 text-indigo-950 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-1 text-sm flex-shrink-0">✓</span>
                  <span><strong>Empower Job Seekers:</strong> Get immediate, clear feedback on missing skills to better tailor resumes for job applications.</span>
              </li>
              <li className="flex items-start">
                  <span className="bg-amber-400 text-indigo-950 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-1 text-sm flex-shrink-0">✓</span>
                  <span><strong>Ensure Fair Hiring:</strong> Utilize objective, AI-backed scoring to reduce bias and focus on the most qualified applicants.</span>
              </li>
          </ul>
      </div>

      <button
        onClick={onGetStarted}
        className="mt-12 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold text-xl py-4 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        ✨ Get Started
      </button>
    </div>
  );
};

export default LandingPage;