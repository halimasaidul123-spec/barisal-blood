import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Ship,
  Truck,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface RouteDetail {
  origin: string;
  destination: string;
  distanceKm: number;
  estMinutes: number;
  routeType: 'road' | 'river' | 'bridge';
  bridgeName?: string;
  recommendedTransport: string;
  coldChainAdvice: string;
  emergencyHotline: string;
}

const BARISHAL_ROUTES: Record<string, RouteDetail> = {
  'bhola-sbmch': {
    origin: 'ভোলা সদর / ভেদুরিয়া ঘাট',
    destination: 'শের-ই-বাংলা মেডিকেল কলেজ (SBMCH), বরিশাল',
    distanceKm: 38,
    estMinutes: 45,
    routeType: 'river',
    recommendedTransport: 'জরুরি স্পিডবোট (লাহারহাট ঘাট হয়ে অ্যাম্বুলেন্স)',
    coldChainAdvice: 'আইসোলেটেড থার্মোকল আইস-বক্স (২°-৬°C) বাধ্যতামূলক।',
    emergencyHotline: '01712-445566 (ঘাট স্পিডবোট অ্যাসোসিয়েশন)',
  },
  'patuakhali-sbmch': {
    origin: 'পটুয়াখালী সদর',
    destination: 'শের-ই-বাংলা মেডিকেল কলেজ (SBMCH), বরিশাল',
    distanceKm: 42,
    estMinutes: 40,
    routeType: 'bridge',
    bridgeName: 'পায়রা সেতু (লেবুখালী)',
    recommendedTransport: 'হাইওয়ে এসি অ্যাম্বুলেন্স',
    coldChainAdvice: 'পায়রা সেতু ব্যবহার করে নির্বিঘ্নে ৪০ মিনিটে পৌঁছানো যায়।',
    emergencyHotline: '01712-556677 (পটুয়াখালী অ্যাম্বুলেন্স)',
  },
  'pirojpur-sbmch': {
    origin: 'পিরোজপুর সদর',
    destination: 'শের-ই-বাংলা মেডিকেল কলেজ (SBMCH), বরিশাল',
    distanceKm: 55,
    estMinutes: 50,
    routeType: 'bridge',
    bridgeName: 'বঙ্গমাতা বেগম ফজিলাতুন্নেছা মুজিব সেতু (বেকুটিয়া)',
    recommendedTransport: 'সড়কপথ অ্যাম্বুলেন্স',
    coldChainAdvice: 'বেকুটিয়া সেতু হওয়ায় ফেরির অপেক্ষার প্রয়োজন নেই।',
    emergencyHotline: '01715-665544 (পিরোজপুর হেল্পলাইন)',
  },
  'jhalakathi-sbmch': {
    origin: 'ঝালকাঠি সদর',
    destination: 'শের-ই-বাংলা মেডিকেল কলেজ (SBMCH), বরিশাল',
    distanceKm: 22,
    estMinutes: 25,
    routeType: 'road',
    recommendedTransport: 'দ্রুতগামী সিএনজি বা অ্যাম্বুলেন্স',
    coldChainAdvice: 'মাত্র ২০-২৫ মিনিটের পথ। কোল্ড প্যাকসহ নিরাপদ পরিবহন।',
    emergencyHotline: '01717-443322 (ঝালকাঠি জরুরি সেল)',
  },
  'barguna-sbmch': {
    origin: 'বরগুনা সদর',
    destination: 'শের-ই-বাংলা মেডিকেল কলেজ (SBMCH), বরিশাল',
    distanceKm: 85,
    estMinutes: 80,
    routeType: 'bridge',
    bridgeName: 'পায়রা সংযোগ সড়ক',
    recommendedTransport: 'আইসিইউ বা এসি অ্যাম্বুলেন্স',
    coldChainAdvice: 'দীর্ঘ দূরত্বের পথ (> ১ ঘণ্টা)। তাপমাত্রা সেন্সরযুক্ত কোল্ড বক্স জরুরি।',
    emergencyHotline: '01716-990011 (বরগুনা অ্যাম্বুলেন্স)',
  },
  'bakerganj-sbmch': {
    origin: 'বাকেরগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স',
    destination: 'শের-ই-বাংলা মেডিকেল কলেজ (SBMCH), বরিশাল',
    distanceKm: 24,
    estMinutes: 28,
    routeType: 'road',
    recommendedTransport: 'সড়ক অ্যাম্বুলেন্স / মাইক্রোবাস',
    coldChainAdvice: 'বরিশাল-পটুয়াখালী মহাসড়ক হয়ে সরাসরি মেডিকেলে প্রবেশ।',
    emergencyHotline: '01711-000101 (বাকেরগঞ্জ ইউনিট)',
  },
};

export const BarishalTransitRouteEngine: React.FC = () => {
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>('patuakhali-sbmch');
  const currentRoute = BARISHAL_ROUTES[selectedRouteKey] || BARISHAL_ROUTES['patuakhali-sbmch'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-1 border border-red-200">
            <Compass className="w-3.5 h-3.5" />
            <span>বরিশাল বিভাগীয় জরুরি ট্রানজিট ও কোল্ড-চেইন ইঞ্জিন</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            উপজেলা ও জেলা থেকে দ্রুততম রক্ত সরবরাহ রুট
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            পায়রা ও বেকুটিয়া সেতু, নদীপথের স্পিডবোট এবং রক্তের তাপমাত্রা (২°-৬°C) সংরক্ষণের নির্ভরযোগ্য দিকনির্দেশনা
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>লাইভ রুট ক্যালকুলেটেড</span>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">রুট নির্বাচন করুন:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(BARISHAL_ROUTES).map(([key, route]) => (
            <button
              key={key}
              onClick={() => setSelectedRouteKey(key)}
              className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
                selectedRouteKey === key
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div className="font-extrabold text-xs line-clamp-1">{route.origin.split('/')[0]}</div>
              <div className={`text-[10px] mt-1 flex items-center justify-between ${
                selectedRouteKey === key ? 'text-red-100' : 'text-slate-500'
              }`}>
                <span>{toBengaliDigits(route.distanceKm)} কিমি</span>
                <span className="font-bold">~{toBengaliDigits(route.estMinutes)} মিনিট</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>উৎস:</span>
              <strong className="text-slate-800 font-extrabold">{currentRoute.origin}</strong>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Navigation className="w-4 h-4 text-red-600 shrink-0" />
              <span>গন্তব্য:</span>
              <strong className="text-slate-800 font-extrabold">{currentRoute.destination}</strong>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5">
            <div>
              <span className="text-[10px] text-slate-500 block">মোট দূরত্ব</span>
              <span className="text-lg font-black text-slate-900">{toBengaliDigits(currentRoute.distanceKm)} কিমি</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">সম্ভাব্য সময়</span>
              <span className="text-lg font-black text-red-600">~{toBengaliDigits(currentRoute.estMinutes)} মিনিট</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              {currentRoute.routeType === 'river' ? (
                <Ship className="w-4 h-4 text-blue-600" />
              ) : (
                <Truck className="w-4 h-4 text-red-600" />
              )}
              <span>প্রস্তাবিত পরিবহন মাধ্যম</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {currentRoute.recommendedTransport}
            </p>
            {currentRoute.bridgeName && (
              <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                সেতু: {currentRoute.bridgeName}
              </span>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <span>কোল্ড-চেইন সতর্কতা (২°-৬° সে.)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {currentRoute.coldChainAdvice}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>জরুরি ট্রানজিট হটলাইন</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed font-mono">
              {currentRoute.emergencyHotline}
            </p>
            <span className="text-[10px] text-slate-400 block">২৪ ঘণ্টা অন-কল জরুরি সহায়তা</span>
          </div>
        </div>
      </div>
    </div>
  );
};
