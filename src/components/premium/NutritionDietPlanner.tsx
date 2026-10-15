import React, { useState } from 'react';
import {
  Apple,
  Coffee,
  Heart,
  Droplet,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Leaf,
  Beef,
  Flame,
} from 'lucide-react';

export const NutritionDietPlanner: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<'pre_donation' | 'post_donation' | 'iron_rich'>('pre_donation');

  const dietItems = {
    pre_donation: [
      {
        name: 'পর্যাপ্ত পানি ও ইলেক্ট্রোলাইট',
        desc: 'রক্তদানের ৩ ঘণ্টা আগে অন্তত ১ লিটার পানি পান করুন। এতে ব্লাড ভলিউম ঠিক থাকে।',
        tag: 'পানীয়',
        icon: Droplet,
        color: 'text-blue-600 bg-blue-50',
      },
      {
        name: 'হালকা শর্করা ও ফলমূল',
        desc: 'কলা, আপেল, ওটস বা হালকা টোস্ট খান। খালি পেটে রক্তদান করা থেকে সম্পূর্ণ বিরত থাকুন।',
        tag: 'খাদ্য',
        icon: Apple,
        color: 'text-amber-600 bg-amber-50',
      },
      {
        name: 'চর্বিযুক্ত খাবার বর্জন',
        desc: 'রক্তদানের পূর্বে বিরিয়ানি, ভাজাপোড়া বা তৈলাক্ত খাবার খাবেন না। এতে প্লাজমা লিপিডেমিক হতে পারে।',
        tag: 'সতর্কতা',
        icon: Flame,
        color: 'text-red-600 bg-red-50',
      },
    ],
    post_donation: [
      {
        name: 'জুস ও গ্লুকোজ স্যালাইন',
        desc: 'রক্তদানের পরপরই শরবত, স্যালাইন বা ফলের জুস গ্রহণ করুন রক্তচাপ স্বাভাবিক রাখতে।',
        tag: 'পুনরুদ্ধার',
        icon: Sparkles,
        color: 'text-emerald-600 bg-emerald-50',
      },
      {
        name: 'প্রোটিন সমৃদ্ধ আহার',
        desc: 'ডিম, দুধ, মুরগির মাংস বা ডাল গ্রহণ করুন যাতে প্লাজমার প্রোটিন দ্রুত তৈরি হয়।',
        tag: 'পুনর্গঠন',
        icon: Beef,
        color: 'text-purple-600 bg-purple-50',
      },
      {
        name: 'চা-কফি সাময়িক বিরতি',
        desc: 'রক্তদানের সাথে সাথে গরম চা বা কফি পান করবেন না। অন্তত ২ ঘণ্টা পর পান করুন।',
        tag: 'সতর্কতা',
        icon: Coffee,
        color: 'text-rose-600 bg-rose-50',
      },
    ],
    iron_rich: [
      {
        name: 'সবুজ শাকসবজি ও কচুশাক',
        desc: 'কচুশাক, পালংশাক, কাঁচাকলা প্রচুর নন-হিম আয়রন সরবরাহ করে।',
        tag: 'উদ্ভিজ্জ আয়রন',
        icon: Leaf,
        color: 'text-emerald-700 bg-emerald-50',
      },
      {
        name: 'কলিজা ও লাল মাংস',
        desc: 'হিমোগ্লোবিন দ্রুত বাড়াতে কলিজা ও লাল মাংস অত্যন্ত দ্রুত লোহিত রক্তকণিকা (RBC) পুনর্গঠন করে।',
        tag: 'হিম আয়রন',
        icon: Beef,
        color: 'text-red-700 bg-red-50',
      },
      {
        name: 'ডালিম ও ভিটামিন C ফল',
        desc: 'ডালিম, আমলকী ও লেবু খেলে খাবারে থাকা আয়রন শরীরে সহজে শোষিত হয়।',
        tag: 'শোষণ সহায়ক',
        icon: Apple,
        color: 'text-amber-700 bg-amber-50',
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Leaf className="w-4 h-4" />
          <span>পুষ্টি ও আয়রন সমৃদ্ধ ডায়েট চার্ট</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          রক্তদাতার স্বাস্থ্য ও হিমোগ্লোবিন বৃদ্ধির খাদ্যতালিকা
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          রক্তদানের পূর্বে, পরে ও দ্রুত হিমোগ্লোবিন রিকভারির জন্য বিশেষজ্ঞ নির্দেশিত পুষ্টি পরিকল্পনা
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setSelectedPhase('pre_donation')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
            selectedPhase === 'pre_donation'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          রক্তদানের পূর্ববর্তী খাবার
        </button>
        <button
          onClick={() => setSelectedPhase('post_donation')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
            selectedPhase === 'post_donation'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          রক্তদানের পরবর্তী খাবার
        </button>
        <button
          onClick={() => setSelectedPhase('iron_rich')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
            selectedPhase === 'iron_rich'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          হিমোগ্লোবিন বৃদ্ধির খাদ্য
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dietItems[selectedPhase].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {item.tag}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1.5">
                {item.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>মেডিকেল ডায়েট নির্দেশিত</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
