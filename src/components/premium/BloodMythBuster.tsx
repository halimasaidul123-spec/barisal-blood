import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Heart,
  Droplet,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Apple,
  Coffee,
  Activity,
  Award,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface MythFact {
  id: number;
  myth: string;
  fact: string;
  detail: string;
  category: 'health' | 'gender' | 'recovery' | 'safety';
}

const MYTHS_AND_FACTS: MythFact[] = [
  {
    id: 1,
    myth: 'রক্ত দিলে শরীর স্থায়ীভাবে দুর্বল হয়ে যায় এবং দৃষ্টিশক্তি কমে যায়।',
    fact: 'সম্পূর্ণ ভুল ধারণা! রক্তদানের পর মাত্র ৪৮ থেকে ৭২ ঘণ্টার মধ্যে রক্তের তরল অংশ (প্লাজমা) পূরণ হয়ে যায়।',
    detail: 'নিয়মিত রক্তদানে অস্থিমজ্জা সক্রিয় হয় এবং নতুন রক্তকণিকা তৈরি দ্রুত হয়। এতে শরীর আরও সতেজ ও কর্মক্ষম থাকে।',
    category: 'health',
  },
  {
    id: 2,
    myth: 'রক্তদান করলে রক্তবাহিত রোগ (যেমন হেপাটাইটিস, এইডস) ছড়িয়ে পড়তে পারে।',
    fact: 'একদমই অসম্ভব! প্রতিটি রক্তদাতার ক্ষেত্রে নতুন স্টেরিলাইজড ডিসপোজেবল নিডেল ব্যবহার করা হয়।',
    detail: 'একবার ব্যবহৃত সুই সঙ্গে সঙ্গে ধ্বংস করা হয়, ফলে রক্তদাতার কোনো প্রকার সংক্রমণ হওয়ার কোনো সুযোগ নেই।',
    category: 'safety',
  },
  {
    id: 3,
    myth: 'নারীদের রক্ত দেওয়া উচিত নয় কারণ তাদের রক্তস্বল্পতা থাকে।',
    fact: 'শারীরিক মানদণ্ড পূরণকারী যেকোনো সুস্থ নারী প্রতি ৪ মাস পর পর নিরাপদে রক্তদান করতে পারেন।',
    detail: 'হিমোগ্লোবিন ১২.০ g/dL বা তার বেশি এবং ওজন কমপক্ষে ৪৫ কেজি থাকলে নারী-পুরুষ নির্বিশেষে রক্তদান পুরোপুরি নিরাপদ।',
    category: 'gender',
  },
  {
    id: 4,
    myth: 'রক্তদান প্রক্রিয়া অনেক যন্ত্রণাদায়ক এবং প্রচুর সময় লাগে।',
    fact: 'প্রকৃত রক্ত টানতে মাত্র ৮ থেকে ১০ মিনিট সময় লাগে। এটি একটি পিপীলিকার কামড়ের মতো অনুভূতি।',
    detail: 'সম্পূর্ণ চেকআপসহ পুরো প্রক্রিয়াটিতে মাত্র ২০-৩০ মিনিট সময় প্রয়োজন হয়। এর পর সামান্য বিশ্রাম নিয়ে স্বাভাবিক কাজে ফেরা যায়।',
    category: 'recovery',
  },
  {
    id: 5,
    myth: 'উচ্চ রক্তচাপ বা ডায়াবেটিস থাকলে কখনোই রক্তদান করা যায় না।',
    fact: 'ওষুধের মাধ্যমে রক্তচাপ ও ডায়াবেটিস নিয়ন্ত্রণে থাকলে চিকিৎসকের পরামর্শে রক্ত দেওয়া সম্ভব।',
    detail: 'ইনসুলিন গ্রহণ না করা এবং রক্তচাপ নিয়ন্ত্রিত অবস্থায় থাকা ব্যক্তিরা সহজেই রক্তদানে অংশ নিতে পারেন।',
    category: 'health',
  },
  {
    id: 6,
    myth: 'রক্তদানের পর ওজন বেড়ে যায় বা অতিরিক্ত স্থূলতা দেখা দেয়।',
    fact: 'রক্তদানের সাথে ওজন বৃদ্ধির কোনো বৈজ্ঞানিক সম্পর্ক নেই।',
    detail: 'অনেকে রক্তদানের পর অতিরিক্ত ভোজ বা বিশ্রাম নেওয়ার কারণে সাময়িক ওজন পরিবর্তন অনুভব করতে পারেন, রক্তদানের জন্য নয়।',
    category: 'safety',
  },
];

export const BloodMythBuster: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    sleep: false,
    water: false,
    meal: false,
    feverFree: false,
    weightCheck: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const readinessPercent = Math.round((checkedCount / 5) * 100);

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/30 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>সচেতনতামূলক মেডিকেল গাইড</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            রক্তদান সংক্রান্ত কুসংস্কার বনাম বৈজ্ঞানিক সত্য
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            কুসংস্কার দূর করে সত্য তথ্য জানুন। একটি রক্তদান তিনটি অমূল্য জীবনের আশার প্রদীপ জ্বালাতে পারে।
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              <span>৬০ সেকেন্ডে রক্তদান প্রস্তুতি চেকলিস্ট</span>
            </h3>
            <p className="text-xs text-slate-500">
              রক্তদান কেন্দ্রে রওনা দেওয়ার পূর্বে এই ৫টি শর্ত নিশ্চিত করুন:
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">প্রস্তুতি স্কোর</span>
              <span className="text-lg font-black text-emerald-600">
                {toBengaliDigits(readinessPercent)}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
              {toBengaliDigits(checkedCount)}/৫
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <label
            onClick={() => toggleCheck('sleep')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.sleep
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.sleep ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              গত রাতে কমপক্ষে ৬-৮ ঘণ্টা নির্বিঘ্ন ঘুম হয়েছে
            </div>
          </label>

          <label
            onClick={() => toggleCheck('water')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.water
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.water ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              রক্তদানের পূর্বে অন্তত ২-৩ গ্লাস পানি পান করেছি
            </div>
          </label>

          <label
            onClick={() => toggleCheck('meal')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.meal
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.meal ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              খালি পেটে নেই (হালকা পুষ্টিকর খাবার খেয়েছি)
            </div>
          </label>

          <label
            onClick={() => toggleCheck('feverFree')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.feverFree
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.feverFree ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              গত ১৪ দিনে জ্বর বা অ্যান্টিবায়োটিক সেবন করিনি
            </div>
          </label>

          <label
            onClick={() => toggleCheck('weightCheck')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none sm:col-span-2 ${
              checklist.weightCheck
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.weightCheck ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              আমার ওজন ন্যূনতম ৫০ কেজি (নারীদের জন্য ৪৫ কেজি) এর বেশি
            </div>
          </label>
        </div>

        {readinessPercent === 100 && (
          <div className="p-3 rounded-2xl bg-emerald-100/90 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>অসাধারণ! আপনি আজকের রক্তদানের জন্য সম্পূর্ণ প্রস্তুত।</span>
          </div>
        )}
      </div>

      {/* Myths vs Facts Accordion List */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-600" />
          <span>কুসংস্কার বনাম বৈজ্ঞানিক সত্য (Myths vs Facts)</span>
        </h3>

        {MYTHS_AND_FACTS.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 transition cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>ভ্রান্ত ধারণা #{toBengaliDigits(item.id)}:</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    "{item.myth}"
                  </h4>
                </div>
                <div className="p-1 rounded-xl bg-slate-100 text-slate-500 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-emerald-50/30 space-y-3">
                  <div className="flex items-start gap-2.5 pt-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-emerald-900 text-xs sm:text-sm block">
                        চিকিৎসাগত সত্য: {item.fact}
                      </span>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recovery Care Tips */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl p-5 sm:p-6 border border-red-100">
        <h4 className="font-extrabold text-sm text-red-950 flex items-center gap-2 mb-3">
          <Apple className="w-4 h-4 text-red-600" />
          <span>রক্তদানের পরবর্তী যত্ন (Post-Donation Care)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-red-100/80 shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">পর্যাপ্ত তরল গ্রহণ</span>
            <p className="text-slate-500 leading-relaxed">
              রক্তদানের পর পরবর্তী ২৪ ঘণ্টায় প্রচুর পানি, ফলের জুস বা স্যালাইন পান করুন।
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-red-100/80 shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">বিশ্রাম ও সতর্কতা</span>
            <p className="text-slate-500 leading-relaxed">
              রক্তদানের পর ৫-১০ মিনিট শুয়ে থাকুন। সেদিন ভারী ব্যায়াম বা ওজন তোলা থেকে বিরত থাকুন।
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-red-100/80 shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">আয়রনযুক্ত পুষ্টিকর খাদ্য</span>
            <p className="text-slate-500 leading-relaxed">
              ডালিম, খেজুর, ডিম, কলিজা, কচুশাক ইত্যাদির মাধ্যমে দ্রুত রক্তকণিকা পুনরুজ্জীবিত হয়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
