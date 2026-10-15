import React from 'react';
import { Phone, ShieldAlert, Building2, Flame, Heart, AlertCircle, PhoneCall } from 'lucide-react';

export const EmergencySpeedDialBoard: React.FC = () => {
  const hotlines = [
    {
      name: 'জাতীয় জরুরি সেবা (পুলিশ, ফায়ার, অ্যাম্বুলেন্স)',
      category: 'জাতীয়',
      phone: '999',
      desc: 'যেকোনো জরুরি দুর্ঘটনা বা মুহূর্তে দ্রুততম কল সার্ভিস।',
      icon: ShieldAlert,
      badge: 'সার্বক্ষণিক টোল-ফ্রি',
      color: 'bg-red-600 text-white',
    },
    {
      name: 'শের-ই-বাংলা মেডিকেল কলেজ ব্লাড ব্যাংক',
      category: 'বরিশাল সদর',
      phone: '01711223344',
      desc: 'বিভাগের প্রধান মেডিকেল ও রেফারেল ব্লাড ব্যাংক কন্ট্রোল রুম।',
      icon: Building2,
      badge: '২৪ ঘণ্টা উন্মুক্ত',
      color: 'bg-rose-700 text-white',
    },
    {
      name: 'বরিশাল ফায়ার সার্ভিস ও রেসকিউ টিম',
      category: 'বরিশাল সদর',
      phone: '01730002233',
      desc: 'সড়ক দুর্ঘটনা ও দুর্যোগপূর্ণ মুহূর্তে তাৎক্ষণিক উদ্ধার কার্যক্রম।',
      icon: Flame,
      badge: 'জরুরি রেসকিউ',
      color: 'bg-amber-600 text-white',
    },
    {
      name: 'পটুয়াখালী সদর হাসপাতাল রক্ত পরিসঞ্চালন',
      category: 'পটুয়াখালী',
      phone: '01713445566',
      desc: 'পটুয়াখালী জেলা ও পায়রা উপকূলীয় অঞ্চলের জরুরি সেবা।',
      icon: Heart,
      badge: 'জেলা ব্লাড ব্যাংক',
      color: 'bg-blue-600 text-white',
    },
    {
      name: 'ভোলা ২৫০ শয্যা জেনারেল হাসপাতাল কন্ট্রোল',
      category: 'ভোলা',
      phone: '01744556677',
      desc: 'দ্বীপজেলা ভোলার প্রধান জরুরি রক্ত সরবরাহ সেবা।',
      icon: Heart,
      badge: 'দ্বীপজেলা হাব',
      color: 'bg-red-700 text-white',
    },
    {
      name: 'স্বাস্থ্য বাতায়ন (টেলিমেডিসিন সেবা)',
      category: 'স্বাস্থ্য অধিদপ্তর',
      phone: '16263',
      desc: 'সরকারি সার্বক্ষণিক চিকিৎসকের পরামর্শ ও স্বাস্থ্য তথ্য।',
      icon: PhoneCall,
      badge: 'টোল-ফ্রি মেডিকেল',
      color: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <PhoneCall className="w-4 h-4" />
          <span>তাত্ক্ষণিক স্পিড ডায়াল হটলাইন</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          জরুরি পরিস্থিতিতে ১-ট্যাপ ডায়াল বোর্ড
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          সরাসরি কল করতে পছন্দের হটলাইনের পাশে থাকা বোতামে চাপ দিন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotlines.map((h, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-red-200 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.color} shadow-sm`}>
                  <h.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {h.badge}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {h.name}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                {h.desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-slate-800">
                {h.phone}
              </span>
              <a
                href={`tel:${h.phone}`}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>কল দিন</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
