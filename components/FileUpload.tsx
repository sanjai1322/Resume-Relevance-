import React, { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string;
  icon: string;
  title: string;
  subtitle: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, multiple = false, acceptedFileTypes, icon, title, subtitle }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    onFilesSelect(fileArray);
  }, [onFilesSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const draggingClasses = isDragging ? 'border-amber-400 bg-gradient-to-br from-amber-500/10 to-transparent' : 'border-slate-600 hover:border-amber-500';

  return (
    <div>
        <div
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${draggingClasses}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            />
            <div className="text-6xl mb-4">{icon}</div>
            <p className="font-semibold text-slate-300">{title}</p>
            <p className="text-sm text-slate-400">{subtitle}</p>
        </div>

        {selectedFiles.length > 0 && (
            <div className="mt-4 text-left">
                <h4 className="font-semibold text-slate-300">Selected file(s):</h4>
                <ul className="list-disc list-inside text-amber-400 text-sm max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default FileUpload;