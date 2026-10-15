import React, { useState } from 'react';
import { AlertTriangle, Flame, ShieldAlert, HeartHandshake, Droplet, Bug, Wind } from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

export const SeasonalCrisisMonitor: React.FC = () => {
  const [activeCrisis, setActiveCrisis] = useState<'dengue' | 'postCyclone' | 'winter'>('dengue');

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              মৌসুমী রক্ত সংকট ও ডেঙ্গু মনিটরিং (Seasonal Crisis Monitor)
            </h3>
            <p className="text-xs text-slate-500">
              বরিশাল উপকূলীয় অঞ্চলের ডেঙ্গু প্লাটিলেট ও মৌসুমী রক্তের ঘাটতি পর্যবেক্ষণ
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveCrisis('dengue')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeCrisis === 'dengue'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>ডেঙ্গু ও প্লাটিলেট জরুরি</span>
        </button>

        <button
          onClick={() => setActiveCrisis('postCyclone')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeCrisis === 'postCyclone'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>উপকূলীয় দুর্যোগ সতর্কতা</span>
        </button>
      </div>

      {/* Tab details */}
      {activeCrisis === 'dengue' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>ডেঙ্গু মৌসুমে প্লাটিলেটের সংকট মোকাবেলায় নির্দেশনা:</span>
            </div>
            শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (শেবাচিম) ও বরিশাল সদর হাসপাতালে ডেঙ্গু রোগীর চিকিৎসায় ফ্রেশ রক্ত ও এফারোসিস প্লাটিলেটের উচ্চ চাহিদা তৈরি হয়। O+ ও B+ ডোনারদের আগাম রেজিস্ট্রেশনের অনুরোধ করা যাচ্ছে।
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-1">বর্তমান ঝুঁকি স্তর</span>
              <span className="text-base font-black text-amber-600">মাঝারি (Moderate)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-1">প্রয়োজনীয় প্লাটিলেট ইউনিট</span>
              <span className="text-base font-black text-red-600">{toBengaliDigits(45)}+ ইউনিট/দিন</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-1">শেবাচিম ডেঙ্গু ওয়ার্ড হটলাইন</span>
              <span className="text-base font-black text-slate-800 font-mono">০৪৩১-২১৭৭২</span>
            </div>
          </div>
        </div>
      )}

      {activeCrisis === 'postCyclone' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-blue-800 mb-1">
              <Wind className="w-4 h-4 text-blue-600" />
              <span>উপকূলীয় ঘূর্ণিঝড় ও ট্রমা ইমার্জেন্সি প্রস্তুতি:</span>
            </div>
            বরগুনা, পটুয়াখালী ও ভোলার নদীবেষ্টিত এলাকায় দুর্যোগকালে নদী পারাপার বিঘ্নিত হতে পারে। স্থানীয় ওয়াটার অ্যাম্বুলেন্স ও ট্রমা ব্লাড বাফার প্রস্তুত রাখতে স্থানীয় ক্লাবসমূহ একযোগে কাজ করছে।
          </div>
        </div>
      )}
    </div>
  );
};
