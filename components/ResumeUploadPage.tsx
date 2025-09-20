import React, { useState } from 'react';
import FileUpload from './FileUpload';

interface ResumeUploadPageProps {
  onAnalyze: (files: File[]) => void;
  jdFile: File | null;
}

const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({ onAnalyze, jdFile }) => {
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);

  const handleFilesSelect = (files: File[]) => {
    setResumeFiles(files);
  };

  const handleAnalyzeClick = () => {
    if (resumeFiles.length > 0) {
      onAnalyze(resumeFiles);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold font-poppins bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-2">Step 2: Upload Resumes</h2>
            <p className="text-slate-400 mb-6">Upload one or more resumes for analysis against the job description.</p>
            
            <div className="bg-slate-900 border border-dashed border-slate-600 rounded-lg p-3 text-left mb-6 flex items-center">
                <span className="text-2xl mr-3">📄</span>
                <div>
                    <p className="font-semibold text-slate-300">Job Description:</p>
                    <p className="text-sm text-amber-400">{jdFile?.name || 'No file selected'}</p>
                </div>
            </div>

            <FileUpload
                onFilesSelect={handleFilesSelect}
                acceptedFileTypes=".pdf,.docx,.txt"
                multiple={true}
                icon="📄"
                title="Drag & Drop Resumes Here"
                subtitle="or click to browse"
            />
            
            <button
                onClick={handleAnalyzeClick}
                disabled={resumeFiles.length === 0}
                className="mt-8 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold text-lg py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100"
            >
                Analyze {resumeFiles.length > 0 ? `(${resumeFiles.length})` : ''}
            </button>
        </div>
    </div>
  );
};

export default ResumeUploadPage;