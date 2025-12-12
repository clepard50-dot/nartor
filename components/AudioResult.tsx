import React from 'react';

interface AudioResultProps {
  audioUrl: string;
  fileName: string;
  onReset: () => void;
}

export const AudioResult: React.FC<AudioResultProps> = ({ audioUrl, fileName, onReset }) => {
  return (
    <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-white animate-fade-in text-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>

      <div className="relative z-10">
        <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
          <i className="fa-solid fa-headphones text-4xl"></i>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Audio Generated</h2>
        <p className="text-slate-500 mb-8 font-medium">"{fileName}" is ready for listening.</p>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-inner mb-8 ring-4 ring-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
            <span>Preview</span>
            <span>Gemini TTS</span>
          </div>
          <audio controls className="w-full outline-none h-10 accent-indigo-500" src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={audioUrl}
            download={`NarrateAI-${fileName}.wav`}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-download"></i>
            Download Audio File
          </a>
          
          <button
            onClick={onReset}
            className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Upload Another PDF
          </button>
        </div>
      </div>
    </div>
  );
};
