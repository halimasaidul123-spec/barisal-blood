import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  Activity,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  PhoneCall,
  Sparkles,
  LifeBuoy,
} from 'lucide-react';

interface Protocol {
  id: string;
  title: string;
  category: 'bleeding' | 'fainting' | 'shock' | 'transfusion';
  summary: string;
  steps: string[];
  doList: string[];
  dontList: string[];
  emergencyContact: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: 'severe-bleeding',
    title: 'তীব্র রক্তক্ষরণ বন্ধের তাৎক্ষণিক প্রাথমিক চিকিৎসা',
    category: 'bleeding',
    summary: 'দুর্ঘটনা বা গভীর ক্ষতে দ্রুত রক্তক্ষরণ বন্ধে ফার্স্ট এইড প্রটোকল',
    steps: [
      'ক্ষতস্থানের উপর সরাসরি পরিষ্কার গজ বা কাপড় দিয়ে শক্ত চাপ (Direct Pressure) দিন।',
      'সম্ভব হলে আক্রান্ত স্থান হৃৎপিণ্ডের অবস্থানের চেয়ে উঁচুতে (Elevation) রাখুন।',
      'রক্তক্ষরণ না থামলে কাপড়ের উপর দিয়ে শক্ত করে ব্যান্ডেজ বাঁধুন।',
      'প্রচণ্ড ধমনিজনিত রক্তক্ষরণে রক্তপাতস্থলের উপরে টর্নিকেট (Tourniquet) প্রয়োগ করুন।',
    ],
    doList: [
      'রোগীকে শুইয়ে মাথা নিচু ও পা সামান্য উঁচুতে রাখুন',
      'প্রচুর রক্তপাত হলে দ্রুত হাসপাতালে স্থানান্তর করুন',
      'গায়ের ভেজা কাপড় খুলে রোগীকে উষ্ণ রাখুন',
    ],
    dontList: [
      'ক্ষতে কোনো মাটি, পাউডার বা গাছগাছড়া লাগাবেন না',
      'রক্তে ভিজে যাওয়া ব্যান্ডেজ না খুলে তার ওপর আরেকটি ব্যান্ডেজ দিন',
    ],
    emergencyContact: '৯৯৯ বা শের-ই-বাংলা মেডিকেল জরুরি বিভাগ',
  },
  {
    id: 'post-donation-faint',
    title: 'রক্তদানের পর মাথা ঘোরা বা ভেসোভ্যাগাল সিনকোপ প্রতিরোধ',
    category: 'fainting',
    summary: 'রক্তদানের পর রক্তচাপ সাময়িক কমলে করণীয় পদক্ষেপ',
    steps: [
      'মাথা ঘোরা বা শরীর দুর্বল লাগলে সাথে সাথে শুয়ে পড়ুন।',
      'পা দুটোকে অন্তত ১০-১২ ইঞ্চি উপরে উঠিয়ে রাখুন (Trendelenburg Position)।',
      'টাইট জামাকাপড়, কলার বা বেল্ট আলগা করে দিন।',
      'গভীর শ্বাস নিন এবং পর্যাপ্ত বাতাস চলাচল নিশ্চিত করুন।',
      'স্বাভাবিক বোধ করলে ধীরে ধীরে স্যালাইন বা ফলের জুস পান করুন।',
    ],
    doList: [
      'রক্তদানের পর অন্তত ১৫ মিনিট রক্তদান কেন্দ্রে বসে থাকুন',
      'পর্যাপ্ত তরল খাদ্য গ্রহণ করুন',
    ],
    dontList: [
      'মাথা ঘুরলে হঠাৎ উঠে দাঁড়াবেন না',
      'গরম চা-কফি বা রোদে তাৎক্ষণিক বের হবেন না',
    ],
    emergencyContact: 'রক্তদান কেন্দ্রের দায়িত্বরত মেডিকেল অফিসার',
  },
  {
    id: 'hypovolemic-shock',
    title: 'অতিরিক্ত রক্তক্ষরণজনিত শক (Hypovolemic Shock)',
    category: 'shock',
    summary: 'রক্তের পরিমাণ মারাত্মক কমে গেলে জীবন রক্ষার জরুরি প্রটোকল',
    steps: [
      'তাৎক্ষণিকভাবে জরুরি অ্যাম্বুলেন্স বা হাসপাতালে কল দিন।',
      'রোগীকে উষ্ণ রাখতে কম্বল বা চাদর দিয়ে জড়িয়ে রাখুন (Hypothermia রোধে)।',
      'জ্ঞান হারালে শ্বাসপথ পরিষ্কার রাখুন এবং রিকভারি পজিশনে (Recovery Position) রাখুন।',
      'রোগীর রক্তের গ্রুপ জানা থাকলে নিকটস্থ ইউনিভার্সাল ডোনার (O-) প্রস্তুত রাখুন।',
    ],
    doList: [
      'রোগীর পালস ও শ্বাস-প্রশ্বাসের গতি পর্যবেক্ষণ করুন',
      'হাসপাতালকে আগে থেকেই রক্তের প্রয়োজনের তথ্য জানান',
    ],
    dontList: [
      'অচেতন রোগীকে জোর করে পানি বা খাবার খাওয়াবেন না',
      'রোগীকে একা ফেলে রাখবেন না',
    ],
    emergencyContact: 'জাতীয় জরুরি হটলাইন ৯৯৯',
  },
  {
    id: 'transfusion-reaction',
    title: 'রক্ত পরিসঞ্চালনে পার্শ্বপ্রতিক্রিয়া বা রিয়্যাকশন হলে করণীয়',
    category: 'transfusion',
    summary: 'রক্ত নেওয়ার সময় রোগীর জ্বর, কাঁপুনি বা শ্বাসকষ্ট দেখা দিলে',
    steps: [
      'সঙ্গে সঙ্গে রক্তের স্যালাইন ড্রিপার ক্ল্যাম্প করে রক্ত সঞ্চালন বন্ধ (Stop Transfusion) করুন।',
      'আইভি ক্যানুলা খুলে ফেলবেন না, সেখানে অবিলম্বে নরমাল স্যালাইন (Normal Saline) চালু করুন।',
      'দায়িত্বরত চিকিৎসক ও নার্সকে জরুরিভাবে জানান।',
      'রক্তের ব্যাগ এবং ব্যবহৃত টিউবিং ল্যাবরেটরিতে পুনরায় পরীক্ষার জন্য সংরক্ষণ করুন।',
    ],
    doList: [
      'রোগীর রক্তচাপ, তাপমাত্রা ও পালস দ্রুত রেকর্ড করুন',
      'প্রয়োজনে অ্যান্টিহিস্টামিন ও হাইড্রোকর্টিসন চিকিৎসকের নির্দেশে প্রয়োগ করুন',
    ],
    dontList: [
      'রিয়্যাকশন হলে অবহেলা করে রক্ত দেওয়া চালিয়ে যাবেন না',
    ],
    emergencyContact: 'হাসপাতালের অন-কল চিকিৎসক বা ইনচার্জ',
  },
];

export const FirstAidProtocolGuide: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('severe-bleeding');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = PROTOCOLS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-700/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold border border-emerald-400/30 text-emerald-200">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>জরুরি প্রাথমিক চিকিৎসা নির্দেশিকা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            রক্তক্ষরণ ও ট্রান্সফিউশন ফার্স্ট এইড প্রটোকল
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            দুর্ঘটনা, রক্তক্ষরণ, হঠাৎ রক্তচাপ হ্রাস ও ট্রান্সফিউশন সংক্রান্ত জরুরি পরিস্থিতিতে তাৎক্ষণিক জীবনরক্ষাকারী বিজ্ঞানসম্মত নির্দেশনা।
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="প্রাথমিক চিকিৎসার বিষয় লিখে খুঁজুন..."
          className="w-full px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition"
            >
              <button
                onClick={() => setExpandedId(isOpen ? '' : item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      মেডিকেল ফার্স্ট এইড
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.summary}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-1">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-100 space-y-5 text-xs">
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      ধাপে ধাপে জরুরি পদক্ষেপ:
                    </h4>
                    <ol className="space-y-2 pl-1">
                      {item.steps.map((st, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-200">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        অবশ্যই যা করবেন (DO)
                      </span>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {item.doList.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 space-y-1.5">
                      <span className="font-bold text-red-900 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        যা ভুলেও করবেন না (DON'T)
                      </span>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {item.dontList.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-600 font-bold">✕</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      জরুরি সাহায্য ও যোগাযোগ: <strong className="text-slate-900">{item.emergencyContact}</strong>
                    </span>
                    <a
                      href="tel:999"
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-red-700 transition"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>কল করুন</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
