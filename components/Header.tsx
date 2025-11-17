import React from 'react';
import { ImageIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex justify-center items-center gap-4 mb-4">
        <ImageIcon className="w-12 h-12 text-indigo-400" />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Storyboard AI
        </h1>
      </div>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
        Bring your script to life. Paste or upload your script, and watch as AI generates a complete visual storyboard in seconds.
      </p>
    </header>
  );
};

export default Header;
