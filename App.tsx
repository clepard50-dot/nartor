import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ControlPanel } from './components/ControlPanel';
import { AudioResult } from './components/AudioResult';
import { loadPDF, extractTextFromPages } from './services/pdfUtils';
import { generateSpeechFromText } from './services/gemini';
import { PDFData, VoiceName, ProcessingStatus } from './types';

type AppView = 'upload' | 'config' | 'result';

function App() {
  const [view, setView] = useState<AppView>('upload');
  
  // Data State
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  
  // Configuration State
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(VoiceName.Kore);
  const [selectedModelId, setSelectedModelId] = useState<string>('gemini-2.5-flash-preview-tts');
  
  // Output State
  const [status, setStatus] = useState<ProcessingStatus>({ step: 'idle' });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setStatus({ step: 'idle', message: 'Analyzing PDF structure...' });
      const doc = await loadPDF(file);
      
      setPdfDoc(doc);
      setPdfData({
        file,
        name: file.name.replace('.pdf', ''),
        numPages: doc.numPages,
      });
      
      setStartPage(1);
      setEndPage(Math.min(doc.numPages, 5));
      setView('config');
    } catch (error) {
      console.error("Error loading PDF", error);
      setStatus({ step: 'error', message: 'Failed to parse PDF. Please try a different file.' });
    }
  };

  const handleGenerate = async () => {
    if (!pdfDoc) return;

    setStatus({ step: 'extracting', message: 'Reading document content...' });
    
    try {
      const text = await extractTextFromPages(pdfDoc, startPage, endPage);
      
      if (text.length < 10) {
        throw new Error("The text extracted is too short. The PDF might be an image scan.");
      }
      
      setStatus({ step: 'generating', message: 'Gemini is narrating your audiobook...' });
      
      // We pass the selected voice to the service
      const url = await generateSpeechFromText(text, selectedVoice);
      
      setAudioUrl(url);
      setStatus({ step: 'complete' });
      setView('result');

    } catch (error: any) {
      console.error("Generation Error", error);
      setStatus({ step: 'error', message: error.message || 'An error occurred during generation.' });
    }
  };

  const handleBackToConfig = () => {
    // Preserve data, just change view
    setView('config');
  };

  const handleReset = () => {
    setPdfData(null);
    setPdfDoc(null);
    setAudioUrl(null);
    setStatus({ step: 'idle' });
    setView('upload');
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-purple-50 to-blue-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => view !== 'upload' && setView('config')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <i className="fa-solid fa-wave-square"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900">
                NarrateAI
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Powered by Gemini</p>
            </div>
          </div>

          {pdfData && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white/50 backdrop-blur-md shadow-sm">
              <i className="fa-solid fa-file-pdf text-red-500"></i>
              <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{pdfData.name}</span>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        
        {/* View: Upload */}
        {view === 'upload' && (
          <div className="animate-fade-in-up space-y-12">
            <div className="text-center space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100 shadow-sm">
                Next-Gen Audio Synthesis
              </span>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Turn Documents into <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                  Lifelike Audiobooks
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Experience the power of Google's <strong>Gemini 2.5 Flash</strong> models. 
                Upload any PDF and instantly convert it into a professionally narrated audio experience with semantic understanding.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto bg-white/60 p-3 rounded-[2rem] shadow-xl shadow-indigo-100/50 backdrop-blur-sm border border-white">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              {[
                { icon: 'fa-brain', title: 'Smart Parsing', desc: 'Intelligently skips headers and page numbers.' },
                { icon: 'fa-users-viewfinder', title: 'Neural Voices', desc: 'Choose from 5 distinct narration styles.' },
                { icon: 'fa-bolt', title: 'Flash Speed', desc: 'Powered by Gemini 2.5 Flash low-latency API.' }
              ].map((f, i) => (
                <div key={i} className="bg-white/40 p-6 rounded-2xl border border-white/50 hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4 text-xl">
                    <i className={`fa-solid ${f.icon}`}></i>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View: Config */}
        {view === 'config' && pdfData && (
          <div className="animate-fade-in">
             <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Configuration</h2>
                <button onClick={handleReset} className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50">
                  <i className="fa-solid fa-trash-can"></i> Start Over
                </button>
             </div>

             <ControlPanel
               numPages={pdfData.numPages}
               startPage={startPage}
               endPage={endPage}
               selectedVoice={selectedVoice}
               selectedModelId={selectedModelId}
               onStartPageChange={(val) => setStartPage(Math.min(val, endPage))}
               onEndPageChange={(val) => setEndPage(Math.max(val, startPage))}
               onVoiceChange={setSelectedVoice}
               onModelChange={setSelectedModelId}
               isGenerating={status.step === 'generating' || status.step === 'extracting'}
               onGenerate={handleGenerate}
               existingAudio={!!audioUrl}
               onGoToResult={() => setView('result')}
             />

              {status.step === 'error' && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3 animate-shake shadow-sm">
                  <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                  <span className="font-medium">{status.message}</span>
                </div>
              )}
          </div>
        )}

        {/* View: Result */}
        {view === 'result' && audioUrl && pdfData && (
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={handleBackToConfig}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
            >
              <i className="fa-solid fa-arrow-left transform group-hover:-translate-x-1 transition-transform"></i>
              Back to Settings
            </button>
            <AudioResult 
              audioUrl={audioUrl} 
              fileName={pdfData.name}
              onReset={handleReset}
            />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
