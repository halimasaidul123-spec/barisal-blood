import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Phone,
  Truck,
  Wind,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface EmergencyVehicle {
  id: number;
  name: string;
  type: 'icu_ambulance' | 'ac_ambulance' | 'standard_ambulance' | 'oxygen_cylinder';
  provider: string;
  phone: string;
  district: string;
  upazila: string;
  availableHours: string;
  isVerified: boolean;
  notes: string;
}

export const AmbulanceOxygenDirectory: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const directory: EmergencyVehicle[] = [
    {
      id: 1,
      name: 'শের-ই-বাংলা মেডিকেল আইসিইউ অ্যাম্বুলেন্স সার্ভিস',
      type: 'icu_ambulance',
      provider: 'এসবিএমসিএইচ ও রেড ক্রিসেন্ট বরিশাল',
      phone: '01711-223344',
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'লাইফ সাপোর্ট ভেন্টিলেটর, কার্ডিয়াক মনিটর ও মেডিকেল অফিসারসহ ঢাকা বা বিভাগীয় স্থানান্তরে প্রস্তুত।',
    },
    {
      id: 2,
      name: 'পায়রা এক্সপ্রেস এসি অ্যাম্বুলেন্স',
      type: 'ac_ambulance',
      provider: 'পটুয়াখালী জেলা অ্যাম্বুলেন্স অ্যাসোসিয়েশন',
      phone: '01712-556677',
      district: 'পটুয়াখালী',
      upazila: 'পটুয়াখালী সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'পটুয়াখালী সদর ও পায়রা বন্দর এলাকার জন্য দ্রুততম সার্ভিস। অক্সিজেন সিলিন্ডার সংযুক্ত।',
    },
    {
      id: 3,
      name: 'দ্বীপবন্ধু জরুরি অ্যাম্বুলেন্স ও অক্সিজেন',
      type: 'ac_ambulance',
      provider: 'ভোলা রেড ক্রিসেন্ট ইউনিট',
      phone: '01713-889900',
      district: 'ভোলা',
      upazila: 'ভোলা সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'ভোলা ২৫০ শয্যা হাসপাতাল থেকে লাহারহাট বা ভেদুরিয়া ঘাটে দ্রুত রোগী ও রক্ত পরিবহনে প্রস্তুত।',
    },
    {
      id: 4,
      name: 'বরিশাল অক্সিজেন ব্যাংক ও রিফিল হাব',
      type: 'oxygen_cylinder',
      provider: 'বরিশাল ব্লাড ফাউন্ডেশন ও সেবাদান কেন্দ্র',
      phone: '01714-332211',
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      availableHours: '২৪ ঘণ্টা অন-কল',
      isVerified: true,
      notes: 'বাসায় ও হাসপাতালে জরুরি অক্সিজেন সিলিন্ডার ডেলিভারি ও ফ্লো-মিটার সেটআপ সুবিধা।',
    },
    {
      id: 5,
      name: 'পিরোজপুর পৌরসভা ইমার্জেন্সি অক্সিজেন সেন্টার',
      type: 'oxygen_cylinder',
      provider: 'পিরোজপুর স্বেচ্ছাসেবী ফোরাম',
      phone: '01715-665544',
      district: 'পিরোজপুর',
      upazila: 'পিরোজপুর সদর',
      availableHours: 'সকাল ৮টা - রাত ১২টা',
      isVerified: true,
      notes: 'জরুরি শ্বাসকষ্টের রোগীদের জন্য বিনামূল্যে সাময়িক সিলিন্ডার সেবা।',
    },
    {
      id: 6,
      name: 'বরগুনা উপকূলীয় অ্যাম্বুলেন্স সার্ভিস',
      type: 'standard_ambulance',
      provider: 'বরগুনা সেন্ট্রাল হসপিটাল কেয়ার',
      phone: '01716-990011',
      district: 'বরগুনা',
      upazila: 'বরগুনা সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'বরগুনা থেকে বরিশাল বা পটুয়াখালী রেফার্ড রোগীদের দ্রুত স্থানান্তরের উপযোগী।',
    },
    {
      id: 7,
      name: 'ঝালকাঠি সুগন্ধা কুইক অ্যাম্বুলেন্স',
      type: 'standard_ambulance',
      provider: 'ঝালকাঠি যুব রেড ক্রিসেন্ট দল',
      phone: '01717-443322',
      district: 'ঝালকাঠি',
      upazila: 'ঝালকাঠি সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'মাত্র ২৫ মিনিটে বরিশাল মেডিকেলে পৌঁছানোর সুবিধাজনক দ্রুত অ্যাম্বুলেন্স।',
    },
  ];

  const filtered = directory.filter((item) => {
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upazila.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesType && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'icu_ambulance':
        return { label: 'আইসিইউ অ্যাম্বুলেন্স', icon: Truck, color: 'text-red-700 bg-red-50' };
      case 'ac_ambulance':
        return { label: 'এসি অ্যাম্বুলেন্স', icon: Truck, color: 'text-blue-700 bg-blue-50' };
      case 'standard_ambulance':
        return { label: 'সাধারণ অ্যাম্বুলেন্স', icon: Truck, color: 'text-slate-700 bg-slate-100' };
      case 'oxygen_cylinder':
        return { label: 'অক্সিজেন সিলিন্ডার', icon: Wind, color: 'text-emerald-700 bg-emerald-50' };
      default:
        return { label: 'জরুরি যান', icon: Truck, color: 'text-slate-700 bg-slate-100' };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>জরুরি পরিবহন ও অক্সিজেন নেটওয়ার্ক</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            বিভাগীয় অ্যাম্বুলেন্স ও অক্সিজেন ডিরেক্টরি
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বরিশাল বিভাগের ৬টি জেলার নির্ভরযোগ্য অ্যাম্বুলেন্স ও জীবনরক্ষাকারী অক্সিজেন সিলিন্ডার সরবরাহকারীদের সরাসরি নম্বর
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          মোট সার্ভিস: {toBengaliDigits(directory.length)} টি
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="সার্ভিসের নাম বা এলাকা..."
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

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium cursor-pointer"
        >
          <option value="all">সব ধরনের সার্ভিস</option>
          <option value="icu_ambulance">আইসিইউ অ্যাম্বুলেন্স (ICU)</option>
          <option value="ac_ambulance">এসি অ্যাম্বুলেন্স</option>
          <option value="standard_ambulance">সাধারণ অ্যাম্বুলেন্স</option>
          <option value="oxygen_cylinder">অক্সিজেন সিলিন্ডার সেবা</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const typeInfo = getTypeLabel(item.type);
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-red-200 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 ${typeInfo.color}`}>
                    <typeInfo.icon className="w-3.5 h-3.5" />
                    <span>{typeInfo.label}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.availableHours}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-600 mb-2 font-medium">
                  পরিচালক: {item.provider}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  {item.notes}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.upazila}, {item.district}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-700">
                  {item.phone}
                </span>
                <a
                  href={`tel:${item.phone}`}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>কল দিন</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
