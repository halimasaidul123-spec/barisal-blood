import React, { useState } from 'react';
import { BloodCompatibilityMatrix } from '../premium/BloodCompatibilityMatrix.js';
import { CrossMatchSimulator } from '../premium/CrossMatchSimulator.js';
import { EligibilityCalculator } from '../premium/EligibilityCalculator.js';
import { BloodMythBuster } from '../premium/BloodMythBuster.js';
import { NutritionDietPlanner } from '../premium/NutritionDietPlanner.js';
import { LifesaverQuiz } from '../premium/LifesaverQuiz.js';
import { FirstAidProtocolGuide } from '../premium/FirstAidProtocolGuide.js';
import { EmergencyPosterGenerator } from '../premium/EmergencyPosterGenerator.js';
import { RiverWaterAmbulanceGuide } from '../premium/RiverWaterAmbulanceGuide.js';
import { ThalassemiaBuddyNetwork } from '../premium/ThalassemiaBuddyNetwork.js';
import { DonationCycleCalendar } from '../premium/DonationCycleCalendar.js';
import {
  BookOpen,
  GitCompare,
  FlaskConical,
  CheckCircle,
  HelpCircle,
  Utensils,
  Award,
  LifeBuoy,
  AlertTriangle,
  Image,
  Ship,
  Heart,
  Calendar,
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'matrix' | 'eligibility' | 'poster' | 'transit' | 'thalassemia' | 'calendar' | 'myths' | 'simulator' | 'nutrition' | 'quiz' | 'firstAid'
  >('matrix');

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-red-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-3 border border-red-400/30">
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>চিকিৎসাবিজ্ঞান ও রক্তদান নির্দেশিকা</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            রক্তদান বিজ্ঞান ও মেডিকেল সচেতনতা
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            রক্তদানের সঠিক নিয়মাবলী, রক্তের গ্রুপ ক্রস-ম্যাচিং, রোগীর রক্তের প্রয়োজন ও পুনরুদ্ধারের বৈজ্ঞানিক বিশ্লেষণ।
          </p>

          {/* Critical Medical Disclaimer */}
          <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-3 sm:p-4 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-extrabold text-amber-300">মেডিকেল সতর্কতা:</span>{' '}
              রক্ত পরিসঞ্চালনের (Blood Transfusion) ক্ষেত্রে সর্বদা রেজিস্টার্ড চিকিৎসকের তত্ত্বাবধানে ল্যাবরেটরিতে ক্রস-ম্যাচিং ও স্ক্রিনিং টেস্ট সম্পন্ন করুন।
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>রক্তের গ্রুপের সামঞ্জস্য</span>
        </button>

        <button
          onClick={() => setActiveTab('poster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'poster'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>সোশ্যাল পোস্টার</span>
        </button>

        <button
          onClick={() => setActiveTab('eligibility')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'eligibility'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>যোগ্যতা পরিমাপক</span>
        </button>

        <button
          onClick={() => setActiveTab('transit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'transit'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>নদীপথ ও স্পিডবোট নির্দেশিকা</span>
        </button>

        <button
          onClick={() => setActiveTab('thalassemia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'thalassemia'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>থ্যালাসেমিয়া সাপোর্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>রক্তদান সাইকেল ক্যালেন্ডার</span>
        </button>

        <button
          onClick={() => setActiveTab('myths')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'myths'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>ভ্রান্ত ধারণা ও সঠিক তথ্য</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>ক্রস-ম্যাচ সিমুলেটর</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'nutrition'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>পুষ্টি ও আয়রন চার্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>লাইফসেভার কুইজ</span>
        </button>

        <button
          onClick={() => setActiveTab('firstAid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'firstAid'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>জরুরি প্রাথমিক চিকিৎসা</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="transition-all">
        {activeTab === 'matrix' && <BloodCompatibilityMatrix />}
        {activeTab === 'poster' && <EmergencyPosterGenerator />}
        {activeTab === 'eligibility' && <EligibilityCalculator />}
        {activeTab === 'transit' && <RiverWaterAmbulanceGuide />}
        {activeTab === 'thalassemia' && <ThalassemiaBuddyNetwork />}
        {activeTab === 'calendar' && <DonationCycleCalendar />}
        {activeTab === 'myths' && <BloodMythBuster />}
        {activeTab === 'simulator' && <CrossMatchSimulator />}
        {activeTab === 'nutrition' && <NutritionDietPlanner />}
        {activeTab === 'quiz' && <LifesaverQuiz />}
        {activeTab === 'firstAid' && <FirstAidProtocolGuide />}
      </div>
    </div>
  );
};
