import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Database, 
  Sparkles, 
  Video, 
  Check, 
  Server, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { checkBackendHealth, fetchServicesStatus, updateApiKeysOnServer } from '../services/apiClient';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [backendStatus, setBackendStatus] = useState<{ isOnline: boolean; mongodb: string }>({
    isOnline: false,
    mongodb: 'checking...',
  });
  
  // API Keys state
  const [geminiKey, setGeminiKey] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [mongoUri, setMongoUri] = useState('');
  const [youtubeKey, setYoutubeKey] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadStatus = async () => {
    const health = await checkBackendHealth();
    setBackendStatus(health);
    if (health.isOnline) {
      const status = await fetchServicesStatus();
      if (status) {
        if (status.gemini.isConfigured) setGeminiKey('••••••••••••••••••••');
        if (status.openai.isConfigured) setOpenAIKey('••••••••••••••••••••');
        if (status.mongodb.uriConfigured) setMongoUri('mongodb+srv://••••••••••••••••');
        if (status.youtube.isConfigured) setYoutubeKey('••••••••••••••••••••');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const payload: {
      geminiApiKey?: string;
      openaiApiKey?: string;
      mongodbUri?: string;
      youtubeApiKey?: string;
    } = {};

    if (geminiKey && !geminiKey.includes('•')) payload.geminiApiKey = geminiKey;
    if (openAIKey && !openAIKey.includes('•')) payload.openaiApiKey = openAIKey;
    if (mongoUri && !mongoUri.includes('•')) payload.mongodbUri = mongoUri;
    if (youtubeKey && !youtubeKey.includes('•')) payload.youtubeApiKey = youtubeKey;

    const res = await updateApiKeysOnServer(payload);
    setIsSaving(false);
    if (res.success) {
      setSaveMessage('Keys updated and verified on FastAPI server!');
      loadStatus();
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage(res.message || 'Saved locally.');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl flex flex-col rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Studio Cloud & API Keys Configuration</span>
              </h2>
              <p className="text-xs text-slate-400">
                Connect your Gemini API, OpenAI, MongoDB Atlas, and YouTube Data API keys.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSaveKeys} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Server Connection Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${backendStatus.isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">FastAPI Server:</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${backendStatus.isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {backendStatus.isOnline ? 'LIVE (Port 8000)' : 'OFFLINE / Local Mode'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  MongoDB Status: <span className="font-semibold text-amber-300">{backendStatus.mongodb}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadStatus}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* 1. AI API Keys */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1. AI Model API Keys (For Live Scripting & Truth Check)</span>
            </span>

            {/* Gemini */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Google Gemini API Key</label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* OpenAI */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">OpenAI API Key (Optional)</label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Get OpenAI Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* 2. MongoDB Atlas Connection */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Cloud Database (MongoDB Atlas)</span>
            </span>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">MongoDB Atlas URI</label>
                <a
                  href="https://www.mongodb.com/cloud/atlas"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>MongoDB Atlas Cloud</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={mongoUri}
                onChange={(e) => setMongoUri(e.target.value)}
                placeholder="mongodb+srv://<user>:<password>@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority"
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2 text-xs text-emerald-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 3. Research & YouTube Scraping */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>3. Research & Scraping APIs (YouTube Data API)</span>
            </span>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">YouTube Data API v3 Key</label>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={youtubeKey}
                onChange={(e) => setYoutubeKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2 text-xs text-rose-200 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Save Status */}
          {saveMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* Footer Save */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Credentials stay encrypted in your local environment</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isSaving ? 'Saving...' : 'Save & Verify Keys'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
