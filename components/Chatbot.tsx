import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types';
import { createChat } from '../services/geminiService';
import { CloseIcon, SendIcon } from './icons';
import type { Chat } from '@google/genai';

interface ChatbotProps {
  isVisible: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && !chatRef.current) {
      chatRef.current = createChat();
      setMessages([
        { id: 'initial', role: 'model', content: "Hello! How can I help you with your storyboard or script?" }
      ]);
    }
  }, [isVisible]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const modelMessage: ChatMessage = { id: `model-${Date.now()}`, role: 'model', content: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = { id: `error-${Date.now()}`, role: 'model', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 w-[90vw] max-w-md h-[70vh] max-h-96 bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="font-bold text-white">AI Assistant</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>}
            <div className={`p-3 rounded-xl max-w-xs ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-300 rounded-bl-none'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <div className="p-3 rounded-xl bg-gray-700 text-gray-300 rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-900 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 text-indigo-400 hover:text-indigo-300 disabled:text-gray-600 transition-colors">
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
