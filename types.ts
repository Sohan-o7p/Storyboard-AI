export interface Scene {
  id: string;
  description: string;
  imageUrl: string | null;
  status: 'pending' | 'generating' | 'done' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}
