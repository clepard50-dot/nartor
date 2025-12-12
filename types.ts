export interface PDFData {
  file: File;
  name: string;
  numPages: number;
}

export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Fenrir = 'Fenrir',
  Charon = 'Charon',
  Zephyr = 'Zephyr',
}

export interface VoiceOption {
  id: VoiceName;
  name: string;
  gender: 'Male' | 'Female';
  style: string;
  description: string;
}

export const AVAILABLE_VOICES: VoiceOption[] = [
  { 
    id: VoiceName.Kore, 
    name: 'Kore', 
    gender: 'Female', 
    style: 'Soothing & Narration',
    description: 'Perfect for fiction and storytelling with a calm demeanor.'
  },
  { 
    id: VoiceName.Fenrir, 
    name: 'Fenrir', 
    gender: 'Male', 
    style: 'Deep & Authoritative',
    description: 'Ideal for technical documents, lectures, and serious prose.'
  },
  { 
    id: VoiceName.Puck, 
    name: 'Puck', 
    gender: 'Male', 
    style: 'Neutral & Clear',
    description: 'Great for general reading, articles, and news.'
  },
  { 
    id: VoiceName.Charon, 
    name: 'Charon', 
    gender: 'Male', 
    style: 'Deep & Resonant',
    description: 'A strong voice for dramatic reading.'
  },
  { 
    id: VoiceName.Zephyr, 
    name: 'Zephyr', 
    gender: 'Female', 
    style: 'Bright & Standard',
    description: 'Energetic and clear, good for quick information.'
  },
];

export interface AIModel {
  id: string;
  name: string;
  category: 'Audio Generation' | 'Multimodal' | 'Text Analysis';
  tier: 'Pro' | 'Flash' | 'Experimental';
  description: string;
  capabilities: string[];
}

export const GOOGLE_MODELS: AIModel[] = [
  {
    id: 'gemini-2.5-flash-preview-tts',
    name: 'Gemini 2.5 Flash TTS',
    category: 'Audio Generation',
    tier: 'Flash',
    description: 'Google\'s latest high-efficiency speech synthesis model. Optimized for low latency and natural prosody.',
    capabilities: ['Text-to-Speech', 'Native Audio Output', 'Low Latency']
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    category: 'Multimodal',
    tier: 'Flash',
    description: 'The standard for high-volume tasks. (Used here for text analysis if needed).',
    capabilities: ['Text Generation', 'Vision', 'Function Calling']
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3.0 Pro',
    category: 'Text Analysis',
    tier: 'Pro',
    description: 'Google\'s most capable reasoning model. Best for complex text understanding.',
    capabilities: ['Complex Reasoning', 'Coding', 'Nuanced Writing']
  }
];

export interface ProcessingStatus {
  step: 'idle' | 'extracting' | 'generating' | 'complete' | 'error';
  message?: string;
}
