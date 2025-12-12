import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";

// Default API_KEY from Vite environment variables
const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Custom API key storage (localStorage)
const CUSTOM_KEY_STORAGE = 'narrator_custom_api_key';

export const getCustomApiKey = (): string => {
  return localStorage.getItem(CUSTOM_KEY_STORAGE) || '';
};

export const setCustomApiKey = (key: string): void => {
  if (key.trim()) {
    localStorage.setItem(CUSTOM_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(CUSTOM_KEY_STORAGE);
  }
};

const getApiKey = (): string => {
  return getCustomApiKey() || DEFAULT_API_KEY;
};

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

/**
 * Helper to construct a WAV header for the raw PCM data.
 * Gemini 2.5 Flash TTS typically returns 24kHz, 1 channel, 16-bit PCM.
 */
const createWavHeader = (dataLength: number, sampleRate: number = 24000, numChannels: number = 1, bitsPerSample: number = 16) => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length (file size - 8)
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataLength, true);

  return header;
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

export const generateSpeechFromText = async (
  text: string,
  voice: VoiceName
): Promise<string> => {
  if (!text.trim()) {
    throw new Error("No text provided for generation.");
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing. Please add your Gemini API key in settings.");
  }

  const ai = getAiClient();

  // Construct a robust prompt. We move instructions into the text to ensure the model adheres to them.
  const promptText = `
    Task: Read the following text as a professional audiobook narrator.
    Style: Clear, engaging, and well-paced.
    Instructions:
    - Do NOT read page numbers (e.g., "--- Page 5 ---").
    - Do NOT read visual formatting markers.
    - Transition smoothly between sections.
    
    Text to read:
    "${text}"
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{
        parts: [{ text: promptText }]
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    // Check for text refusal/error first
    const candidate = response.candidates?.[0];
    const textPart = candidate?.content?.parts?.find(p => p.text);
    if (textPart && !candidate?.content?.parts?.find(p => p.inlineData)) {
      console.warn("Model returned text instead of audio:", textPart.text);
      throw new Error(`Model returned text response: ${textPart.text.substring(0, 100)}...`);
    }

    const base64Audio = candidate?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data returned from Gemini. The text might be too long or violated safety policies.");
    }

    // Decode Base64 to Raw PCM
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const pcmBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      pcmBytes[i] = binaryString.charCodeAt(i);
    }

    // Add WAV Header
    // Gemini 2.5 Flash TTS output is typically 24kHz, Mono, 16-bit PCM
    const wavHeader = createWavHeader(pcmBytes.length, 24000, 1, 16);
    
    // Combine Header + PCM
    const wavBlob = new Blob([wavHeader, pcmBytes], { type: 'audio/wav' });
    
    return URL.createObjectURL(wavBlob);

  } catch (error: any) {
    console.error("Gemini TTS Error details:", error);
    if (error.message?.includes('400')) {
       throw new Error("Request failed (400). The text might be too long for a single request. Try reducing the page range.");
    }
    throw error;
  }
};
