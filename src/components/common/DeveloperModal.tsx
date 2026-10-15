import React from 'react';
import {
  Code2,
  Sparkles,
  ShieldCheck,
  Heart,
  Globe,
  Terminal,
  Cpu,
  Layers,
  X,
  Award,
  ExternalLink,
  Smartphone,
  Database,
  Cloud,
  Bot,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCloudflareModal?: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose,
  onOpenCloudflareModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800">
        {/* Header Ribbon with Gradient */}
        <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-red-200 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>সফটওয়্যার স্থপতি ও কারিগরি দল</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>MD. SAIDUL ISLAM</span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs ring-2 ring-white">
              ✓
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-red-100 mt-1 font-medium">
            Lead Software Architect & Senior Full Stack Engineer
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Mission & Purpose */}
          <div className="bg-red-50/60 rounded-2xl p-4 border border-red-100/80">
            <h3 className="font-extrabold text-sm text-red-950 flex items-center gap-2 mb-1.5">
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              উৎসর্গ ও অঙ্গীকার
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "বরিশাল বিভাগের ৬টি জেলার সাধারণ মানুষের জীবন বাঁচাতে একটি নিরাপদ, দ্রুততম এবং স্বয়ংসম্পূর্ণ ব্লাড ডোনার নেটওয়ার্ক গড়ে তোলাই এই সফটওয়্যারের লক্ষ্য।"
            </p>
          </div>

          {/* Core Architecture Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>কারিগরি আর্কিটেকচার</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">100% PRODUCTION-GRADE</span>
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div 
                onClick={() => {
                  if (onOpenCloudflareModal) {
                    onClose();
                    onOpenCloudflareModal();
                  }
                }}
                className="p-3 rounded-xl bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200/80 flex items-start gap-2.5 cursor-pointer transition shadow-xs group"
              >
                <Cloud className="w-4 h-4 text-orange-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 block">Cloudflare D1 & R2</span>
                    <span className="text-[9px] bg-orange-200 text-orange-800 font-bold px-1 rounded">ম্যানেজ</span>
                  </div>
                  <span className="text-[11px] text-slate-500">ডিপ্লয়মেন্ট ও SQL কনসোল</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">PWA & Mobile Ready</span>
                  <span className="text-[11px] text-slate-500">অফলাইন ক্যাশিং ও পুশ নোটিফিকেশন</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">রক্ত সহায়ক AI</span>
                  <span className="text-[11px] text-slate-500">২৪/৭ স্মার্ট অ্যাসিস্ট্যান্ট</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">REST API v1</span>
                  <span className="text-[11px] text-slate-500">Node/Express + RBAC Auth</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Controlled Contact</span>
                  <span className="text-[11px] text-slate-500">প্রাইভেসি সুরক্ষিত নম্বর শেয়ার</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">জরুরি সাইরেন</span>
                  <span className="text-[11px] text-slate-500">ইনস্ট্যান্ট রক্তদাতা সংযোগ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">সফটওয়্যার আর্কিটেক্ট</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                VERIFIED AUTHOR
              </span>
            </div>
            <p className="text-xs text-slate-300">
              মূল পরিকল্পনাকারী ও লিড সফটওয়্যার আর্কিটেক্ট: <strong className="text-white font-bold">MD. SAIDUL ISLAM</strong>
            </p>
            <p className="text-xs text-slate-400">
              অ্যাপ্লিকেশন: বরিশাল রক্ত (Barishal Rokto - Blood Donor Platform)
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-white/10 flex items-center justify-between">
              <span>রিলিজ ভার্সন</span>
              <span className="text-amber-300 font-mono">v1.5.0 Stable</span>
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
