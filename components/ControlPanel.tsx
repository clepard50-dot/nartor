import React from 'react';
import { AVAILABLE_VOICES, GOOGLE_MODELS, VoiceName, VoiceOption, AIModel } from '../types';

interface ControlPanelProps {
  numPages: number;
  startPage: number;
  endPage: number;
  selectedVoice: VoiceName;
  selectedModelId: string;
  onStartPageChange: (page: number) => void;
  onEndPageChange: (page: number) => void;
  onVoiceChange: (voice: VoiceName) => void;
  onModelChange: (modelId: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  existingAudio: boolean;
  onGoToResult: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  numPages,
  startPage,
  endPage,
  selectedVoice,
  selectedModelId,
  onStartPageChange,
  onEndPageChange,
  onVoiceChange,
  onModelChange,
  isGenerating,
  onGenerate,
  existingAudio,
  onGoToResult
}) => {
  return (
    <div className="space-y-6">
      
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Model & Range */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Model Selection */}
          <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-lg shadow-slate-200/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-microchip"></i> AI Model
            </h3>
            
            <div className="space-y-3">
              {GOOGLE_MODELS.filter(m => m.category === 'Audio Generation').map((model) => (
                <div 
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    selectedModelId === model.id 
                    ? 'border-indigo-500 bg-indigo-50/50' 
                    : 'border-transparent bg-white hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-sm">{model.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      model.tier === 'Pro' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {model.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">{model.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    {model.capabilities.map(cap => (
                       <span key={cap} className="text-[9px] bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-600">{cap}</span>
                    ))}
                  </div>
                  {selectedModelId === model.id && (
                    <div className="absolute top-0 right-0 p-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Informational list of other model types available in the ecosystem */}
             <div className="mt-4 pt-4 border-t border-slate-200/50">
               <p className="text-[10px] text-slate-400 mb-2">OTHER AVAILABLE GEMINI CAPABILITIES</p>
               <div className="space-y-1 opacity-60 grayscale hover:grayscale-0 transition-all">
                  {GOOGLE_MODELS.filter(m => m.category !== 'Audio Generation').map(m => (
                    <div key={m.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-100/50">
                       <span className="font-medium">{m.name}</span>
                       <span className="text-[9px] border border-slate-200 px-1 rounded">{m.category}</span>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          {/* Range Selector */}
          <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-lg shadow-slate-200/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-book-open"></i> Page Range
            </h3>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">From</label>
                <input
                  type="number"
                  min={1}
                  max={endPage}
                  value={startPage}
                  onChange={(e) => onStartPageChange(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-white border-0 ring-1 ring-slate-200 rounded-lg text-center font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
              <div className="text-slate-300 pt-5"><i className="fa-solid fa-arrow-right"></i></div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">To</label>
                <input
                  type="number"
                  min={startPage}
                  max={numPages}
                  value={endPage}
                  onChange={(e) => onEndPageChange(parseInt(e.target.value) || numPages)}
                  className="w-full p-2.5 bg-white border-0 ring-1 ring-slate-200 rounded-lg text-center font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="mt-3 text-center">
               <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                 {endPage - startPage + 1} pages selected
               </span>
            </div>
          </div>

        </div>

        {/* Right Column: Voice & Action */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg shadow-slate-200/50 flex-grow">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <i className="fa-solid fa-users-viewfinder"></i> Select Narrator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_VOICES.map((voice: VoiceOption) => (
                <button
                  key={voice.id}
                  onClick={() => onVoiceChange(voice.id)}
                  className={`relative flex items-start p-4 rounded-2xl border-2 transition-all text-left group ${
                    selectedVoice === voice.id
                      ? 'border-indigo-500 bg-white shadow-lg shadow-indigo-100'
                      : 'border-transparent bg-white/50 hover:bg-white hover:border-indigo-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center mr-4 transition-colors ${
                    selectedVoice === voice.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                  }`}>
                    <i className={`fa-solid ${voice.gender === 'Female' ? 'fa-venus' : 'fa-mars'} text-xl`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`font-bold text-lg ${selectedVoice === voice.id ? 'text-indigo-900' : 'text-slate-700'}`}>{voice.name}</span>
                       <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 font-medium">{voice.gender}</span>
                    </div>
                    <div className="text-xs font-medium text-indigo-500 mb-1">{voice.style}</div>
                    <div className="text-xs text-slate-500 leading-tight opacity-80">{voice.description}</div>
                  </div>
                  
                  {selectedVoice === voice.id && (
                    <div className="absolute top-3 right-3 text-indigo-500">
                      <i className="fa-solid fa-circle-check text-lg"></i>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/60 shadow-xl shadow-indigo-200/40">
            <div className="flex gap-4">
               {existingAudio && !isGenerating && (
                 <button 
                    onClick={onGoToResult}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                 >
                   <i className="fa-solid fa-play"></i>
                   Play Existing Audio
                 </button>
               )}
               
               <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`flex-1 py-4 rounded-2xl text-white font-bold text-lg shadow-lg flex items-center justify-center transition-all transform ${
                  isGenerating
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-[1.01] hover:shadow-indigo-500/30'
                }`}
              >
                {isGenerating ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-3"></i>
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles mr-3"></i>
                    {existingAudio ? 'Generate New Audio' : 'Generate Audiobook'}
                  </>
                )}
              </button>
            </div>
            
            {isGenerating && (
               <div className="mt-3 text-center">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-1/3 animate-[shimmer_2s_infinite_linear]"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide font-semibold">Processing on Google Cloud</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
