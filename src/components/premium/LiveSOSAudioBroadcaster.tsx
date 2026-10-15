import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, AlertTriangle, Radio, Play, Pause, BellRing } from 'lucide-react';

export const LiveSOSAudioBroadcaster: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMode, setSoundMode] = useState<'siren' | 'speech'>('speech');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sirenIntervalRef = useRef<any>(null);

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      let high = false;
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const targetFreq = high ? 650 : 900;
        osc.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.1);
        high = !high;
      }, 500);

      setIsPlaying(true);
    } catch (e) {
      console.error('Audio Context Error', e);
    }
  };

  const stopSiren = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch {}
      oscillatorRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const speakAlert = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('জরুরি রক্ত প্রয়োজন! বরিশাল রক্ত সেবা কেন্দ্রে যোগাযোগ করুন।');
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const toggleBroadcast = () => {
    if (isPlaying) {
      stopSiren();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      if (soundMode === 'siren') {
        startSiren();
      } else {
        speakAlert();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSiren();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              লাইভ এসওএস অডিও ব্রডকাস্টার (SOS Alert Broadcaster)
            </h3>
            <p className="text-xs text-slate-500">
              জরুরি মুহূর্তে ভয়েস অ্যালার্ম ও সাইরেন ব্রডকাস্ট করে রক্তদাতাদের সতর্ক করুন
            </p>
          </div>
        </div>
      </div>

      {/* Control Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            {isPlaying ? (
              <BellRing className="w-7 h-7 text-amber-300 animate-bounce" />
            ) : (
              <Volume2 className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <h4 className="text-base font-bold">
              {isPlaying ? 'জরুরি অ্যালার্ম বাজছে...' : 'অ্যালার্ম মোড নির্বাচন করুন'}
            </h4>
            <p className="text-xs text-red-100">
              হাসপাতাল ও নিকটস্থ কেন্দ্রে অবিলম্বে রক্তদাতাদের দৃষ্টি আকর্ষণ করতে এটি সহায়ক
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => {
                if (isPlaying) toggleBroadcast();
                setSoundMode('speech');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                soundMode === 'speech' ? 'bg-white text-red-700 shadow-sm' : 'text-white/80'
              }`}
            >
              বাংলা ভয়েস
            </button>
            <button
              onClick={() => {
                if (isPlaying) toggleBroadcast();
                setSoundMode('siren');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                soundMode === 'siren' ? 'bg-white text-red-700 shadow-sm' : 'text-white/80'
              }`}
            >
              সাইরেন
            </button>
          </div>

          <button
            onClick={toggleBroadcast}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-white hover:bg-slate-100 text-red-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>থামান</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-red-700" />
                <span>অ্যালার্ম বাজান</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
