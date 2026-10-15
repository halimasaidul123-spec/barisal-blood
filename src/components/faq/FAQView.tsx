import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Droplet,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Sparkles,
  PhoneCall,
  Search,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'general' | 'donation' | 'privacy' | 'emergency';
}

const FAQ_DATA: FaqItem[] = [
  // General
  {
    category: 'general',
    q: 'বরিশাল রক্ত (Barishal Rokto) কী ধরনের প্ল্যাটফর্ম?',
    a: 'বরিশাল রক্ত হলো বরিশাল বিভাগের ৬টি জেলার (বরিশাল, পটুয়াখালী, ভোলা, পিরোজপুর, বরগুনা, ঝালকাঠি) জন্য নিবেদিত একটি সম্পূর্ণ অলাভজনক, স্বেচ্ছাসেবী ও জরুরি রক্তদাতা ব্যবস্থাপনা প্ল্যাটফর্ম।',
  },
  {
    category: 'general',
    q: 'এই সেবা কি সম্পূর্ণ ফ্রি?',
    a: 'হ্যাঁ, রক্ত খোঁজা, আবেদন করা কিংবা রক্তদাতা হিসেবে নিবন্ধন করা সম্পূর্ণ বিনামূল্যে। রক্তদানের বিনিময়ে কোনো প্রকার আর্থিক লেনদেন সম্পূর্ণ নিষিদ্ধ ও দণ্ডনীয় অপরাধ।',
  },
  {
    category: 'general',
    q: 'কারা এই প্ল্যাটফর্ম পরিচালনা করেন?',
    a: 'বরিশালের বিভিন্ন স্বেচ্ছাসেবী রক্তদাতা সংগঠন, যুবসমাজ এবং স্বেচ্ছাসেবী এডমিনদের সম্মিলিত পরিচালনায় এটি নিয়ন্ত্রিত। এর সফটওয়্যার আর্কিটেকচার ডিজাইন করেছেন MD. SAIDUL ISLAM।',
  },
  // Donation
  {
    category: 'donation',
    q: 'কারা রক্ত দিতে পারবেন?',
    a: '১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ পুরুষ ও নারী, যাদের ওজন কমপক্ষে ৫০ কেজি (নারীদের ক্ষেত্রে ৪৫ কেজি) এবং হিমোগ্লোবিন সন্তোষজনক পর্যায়ে রয়েছে, তারা রক্ত দিতে পারবেন।',
  },
  {
    category: 'donation',
    q: 'কতদিন পর পর রক্ত দেওয়া যায়?',
    a: 'সুস্থ পুরুষ প্রতি ৩ মাস (৯০ দিন) পর পর এবং সুস্থ নারী প্রতি ৪ মাস (১২০ দিন) পর পর নিরাপদে পূর্ণ রক্ত (Whole Blood) দান করতে পারেন।',
  },
  {
    category: 'donation',
    q: 'রক্ত দিলে কি কোনো শারীরিক দুর্বলতা হয়?',
    a: 'না, রক্তদানের পর শরীর মাত্র ৪৮ থেকে ৭২ ঘণ্টার মধ্যে রক্তের তরল অংশ পূরণ করে ফেলে এবং কয়েক সপ্তাহের মধ্যে নতুন লোহিত রক্তকণিকা তৈরি হয়। নিয়মিত রক্তদানে হৃদরোগের ঝুঁকি কমে।',
  },
  // Privacy & Safety
  {
    category: 'privacy',
    q: 'আমার মোবাইল নম্বর কি সবার জন্য উন্মুক্ত থাকবে?',
    a: 'না, সাধারণ ভিজিটরদের ক্ষেত্রে মোবাইল নম্বরের মধ্যবর্তী অংশ গোপন থাকে। শুধুমাত্র লগইনকৃত ও যাচাইকৃত ব্যবহারকারী রোগীর জরুরি প্রয়োজনে কল করতে পারেন।',
  },
  {
    category: 'privacy',
    q: 'ভেরিফাইড ডোনার (Verified Donor) কীভাবে হওয়া যায়?',
    a: 'অন্তত একবার সফল রক্তদান সম্পন্ন করার পর বা রক্তদান সনদ যাচাইয়ের পর এডমিন টিম রক্তদাতার প্রোফাইল যাচাই করে নীল ভেরিফাইড ব্যাজ প্রদান করে।',
  },
  // Emergency
  {
    category: 'emergency',
    q: 'জরুরি রক্তের প্রয়োজন হলে কী করব?',
    a: 'ওয়েবসাইটে এসে সরাসরি "জরুরি আবেদন" বাটনে ক্লিক করুন অথবা "রক্তদাতা" ট্যাবে গিয়ে আপনার কাঙ্ক্ষিত রক্তের গ্রুপ ও উপজেলা নির্বাচন করে নিকটবর্তী প্রস্তুত রক্তদাতাদের সাথে যোগাযোগ করুন।',
  },
  {
    category: 'emergency',
    q: 'ডেঙ্গু রোগীর জন্য প্লাটিলেট (SDP) প্রয়োজন হলে কী করণীয়?',
    a: 'আমাদের প্লাটিলেট এস্টিমেটরে গিয়ে ওজন ও শিরা উপযোগী রক্তদাতা খুঁজে সরাসরি শের-ই-বাংলা মেডিকেলের রক্ত পরিসঞ্চালন বিভাগে যোগাযোগ করুন।',
  },
  {
    category: 'emergency',
    q: 'ভুয়া আবেদন বা প্রতারণা প্রতিরোধে কী ব্যবস্থা আছে?',
    a: 'আমাদের এডমিন প্যানেলে সার্বক্ষণিক ফ্রড ডিটেকশন ও রিপোর্ট ম্যানেজমেন্ট টুল রয়েছে। কোনো ভুয়া আবেদন ধরা পড়লে তৎক্ষণাৎ তা স্থগিত করে ফোন নম্বর চিরতরে নিষিদ্ধ (Blacklist) করা হয়।',
  },
];

export const FAQView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleIndex = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-red-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-3 border border-red-400/30">
            <HelpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>সাহায্য ও জিজ্ঞাসা</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            বরিশাল রক্ত প্ল্যাটফর্ম, রক্তদানের নিয়মাবলী, নিরাপত্তা ও জরুরি সেবা সংক্রান্ত দরকারি তথ্যাবলী।
          </p>

          {/* Search box inside banner */}
          <div className="mt-5 relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্রশ্ন বা রক্তের নিয়ম লিখে খুঁজুন..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সব প্রশ্ন ({FAQ_DATA.length})
        </button>
        <button
          onClick={() => setSelectedCategory('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'general'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সাধারণ তথ্য
        </button>
        <button
          onClick={() => setSelectedCategory('donation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'donation'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          রক্তদানের নিয়ম
        </button>
        <button
          onClick={() => setSelectedCategory('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'privacy'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          নিরাপত্তা ও গোপনীয়তা
        </button>
        <button
          onClick={() => setSelectedCategory('emergency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'emergency'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          জরুরি সেবা
        </button>
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
            কোনো প্রশ্ন পাওয়া যায়নি
          </div>
        ) : (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition shadow-xs hover:border-red-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p className="pl-10">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Help Hotline Note */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              আরো কোনো জরুরি জিজ্ঞাসা আছে?
            </h4>
            <p className="text-xs text-slate-600">
              জরুরি মুহূর্তে যেকোনো সময় জাতীয় জরুরি সেবায় যোগাযোগ করুন।
            </p>
          </div>
        </div>
        <a
          href="tel:999"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
        >
          ৯৯৯ এ কল করুন
        </a>
      </div>
    </div>
  );
};
