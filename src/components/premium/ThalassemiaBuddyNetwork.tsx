import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS, BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Heart,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  HelpCircle,
} from 'lucide-react';

interface ThalassemiaPatient {
  id: number;
  patientName: string;
  age: number;
  bloodGroup: BloodGroup;
  intervalDays: number;
  nextDue: string;
  hospital: string;
  district: string;
  guardianPhone: string;
  buddiesCount: number;
  neededBuddies: number;
}

export const ThalassemiaBuddyNetwork: React.FC = () => {
  const [patients, setPatients] = useState<ThalassemiaPatient[]>([
    {
      id: 1,
      patientName: 'রায়হান ইসলাম (৭ বছর)',
      age: 7,
      bloodGroup: 'B+',
      intervalDays: 25,
      nextDue: '2026-10-18',
      hospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল',
      district: 'বরিশাল',
      guardianPhone: '01712-345678',
      buddiesCount: 2,
      neededBuddies: 3,
    },
    {
      id: 2,
      patientName: 'মারিয়া জান্নাত (১১ বছর)',
      age: 11,
      bloodGroup: 'O+',
      intervalDays: 30,
      nextDue: '2026-10-22',
      hospital: 'পটুয়াখালী জেলা সদর হাসপাতাল',
      district: 'পটুয়াখালী',
      guardianPhone: '01713-987654',
      buddiesCount: 3,
      neededBuddies: 3,
    },
    {
      id: 3,
      patientName: 'আফরিন সুলতানা (৫ বছর)',
      age: 5,
      bloodGroup: 'A+',
      intervalDays: 21,
      nextDue: '2026-10-15',
      hospital: 'ভোলা ২৫০ শয্যা জেনারেল হাসপাতাল',
      district: 'ভোলা',
      guardianPhone: '01714-556677',
      buddiesCount: 1,
      neededBuddies: 3,
    },
  ]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState(8);
  const [newBloodGroup, setNewBloodGroup] = useState<BloodGroup>('O+');
  const [newInterval, setNewInterval] = useState(25);
  const [newHospital, setNewHospital] = useState('শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল');
  const [newDistrict, setNewDistrict] = useState('বরিশাল');
  const [newPhone, setNewPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPhone) return;

    const newRecord: ThalassemiaPatient = {
      id: Date.now(),
      patientName: `${newPatientName} (${toBengaliDigits(newAge)} বছর)`,
      age: newAge,
      bloodGroup: newBloodGroup,
      intervalDays: newInterval,
      nextDue: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hospital: newHospital,
      district: newDistrict,
      guardianPhone: newPhone,
      buddiesCount: 0,
      neededBuddies: 3,
    };

    setPatients([newRecord, ...patients]);
    setShowRegisterModal(false);
    setNewPatientName('');
    setNewPhone('');
    setSuccessMsg('থ্যালাসেমিয়া রোগী সফলভাবে নিবন্ধিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleJoinAsBuddy = (patientId: number) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, buddiesCount: Math.min(p.buddiesCount + 1, p.neededBuddies) } : p
      )
    );
    setSuccessMsg('ধন্যবাদ! আপনি এই শিশুর নিয়মিত রক্তদাতা বাডি হিসেবে যুক্ত হয়েছেন।');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>থ্যালাসেমিয়া দীর্ঘমেয়াদি রক্ত সঞ্চালন নেটওয়ার্ক</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            থ্যালাসেমিয়া বাডি স্কোয়াড (Chronic Care)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রতিটি থ্যালাসেমিয়া শিশুর জন্য ৩ জন স্থায়ী রক্তদাতার টিম তৈরি করে নিয়মিত রক্ত নিশ্চিতকরণ
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন রোগী যোগ করুন</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-2xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-rose-50 to-red-50 p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="font-extrabold text-rose-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>বাডি স্কোয়াড কীভাবে কাজ করে?</span>
          </span>
          <p className="text-slate-600 text-[11px] leading-relaxed max-w-2xl">
            থ্যালাসেমিয়া রোগীদের প্রতি ২১ থেকে ৩০ দিন পর পর ১ ব্যাগ রক্ত প্রয়োজন হয়। ১ জন দাতা ৩ মাস পর পর রক্ত দিতে পারেন, তাই একটি শিশুর জন্য ৩ জন নিয়মিত ডোনার মিলে একটি সার্কেল তৈরি করলেই রোগী সারাবছর দুশ্চিন্তামুক্ত থাকতে পারে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patients.map((p) => {
          const isComplete = p.buddiesCount >= p.neededBuddies;
          return (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs">
                    {p.bloodGroup} গ্রুপ
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {p.buddiesCount}/{p.neededBuddies} জন বাডি সংযুক্ত
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  {p.patientName}
                </h4>
                <p className="text-xs text-slate-600 mb-1">
                  হাসপাতাল: {p.hospital}
                </p>
                <p className="text-[11px] text-slate-500 mb-2">
                  জেলা: {p.district} • প্রতি {toBengaliDigits(p.intervalDays)} দিন পর রক্ত প্রয়োজন
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span>পরবর্তী রক্তের তারিখ:</span>
                    <strong className="text-rose-600">{p.nextDue}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>অভিভাবকের নম্বর:</span>
                    <span className="font-mono font-bold">{p.guardianPhone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                {isComplete ? (
                  <div className="w-full py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>বাডি স্কোয়াড সম্পূর্ণ</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinAsBuddy(p.id)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>নিয়মিত বাডি হতে চাই</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-xs">
            <h3 className="font-black text-base text-slate-900 mb-1">
              থ্যালাসেমিয়া শিশু রোগী নিবন্ধন
            </h3>
            <p className="text-slate-500 mb-4">
              শিশুর প্রয়োজনীয় তথ্য প্রদান করে নিয়মিত রক্তদাতা দলের সহায়তা গ্রহণ করুন
            </p>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">রোগীর নাম</label>
                <input
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="যেমন: রায়হান ইসলাম"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বয়স (বছর)</label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রক্তদানের বিরতি (দিন)</label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={newInterval}
                    onChange={(e) => setNewInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">জেলা</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">হাসপাতাল</label>
                <input
                  type="text"
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অভিভাবকের মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  নিবন্ধন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
