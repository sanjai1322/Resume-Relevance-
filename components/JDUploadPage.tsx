import React from 'react';
import FileUpload from './FileUpload';

interface JDUploadPageProps {
  onJDUpload: (file: File) => void;
}

const JDUploadPage: React.FC<JDUploadPageProps> = ({ onJDUpload }) => {
    
  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      onJDUpload(files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold font-poppins bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-2">Step 1: Upload Job Description</h2>
            <p className="text-slate-400 mb-6">Provide the job description to establish a baseline for analysis.</p>
            <FileUpload
                onFilesSelect={handleFileSelect}
                acceptedFileTypes=".pdf,.docx,.txt"
                multiple={false}
                icon="📂"
                title="Drag & Drop Job Description Here"
                subtitle="or click to browse"
            />
            <p className="text-xs text-slate-500 mt-4">Supported formats: PDF, DOCX, TXT</p>
        </div>
    </div>
  );
};

export default JDUploadPage;