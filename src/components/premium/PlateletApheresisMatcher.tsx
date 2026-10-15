import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Activity,
  Heart,
  Droplet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const PlateletApheresisMatcher: React.FC = () => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [weight, setWeight] = useState(62);
  const [plateletCount, setPlateletCount] = useState('220000');
  const [lastPlateletDays, setLastPlateletDays] = useState(20);
  const [aspirinHistory, setAspirinHistory] = useState(false);
  const [hasVeinAccess, setHasVeinAccess] = useState(true);

  const isWeightOk = weight >= 55;
  const numPlatelet = Number(plateletCount) || 0;
  const isPlateletCountOk = numPlatelet >= 150000;
  const isIntervalOk = lastPlateletDays >= 15;
  const isAspirinOk = !aspirinHistory;
  const isVeinOk = hasVeinAccess;

  const isEligible = isWeightOk && isPlateletCountOk && isIntervalOk && isAspirinOk && isVeinOk;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>ডেঙ্গু ও অনকোলজি স্পেশাল</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            সিঙ্গেল ডোনার প্লাটিলেট (SDP) ম্যাচিং ক্যালকুলেটর
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ডেঙ্গু বা ক্যান্সার রোগীর জরুরি প্লাটিলেট (SDP) দাতার যোগ্যতা মূল্যায়ন
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-auto">
          জরুরি ডেঙ্গু সাপোর্ট
        </div>
      </div>

      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
        <span className="font-extrabold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>SDP রক্তদানের বিশেষত্ব:</span>
        </span>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          সাধারণ রক্তদানে ১ ব্যাগ থেকে মাত্র ১ ইউনিট প্লাটিলেট পাওয়া যায়। কিন্তু এফেরেসিস (Apheresis) মেশিনের সাহায্যে একজন দাতার শরীর থেকে লোহিত রক্তকণিকা ফেরত দিয়ে একবারে পুরো ৬-৮ ইউনিট (১ থেরাপিউটিক ডোজ) প্লাটিলেট সংগ্রহ করা সম্ভব।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-3.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              রক্তদাতার শারীরিক ওজন: {weight} কেজি (ন্যূনতম ৫৫ কেজি)
            </label>
            <input
              type="range"
              min="45"
              max="110"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              রক্তদাতার প্লাটিলেট কাউন্ট (/µL)
            </label>
            <input
              type="number"
              step="5000"
              value={plateletCount}
              onChange={(e) => setPlateletCount(e.target.value)}
              placeholder="যেমন: 200000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">স্বাভাবিক প্লাটিলেট ১৫০,০০০ থেকে ৪৫০,০০০ এর মধ্যে হতে হয়</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              সর্বশেষ প্লাটিলেট দানের দিন: {lastPlateletDays} দিন আগে (১৫ দিন বিরতি)
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={lastPlateletDays}
              onChange={(e) => setLastPlateletDays(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">প্লাটিলেট দান প্রতি ১৫ দিন পর পর করা যায়</span>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={aspirinHistory}
                onChange={(e) => setAspirinHistory(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 accent-rose-600 cursor-pointer"
              />
              <span>বিগত ৪৮ ঘণ্টায় অ্যাসপিরিন বা ব্যথানাশক ওষুধ খেয়েছেন?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={hasVeinAccess}
                onChange={(e) => setHasVeinAccess(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 accent-rose-600 cursor-pointer"
              />
              <span>উভয় বাহুতে উপযুক্ত রক্তনালী (Vein) দৃশ্যমান?</span>
            </label>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isEligible ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {isEligible ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">
              {isEligible
                ? `উপযুক্ত: আপনি ${bloodGroup} গ্রুপের ডেঙ্গু বা ক্যান্সার রোগীকে প্লাটিলেট (SDP) দিতে পারবেন`
                : 'অনুপযুক্ত: এই মুহূর্তে প্লাটিলেট (SDP) দানের মানদণ্ড পূরণ হয়নি'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isEligible
                ? 'শের-ই-বাংলা মেডিকেলের এফেরেসিস সেন্টারে যোগাযোগ করে রোগীকে বাঁচাতে এগিয়ে আসুন।'
                : 'ওজন ৫৫ কেজির নিচে বা ব্যথানাশক ওষুধ খেলে প্লাটিলেট জমাট বাঁধার কার্যকারিতা নষ্ট হতে পারে।'}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
          isEligible ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
        }`}>
          {isEligible ? 'SDP MATCHED' : 'NOT READY'}
        </span>
      </div>
    </div>
  );
};
