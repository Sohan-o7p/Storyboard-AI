import React, { useState, useRef, useCallback } from 'react';
import Loader from './Loader';
import { UploadIcon } from './icons';

interface ScriptInputProps {
  onGenerate: (script: string) => void;
  isLoading: boolean;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ onGenerate, isLoading }) => {
  const [script, setScript] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScript(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleGenerateClick = useCallback(() => {
    if (script.trim() && !isLoading) {
      onGenerate(script);
    }
  }, [script, isLoading, onGenerate]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 w-full">
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Paste your script here..."
        className="w-full h-64 bg-gray-900/70 border border-gray-600 rounded-lg p-4 text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
        disabled={isLoading}
      />
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !script.trim()}
          className="w-full sm:w-auto flex-grow bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <Loader text="Analyzing Script..." />
          ) : (
            'Generate Storyboard'
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt, .md"
          disabled={isLoading}
        />
        <button
            onClick={triggerFileSelect}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            <UploadIcon className="w-5 h-5" />
            Upload Script
        </button>
      </div>
    </div>
  );
};

export default ScriptInput;
