import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ScriptInput from './components/ScriptInput';
import Storyboard from './components/Storyboard';
import Chatbot from './components/Chatbot';
import { Scene } from './types';
import { parseScriptToScenes, generateImageForScene } from './services/geminiService';
import { VoiceChatIcon } from './components/icons';

const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleGenerateStoryboard = useCallback(async (scriptText: string) => {
    setScenes([]);
    setError(null);
    setIsLoadingScript(true);
    
    try {
      const sceneDescriptions = await parseScriptToScenes(scriptText);
      setIsLoadingScript(false);
      
      const initialScenes: Scene[] = sceneDescriptions.map((desc, i) => ({
        id: `scene-${Date.now()}-${i}`,
        description: desc,
        imageUrl: null,
        status: 'pending',
      }));
      setScenes(initialScenes);

      for (const scene of initialScenes) {
        setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'generating' } : s));
        try {
          const imageUrl = await generateImageForScene(scene.description);
          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, imageUrl, status: 'done' } : s));
        } catch (imgErr) {
          console.error(`Failed to generate image for scene: ${scene.id}`, imgErr);
          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'error' } : s));
        }
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoadingScript(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <Header />
        <main className="mt-12 space-y-12">
          <div className="max-w-3xl mx-auto">
            <ScriptInput onGenerate={handleGenerateStoryboard} isLoading={isLoadingScript} />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg max-w-3xl mx-auto">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="w-full">
            <Storyboard scenes={scenes} />
          </div>
        </main>
      </div>

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-40"
        aria-label="Open AI Assistant"
      >
        <VoiceChatIcon className="w-8 h-8" />
      </button>

      <Chatbot isVisible={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
