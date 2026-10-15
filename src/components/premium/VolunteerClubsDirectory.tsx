import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import {
  Users,
  MapPin,
  Phone,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Search,
  ExternalLink,
  Award,
} from 'lucide-react';

interface VolunteerClub {
  id: number;
  name: string;
  campus: string;
  district: string;
  coordinator: string;
  phone: string;
  established: string;
  activeVolunteers: string;
  focus: string;
}

export const VolunteerClubsDirectory: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const clubs: VolunteerClub[] = [
    {
      id: 1,
      name: 'সন্ধানী (Sandhani) - শের-ই-বাংলা মেডিকেল কলেজ ইউনিট',
      campus: 'শের-ই-বাংলা মেডিকেল কলেজ (SBMC), বরিশাল',
      district: 'বরিশাল',
      coordinator: 'ডা. রেজওয়ানুল হক (সভাপতি)',
      phone: '01711-334455',
      established: '১৯৭৯',
      activeVolunteers: '১২০+ জন মেডিকেল শিক্ষার্থী',
      focus: 'সার্বক্ষণিক ব্লাড ট্রান্সফিউশন, ব্লাড টাইপিং ও রোগী সহায়তা।',
    },
    {
      id: 2,
      name: 'বাঁধন (Badhan) - বরিশাল বিশ্ববিদ্যালয় পরিবার',
      campus: 'বরিশাল বিশ্ববিদ্যালয় (BU), কর্ণকাঠী',
      district: 'বরিশাল',
      coordinator: 'মো. আরিফুল ইসলাম',
      phone: '01712-667788',
      established: '২০১২',
      activeVolunteers: '৮৫+ জন শিক্ষার্থী',
      focus: 'বিশ্ববিদ্যালয় ক্যাম্পাস ও রূপাতলী অঞ্চলে জরুরি রক্তদান নেটওয়ার্ক।',
    },
    {
      id: 3,
      name: 'রেড ক্রিসেন্ট যুব রক্তদাতা দল বরিশাল',
      campus: 'রেড ক্রিসেন্ট ভবন, বান্দ রোড, বরিশাল',
      district: 'বরিশাল',
      coordinator: 'সৈয়দ তানজিম আহমেদ',
      phone: '01713-990011',
      established: '১৯৭২',
      activeVolunteers: '২০০+ সদস্য',
      focus: 'দুর্যোগকালীন জরুরি রক্ত সরবরাহ ও ক্যাম্পেইন পরিচালনা।',
    },
    {
      id: 4,
      name: 'পটুয়াখালী ব্লাড ডোনার্স ক্লাব (PBDC)',
      campus: 'পটুয়াখালী সরকারি কলেজ ও পবিপ্রবি ফোরাম',
      district: 'পটুয়াখালী',
      coordinator: 'নাজমুল হাসান সৈকত',
      phone: '01714-223344',
      established: '২০১৬',
      activeVolunteers: '৬০+ স্বেচ্ছাসেবী',
      focus: 'পটুয়াখালী জেলা হাসপাতাল ও উপকূলীয় অঞ্চলের রক্তের চাহিদা পূরণ।',
    },
    {
      id: 5,
      name: 'ভোলা হেল্পলাইন ব্লাড উইং',
      campus: 'ভোলা সরকারি কলেজ রোড, ভোলা সদর',
      district: 'ভোলা',
      coordinator: 'মুহাম্মদ মহিউদ্দিন',
      phone: '01715-556677',
      established: '২০১৮',
      activeVolunteers: '৪৫+ স্বেচ্ছাসেবী',
      focus: 'দ্বীপজেলা ভোলায় স্পিডবোট ট্রানজিট ও থ্যালাসেমিয়া শিশুদের সহায়তা।',
    },
    {
      id: 6,
      name: 'পিরোজপুর রক্তবন্ধু ফোরাম',
      campus: 'পিরোজপুর সদর',
      district: 'পিরোজপুর',
      coordinator: 'মাহমুদ আল-মামুন',
      phone: '01716-889900',
      established: '২০১৯',
      activeVolunteers: '৪০+ তরুণ',
      focus: 'পিরোজপুর ও ঝালকাঠি এলাকার হাসপাতালে তাৎক্ষণিক রক্তদাতা সরবরাহ।',
    },
  ];

  const filtered = clubs.filter((c) => {
    const matchesDist = selectedDistrict === 'all' || c.district === selectedDistrict;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDist && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>স্বেচ্ছাসেবী রক্তদাতা সংগঠনসমূহ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            বিভাগীয় ক্যাম্পাস ও যুব ব্লাড ক্লাব ডিরেক্টরি
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বরিশালের বিভিন্ন কলেজ, বিশ্ববিদ্যালয় ও সমাজসেবামূলক রক্তদান সংগঠনের সাথে সরাসরি সমন্বয়
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          সংযুক্ত সংগঠন: {clubs.length} টি
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="সংগঠনের নাম বা ক্যাম্পাস..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white transition"
          />
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium cursor-pointer"
        >
          <option value="all">সব জেলা (বরিশাল বিভাগ)</option>
          {BARISHAL_DIVISION_DISTRICTS.map((d) => (
            <option key={d.name} value={d.name}>{d.name} জেলা</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-red-200 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                  প্রতিষ্ঠা: {c.established}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  {c.activeVolunteers}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {c.name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{c.campus}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                {c.focus}
              </p>
              <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                <div>সমন্বয়কারী: <strong>{c.coordinator}</strong></div>
                <div className="font-mono text-red-700 font-bold">যোগাযোগ: {c.phone}</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{c.district} জেলা</span>
              </span>
              <a
                href={`tel:${c.phone}`}
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
