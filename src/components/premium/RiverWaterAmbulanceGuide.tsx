import React, { useState } from 'react';
import {
  Ship,
  Phone,
  Compass,
  AlertTriangle,
  Clock,
  ShieldCheck,
  MapPin,
  Waves,
  Sun,
  Moon,
  CloudFog,
  Navigation,
  PhoneCall,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface WaterAmbulance {
  id: number;
  name: string;
  route: string;
  type: 'speed_boat' | 'trawler_ambulance' | 'gov_water_vessel';
  contactPerson: string;
  phone: string;
  baseStation: string;
  responseTime: string;
  oxygenEquipped: boolean;
  notes: string;
}

const WATER_AMBULANCES: WaterAmbulance[] = [
  {
    id: 1,
    name: 'ভোলা-বরিশাল জরুরি স্পিডবোট অ্যাম্বুলেন্স',
    route: 'ভেদুরিয়া ঘাট (ভোলা) ⇄ লাহারহাট ঘাট (বরিশাল)',
    type: 'speed_boat',
    contactPerson: 'ক্যাপ্টেন রফিকুল ইসলাম',
    phone: '01712-445566',
    baseStation: 'ভেদুরিয়া ঘাট, ভোলা',
    responseTime: '১৫-২০ মিনিট',
    oxygenEquipped: true,
    notes: 'তেঁতুলিয়া নদী দ্রুত পারাপার। জরুরি রক্তের ব্যাগ আইসোলেটেড বক্সে নিরাপদে বহন সুবিধা।',
  },
  {
    id: 2,
    name: 'মনপুরা-তজুমদ্দিন সরকারি ওয়াটার অ্যাম্বুলেন্স',
    route: 'মনপুরা দ্বীপ ⇄ তজুমদ্দিন / চরফ্যাশন',
    type: 'gov_water_vessel',
    contactPerson: 'উপজেলা স্বাস্থ্য কমপ্লেক্স কন্ট্রোল',
    phone: '01713-778899',
    baseStation: 'মনপুরা ঘাট',
    responseTime: '৩০-৪০ মিনিট',
    oxygenEquipped: true,
    notes: 'মেঘনা নদীর দূরবর্তী দ্বীপ থেকে মুমূর্ষু রোগী ও রক্তের ব্যাগ দ্রুত মূল ভূখণ্ডে স্থানান্তর।',
  },
  {
    id: 3,
    name: 'রাঙ্গাবালী-গলাচিপা উপকূলীয় দ্রুতযান',
    route: 'কোড়ালিয়া ঘাট ⇄ উলানিয়া / গলাচিপা সদর',
    type: 'speed_boat',
    contactPerson: 'বশির আহমেদ (মাঝি)',
    phone: '01714-112233',
    baseStation: 'কোড়ালিয়া লঞ্চঘাট, রাঙ্গাবালী',
    responseTime: '২৫ মিনিট',
    oxygenEquipped: true,
    notes: 'রাঙ্গাবালী উপজেলার রোগীদের পটুয়াখালী বা বরিশালে স্থানান্তরের প্রধান ভরসা।',
  },
  {
    id: 4,
    name: 'মেহেন্দিগঞ্জ-বরিশাল স্পেশাল ট্রলার অ্যাম্বুলেন্স',
    route: 'পাতাভাঙ্গা ঘাট ⇄ তালতলী / বরিশাল ডিসি ঘাট',
    type: 'trawler_ambulance',
    contactPerson: 'হাজী মো. ইউনুস',
    phone: '01715-998877',
    baseStation: 'মেহেন্দিগঞ্জ লঞ্চঘাট',
    responseTime: '৩৫ মিনিট',
    oxygenEquipped: false,
    notes: 'খারাপ আবহাওয়াতেও চলাচলে সক্ষম। রাতেও বিশেষ জরুরি ট্রিপে যোগাযোগ করা যায়।',
  },
  {
    id: 5,
    name: 'হিজলা-মুলাদী জরুরি স্পিডবোট সার্ভিস',
    route: 'হিজলা ঘাট ⇄ মুলাদী খেয়াঘাট',
    type: 'speed_boat',
    contactPerson: 'কামরুল হাসান',
    phone: '01716-554433',
    baseStation: 'হিজলা পুরাতন বাজার ঘাট',
    responseTime: '১৫ মিনিট',
    oxygenEquipped: true,
    notes: 'জয়ন্তী নদী পার হয়ে দ্রুত বরিশাল সদরে রক্ত ও রোগী পৌঁছে দেওয়ার বিশ্বস্ত নৌযান।',
  },
];

export const RiverWaterAmbulanceGuide: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = WATER_AMBULANCES.filter((w) => {
    if (filterType === 'all') return true;
    return w.type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-cyan-800/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-xs font-bold border border-cyan-400/30 text-cyan-200">
            <Waves className="w-3.5 h-3.5" />
            <span>উপকূলীয় নদীপথ ট্রানজিট হাব</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            বরিশাল বিভাগীয় নৌ ও স্পিডবোট অ্যাম্বুলেন্স গাইড
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            ভোলা, মনপুরা, রাঙ্গাবালী, মেহেন্দিগঞ্জ ও হিজলার মতো নদীবেষ্টিত অঞ্চলের রোগীদের জরুরি রক্ত সরবরাহ ও স্থানান্তরের বিশ্বস্ত নম্বর।
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-300" />
              <span>২৪/৭ নদীপথ হটলাইন</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>নৈশকালীন জরুরি ট্রিপ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-xs text-amber-800">
            <CloudFog className="w-4 h-4 text-amber-600" />
            <span>কুয়াশা ও প্রতিকূল আবহাওয়া</span>
          </div>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            শীতকালের রাতে বা বর্ষায় নদীতে অতিরিক্ত স্রোত থাকলে ভারী ট্রলার অ্যাম্বুলেন্সকে অগ্রাধিকার দিন।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-xs text-blue-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>রক্তের কোল্ড চেইন সংরক্ষণ</span>
          </div>
          <p className="text-[11px] text-blue-900 leading-relaxed">
            স্পিডবোটে রক্তের ব্যাগ পরিবহনের সময় অবশ্যই থার্মোকল আইস-বক্স (২°-৬° সে.) ব্যবহার বাধ্যতামূলক।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-xs text-emerald-800">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>পূর্বেই ঘাটে যোগাযোগ</span>
          </div>
          <p className="text-[11px] text-emerald-900 leading-relaxed">
            রোগী হাসপাতালে রওনা দেওয়ার অন্তত ৩০ মিনিট পূর্বেই সংশ্লিষ্ট নৌযানের মাঝিকে কল দিয়ে বোট প্রস্তুত রাখুন।
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
            filterType === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সকল নৌযান ({toBengaliDigits(WATER_AMBULANCES.length)})
        </button>
        <button
          onClick={() => setFilterType('speed_boat')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
            filterType === 'speed_boat'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          দ্রুতগামী স্পিডবোট
        </button>
        <button
          onClick={() => setFilterType('gov_water_vessel')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
            filterType === 'gov_water_vessel'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সরকারি নৌ-জাহাজ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {item.type === 'speed_boat'
                        ? 'স্পিডবোট'
                        : item.type === 'gov_water_vessel'
                        ? 'সরকারি জাহাজ'
                        : 'ট্রলার'}
                    </span>
                    {item.oxygenEquipped && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        অক্সিজেন সুবিধা সম্পন্ন
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                    {item.name}
                  </h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <Ship className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-800">{item.route}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>ঘাট / বেস: {item.baseStation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>পৌঁছানোর সময়: {item.responseTime}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                {item.notes}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">দায়িত্বরত ব্যক্তি:</span>
                <span className="font-bold text-slate-700">{item.contactPerson}</span>
              </div>
              <a
                href={`tel:${item.phone}`}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>সরাসরি কল দিন</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
