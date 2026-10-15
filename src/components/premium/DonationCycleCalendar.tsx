import React, { useState } from 'react';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import {
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  Sparkles,
  Heart,
  Activity,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const DonationCycleCalendar: React.FC = () => {
  const [lastDate, setLastDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 45);
    return d.toISOString().split('T')[0];
  });
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const intervalDays = gender === 'male' ? 90 : 120;
  const baseDate = new Date(lastDate);

  const milestones = [1, 2, 3, 4].map((step) => {
    const futureDate = new Date(baseDate);
    futureDate.setDate(baseDate.getDate() + intervalDays * step);
    return {
      step,
      date: futureDate.toISOString().split('T')[0],
      displayDate: formatDateBengali(futureDate.toISOString()),
      quarter: `রক্তদান চক্র ${toBengaliDigits(step)}`,
    };
  });

  const nextEligibleDate = new Date(baseDate);
  nextEligibleDate.setDate(baseDate.getDate() + intervalDays);
  const today = new Date();
  const diffTime = nextEligibleDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isReady = diffDays <= 0;

  const handleDownloadIcs = () => {
    const eventDate = nextEligibleDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//barishal-Blood//Blood Donation Calendar//BN\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nSUMMARY:রক্তদানের সম্ভাব্য তারিখ - barishal-Blood\nDESCRIPTION:বরিশাল রক্ত প্ল্যাটফর্মের রক্তদান রিমাইন্ডার। লিড সফটওয়্যার আর্কিটেক্ট: MD. SAIDUL ISLAM\nDTSTART:${eventDate.substring(0, 8)}T090000Z\nDTEND:${eventDate.substring(0, 8)}T100000Z\nSTATUS:CONFIRMED\nBEGIN:VALARM\nTRIGGER:-PT24H\nACTION:DISPLAY\nDESCRIPTION:রক্তদানের সময় হয়েছে\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `blood-donation-reminder-${nextEligibleDate.toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>স্মার্ট রিকভারি ও সাইকেল ট্র্যাকার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            রক্তদান সাইকেল ক্যালেন্ডার ও .ics রিমাইন্ডার
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            শরীর কখন পুনরায় রক্তদানের জন্য প্রস্তুত হবে তা ক্যালকুলেট করে ক্যালেন্ডারে রিমাইন্ডার সেট করুন
          </p>
        </div>
        <button
          onClick={handleDownloadIcs}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>ক্যালেন্ডার ফাইল (.ics) ডাউনলোড</span>
        </button>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            সর্বশেষ রক্তদানের তারিখ নির্ধারণ করুন:
          </label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            শারীরিক লিঙ্গ নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGender('male')}
              className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                gender === 'male'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              পুরুষ (৯০ দিন পর পর)
            </button>
            <button
              onClick={() => setGender('female')}
              className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                gender === 'female'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              নারী (১২০ দিন পর পর)
            </button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isReady ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isReady ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">
              {isReady
                ? 'অভিনন্দন! আপনি এখন রক্তদানের জন্য সম্পূর্ণরূপে প্রস্তুত'
                : `পরবর্তী রক্তদানের জন্য আর ${toBengaliDigits(diffDays)} দিন বাকি`}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              সম্ভাব্য রক্তদানের তারিখ: <strong>{milestones[0].displayDate}</strong>
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
          isReady ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
        }`}>
          {isReady ? 'READY TO DONATE' : 'RECOVERY PHASE'}
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
          শরীরের রক্ত উপাদান পুনরুদ্ধারের পর্যায়ক্রম:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">প্লাজমা (তরল অংশ)</span>
            <span className="text-red-600 font-extrabold block text-sm mt-0.5">২৪ থেকে ৪৮ ঘণ্টা</span>
            <span className="text-[11px] text-slate-500">পানি ও স্যালাইন পানে দ্রুত পূরণ হয়</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">প্লাটিলেট ও শ্বেতকণিকা</span>
            <span className="text-blue-600 font-extrabold block text-sm mt-0.5">৩ থেকে ৫ দিন</span>
            <span className="text-[11px] text-slate-500">অস্থিমজ্জা থেকে পুনর্গঠিত হয়</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">লোহিত রক্তকণিকা (RBC)</span>
            <span className="text-rose-600 font-extrabold block text-sm mt-0.5">৪ থেকে ৬ সপ্তাহ</span>
            <span className="text-[11px] text-slate-500">নতুন লোহিত রক্তকণিকা তৈরি হয়</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">আয়রন রিজার্ভ (লৌহ স্তর)</span>
            <span className="text-emerald-600 font-extrabold block text-sm mt-0.5">{toBengaliDigits(intervalDays)} দিন</span>
            <span className="text-[11px] text-slate-500">পরবর্তী রক্তদানের জন্য পূর্ণ নিরাপত্তা</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3">
          আগামী ৪টি রক্তদানের ক্যালেন্ডার পূর্বাভাস:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {milestones.map((m) => (
            <div
              key={m.step}
              className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 hover:border-red-300 transition text-center"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center mx-auto mb-2">
                {toBengaliDigits(m.step)}
              </div>
              <h5 className="font-bold text-xs text-slate-900 mb-1">{m.quarter}</h5>
              <div className="text-sm font-black text-red-700 mb-1">{m.displayDate}</div>
              <span className="text-[10px] text-slate-400 font-mono">{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
