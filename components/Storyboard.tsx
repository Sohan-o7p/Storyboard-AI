import React from 'react';
import { Scene } from '../types';
import Loader from './Loader';
import { ImageIcon } from './icons';

interface StoryboardProps {
  scenes: Scene[];
}

const Storyboard: React.FC<StoryboardProps> = ({ scenes }) => {
  if (scenes.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-gray-800/30 border-2 border-dashed border-gray-600 rounded-2xl text-gray-500 p-8">
        <ImageIcon className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold">Your storyboard will appear here.</h3>
        <p>Enter a script and click "Generate" to start.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {scenes.map((scene, index) => (
        <div key={scene.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex flex-col animate-fade-in">
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            {scene.status === 'done' && scene.imageUrl ? (
              <img src={scene.imageUrl} alt={scene.description} className="w-full h-full object-cover" />
            ) : scene.status === 'error' ? (
              <div className="p-4 text-red-400 text-center">
                <p>Failed to generate image.</p>
              </div>
            ) : (
              <Loader text={scene.status === 'generating' ? 'Generating Image...' : 'Waiting...'} />
            )}
          </div>
          <div className="p-4 flex-grow">
            <p className="text-sm text-gray-400">
              <span className="font-bold text-indigo-400">Scene {index + 1}:</span> {scene.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Storyboard;
