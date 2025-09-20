import React, { useState, useCallback } from 'react';
import { Page, AnalysisResult } from './types';
import LandingPage from './components/LandingPage';
import JDUploadPage from './components/JDUploadPage';
import ResumeUploadPage from './components/ResumeUploadPage';
import ResultsPage from './components/ResultsPage';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import { analyzeResumes } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resumes, setResumes] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    setCurrentPage(Page.JD_UPLOAD);
  };

  const handleJDUpload = (file: File) => {
    setJobDescription(file);
    setCurrentPage(Page.RESUME_UPLOAD);
  };

  const handleAnalysis = useCallback(async (resumeFiles: File[]) => {
    if (!jobDescription) {
      setError("Job description is missing.");
      return;
    }
    setResumes(resumeFiles);
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeResumes(jobDescription, resumeFiles);
      setAnalysisResult(result);
      setCurrentPage(Page.RESULTS);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("An error occurred during analysis. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription]);

  const handleReset = () => {
    setJobDescription(null);
    setResumes([]);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setCurrentPage(Page.LANDING);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Spinner />
          <p className="text-xl text-amber-300 mt-4 font-poppins">Analyzing Resumes... This may take a moment.</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h2 className="text-2xl text-red-500 font-bold mb-4">Analysis Failed</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <button
                onClick={handleReset}
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all"
            >
                Try Again
            </button>
        </div>
       );
    }

    switch (currentPage) {
      case Page.LANDING:
        return <LandingPage onGetStarted={handleGetStarted} />;
      case Page.JD_UPLOAD:
        return <JDUploadPage onJDUpload={handleJDUpload} />;
      case Page.RESUME_UPLOAD:
        return <ResumeUploadPage onAnalyze={handleAnalysis} jdFile={jobDescription} />;
      case Page.RESULTS:
        return analysisResult ? <ResultsPage result={analysisResult} onReset={handleReset} /> : <p>No results to display.</p>;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;