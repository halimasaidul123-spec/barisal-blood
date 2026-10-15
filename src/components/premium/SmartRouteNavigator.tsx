import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Compass,
  MapPin,
  Clock,
  Car,
  AlertCircle,
  Building2,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RouteData {
  fromUpazila: string;
  toHospital: string;
  distanceKm: number;
  ambulanceMinutes: number;
  autoMinutes: number;
  bridgesFerries: string[];
  trafficNotes: string;
}

export const SmartRouteNavigator: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = useState('পটুয়াখালী সদর');
  const [selectedHospital, setSelectedHospital] = useState('শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল');

  const routes: Record<string, RouteData> = {
    'পটুয়াখালী সদর': {
      fromUpazila: 'পটুয়াখালী সদর',
      toHospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      distanceKm: 38,
      ambulanceMinutes: 45,
      autoMinutes: 75,
      bridgesFerries: ['পায়রা সেতু (লেবুখালী)'],
      trafficNotes: 'মহাসড়ক প্রশস্ত ও মসৃণ। পায়রা সেতু দিয়ে বিরতিহীন যাতায়াত সম্ভব।',
    },
    'ভোলা সদর': {
      fromUpazila: 'ভোলা সদর',
      toHospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      distanceKm: 42,
      ambulanceMinutes: 70,
      autoMinutes: 110,
      bridgesFerries: ['ভেদুরিয়া-লাহারহাট স্পিডবোট বা ফেরি পারাপার'],
      trafficNotes: 'নদী পারাপারে আবহাওয়া ও ফেরি শিডিউল নিশ্চিত করা আবশ্যক।',
    },
    'পিরোজপুর সদর': {
      fromUpazila: 'পিরোজপুর সদর',
      toHospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      distanceKm: 65,
      ambulanceMinutes: 65,
      autoMinutes: 100,
      bridgesFerries: ['বঙ্গমাতা বেগম ফজিলাতুন্নেছা মুজিব সেতু (বেকুটিয়া)'],
      trafficNotes: 'বেকুটিয়া সেতু চালু থাকায় নদী পারাপারে কোনো বিলম্ব নেই।',
    },
    'বরগুনা সদর': {
      fromUpazila: 'বরগুনা সদর',
      toHospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      distanceKm: 85,
      ambulanceMinutes: 90,
      autoMinutes: 150,
      bridgesFerries: ['পায়রা সংযোগ মহাসড়ক'],
      trafficNotes: 'দীর্ঘ যাত্রা। মুমূর্ষু রোগীর ক্ষেত্রে অক্সিজেন সাপোর্ট নিশ্চিত করুন।',
    },
    'ঝালকাঠি সদর': {
      fromUpazila: 'ঝালকাঠি সদর',
      toHospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      distanceKm: 22,
      ambulanceMinutes: 25,
      autoMinutes: 40,
      bridgesFerries: ['দপদপিয়া সেতু'],
      trafficNotes: 'নিকটতম দূরত্ব। মাত্র ২০-২৫ মিনিটে মেডিকেলে পৌঁছানো যায়।',
    },
    'বাকেরগঞ্জ (বরিশাল)': {
      fromUpazila: 'বাকেরগঞ্জ',
      toHospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      distanceKm: 35,
      ambulanceMinutes: 40,
      autoMinutes: 60,
      bridgesFerries: ['দপদপিয়া লিংক রোড'],
      trafficNotes: 'পটুয়াখালী-বরিশাল মহাসড়ক হয়ে সরাসরি মেডিকেল প্রবেশদ্বার।',
    },
  };

  const currentRoute = routes[selectedOrigin] || routes['পটুয়াখালী সদর'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Navigation className="w-4 h-4" />
          <span>স্মার্ট নেভিগেশন ও ট্রানজিট ক্যালকুলেটর</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          উপজেলা থেকে শের-ই-বাংলা মেডিকেলের দূরত্ব ও সময়
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          বিভাগের যেকোনো প্রান্ত থেকে হাসপাতালে রোগী ও রক্তের ব্যাগ দ্রুত পৌঁছানোর আনুমানিক সময়
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">আপনার উপজেলা/উৎস নির্বাচন করুন:</label>
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white cursor-pointer"
          >
            {Object.keys(routes).map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">গন্তব্য হাসপাতাল:</label>
          <input
            type="text"
            value={selectedHospital}
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-medium"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                {currentRoute.fromUpazila} ➔ {currentRoute.toHospital}
              </h4>
              <span className="text-xs text-slate-500">
                আনুমানিক সড়ক দূরত্ব: <strong>{toBengaliDigits(currentRoute.distanceKm)} কি.মি.</strong>
              </span>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
            LIVE TRANSIT ESTIMATE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">অ্যাম্বুলেন্স / জরুরি গাড়িতে</span>
              <strong className="text-base text-red-700 font-black">
                ~{toBengaliDigits(currentRoute.ambulanceMinutes)} মিনিট
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">সাধারণ মাইক্রোবাস / সিএনজিতে</span>
              <strong className="text-base text-slate-900 font-black">
                ~{toBengaliDigits(currentRoute.autoMinutes)} মিনিট
              </strong>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="text-slate-700">
            <strong>সেতু ও নৌপথ ট্রানজিট: </strong>
            <span className="text-blue-700 font-semibold">{currentRoute.bridgesFerries.join(', ')}</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            {currentRoute.trafficNotes}
          </p>
        </div>
      </div>
    </div>
  );
};
