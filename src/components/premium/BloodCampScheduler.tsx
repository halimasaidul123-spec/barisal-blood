import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  CheckCircle2,
  Phone,
  Ticket,
  Sparkles,
  Download,
  Share2,
  Search,
  PlusCircle,
  X,
  Award,
} from 'lucide-react';

interface BloodCamp {
  id: number;
  title: string;
  organizer: string;
  district: string;
  location: string;
  date: string;
  time: string;
  targetUnits: number;
  bookedSlots: number;
  coordinatorName: string;
  coordinatorPhone: string;
  badge: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const INITIAL_CAMPS: BloodCamp[] = [
  {
    id: 1,
    title: 'বিভাগীয় যুব রক্তদান উৎসব ২০২৬',
    organizer: 'সন্ধানী ও রেড ক্রিসেন্ট বরিশাল',
    district: 'বরিশাল',
    location: 'শের-ই-বাংলা মেডিকেল কলেজ প্রাঙ্গণ, বরিশাল',
    date: '২০২৬-১১-০৫',
    time: 'সকাল ৯:০০ - বিকাল ৪:০০',
    targetUnits: 250,
    bookedSlots: 168,
    coordinatorName: 'ডা. সায়েম আহমেদ',
    coordinatorPhone: '01711-224466',
    badge: 'মেগা ক্যাম্প',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'পায়রা উপকূলীয় স্বেচ্ছায় রক্তদান মেলা',
    organizer: 'পটুয়াখালী ব্লাড ডোনার্স ক্লাব',
    district: 'পটুয়াখালী',
    location: 'পটুয়াখালী সরকারি কলেজ অডিটোরিয়াম',
    date: '২০২৬-১১-১২',
    time: 'সকাল ১০:০০ - বিকাল ৩:৩০',
    targetUnits: 180,
    bookedSlots: 112,
    coordinatorName: 'নাজমুল হাসান সৈকত',
    coordinatorPhone: '01714-223344',
    badge: 'কলেজ ক্যাম্পাস ড্রাইভ',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'দ্বীপবন্ধু রক্তদান কর্মসূচি ও হেলথ ক্যাম্প',
    organizer: 'ভোলা হেল্পলাইন ব্লাড উইং',
    district: 'ভোলা',
    location: 'ভোলা টাউন হল প্রাঙ্গণ, ভোলা সদর',
    date: '২০২৬-১১-২০',
    time: 'সকাল ৯:৩০ - বিকাল ৫:০০',
    targetUnits: 200,
    bookedSlots: 85,
    coordinatorName: 'মুহাম্মদ মহিউদ্দিন',
    coordinatorPhone: '01715-556677',
    badge: 'দ্বীপজেলা ড্রাইভ',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'থ্যালাসেমিয়া শিশুদের সাহায্যার্থে বিশেষ রক্তদান ক্যাম্প',
    organizer: 'বরিশাল থ্যালাসেমিয়া ফোরাম ও রোটারি',
    district: 'বরিশাল',
    location: 'অশ্বিনী কুমার হল, সদর রোড, বরিশাল',
    date: '২০২৬-১১-২৫',
    time: 'সকাল ১০:০০ - বিকাল ৪:০০',
    targetUnits: 150,
    bookedSlots: 74,
    coordinatorName: 'মো. তৌহিদুল ইসলাম',
    coordinatorPhone: '01712-998811',
    badge: 'থ্যালাসেমিয়া স্পেশাল',
    status: 'upcoming',
  },
  {
    id: 5,
    title: 'পিরোজপুর রক্তবন্ধু গণ-রক্তদান সমাবেশ',
    organizer: 'পিরোজপুর রক্তবন্ধু ফোরাম',
    district: 'পিরোজপুর',
    location: 'শহীদ মিনার চত্বর, পিরোজপুর',
    date: '২০২৬-১২-০১',
    time: 'সকাল ১০:০০ - বিকাল ৩:০০',
    targetUnits: 120,
    bookedSlots: 45,
    coordinatorName: 'মাহমুদ আল-মামুন',
    coordinatorPhone: '01716-889900',
    badge: 'গণ-সমাবেশ',
    status: 'upcoming',
  },
];

export const BloodCampScheduler: React.FC = () => {
  const [camps, setCamps] = useState<BloodCamp[]>(INITIAL_CAMPS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [bookingCamp, setBookingCamp] = useState<BloodCamp | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorBloodGroup, setDonorBloodGroup] = useState('O+');
  const [preferredSlot, setPreferredSlot] = useState('সকাল ১০:০০ - ১১:০০');
  const [ticketData, setTicketData] = useState<{
    passId: string;
    camp: BloodCamp;
    name: string;
    bloodGroup: string;
    slot: string;
  } | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newDistrict, setNewDistrict] = useState('বরিশাল');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTarget, setNewTarget] = useState('100');

  const filteredCamps = camps.filter((c) => {
    const matchDistrict = selectedDistrict === 'all' || c.district === selectedDistrict;
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDistrict && matchSearch;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCamp || !donorName || !donorPhone) return;

    setCamps((prev) =>
      prev.map((c) =>
        c.id === bookingCamp.id ? { ...c, bookedSlots: c.bookedSlots + 1 } : c
      )
    );

    const generatedPass = {
      passId: `CAMP-BR-${Math.floor(1000 + Math.random() * 9000)}`,
      camp: bookingCamp,
      name: donorName,
      bloodGroup: donorBloodGroup,
      slot: preferredSlot,
    };

    setTicketData(generatedPass);
    setBookingCamp(null);
    setDonorName('');
    setDonorPhone('');
  };

  const handleAddNewCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newDate) return;

    const added: BloodCamp = {
      id: Date.now(),
      title: newTitle,
      organizer: newOrg || 'স্বেচ্ছাসেবী ফোরাম',
      district: newDistrict,
      location: newLocation,
      date: newDate,
      time: 'সকাল ৯:০০ - বিকাল ৪:০০',
      targetUnits: parseInt(newTarget, 10) || 100,
      bookedSlots: 1,
      coordinatorName: 'ক্যাম্প সমন্বয়ক',
      coordinatorPhone: newPhone || '017XXXXXXXX',
      badge: 'নতুন উদ্যোগ',
      status: 'upcoming',
    };

    setCamps([added, ...camps]);
    setShowAddModal(false);
    setNewTitle('');
    setNewLocation('');
    setNewOrg('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ভ্রাম্যমাণ রক্তদান ড্রাইভ ও ক্যাম্পেইন হাব</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            রক্তদান ক্যাম্পেইন শিডিউলার ও প্রি-বুকিং
          </h2>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
            বরিশাল বিভাগের বিভিন্ন শিক্ষা প্রতিষ্ঠান, সামাজিক সংগঠন ও কমিউনিটিতে অনুষ্ঠিতব্য রক্তদান ক্যাম্পেইনের তালিকা এবং অগ্রিম স্লট বুকিং।
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন ক্যাম্পের আবেদন</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ক্যাম্পের নাম বা স্থান..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedDistrict('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              selectedDistrict === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সব জেলা
          </button>
          {BARISHAL_DIVISION_DISTRICTS.map((d) => (
            <button
              key={d.name}
              onClick={() => setSelectedDistrict(d.name)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedDistrict === d.name
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCamps.map((camp) => {
          const progress = Math.min(
            100,
            Math.round((camp.bookedSlots / camp.targetUnits) * 100)
          );
          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-red-300 transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                      {camp.badge}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5 group-hover:text-red-600 transition">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      আয়োজক: {camp.organizer}
                    </p>
                  </div>
                  <span className="text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl shrink-0">
                    {camp.district}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="line-clamp-1">{camp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{camp.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{camp.time}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      টার্গেট: {toBengaliDigits(camp.targetUnits)} ব্যাগ
                    </span>
                    <span className="font-black text-red-600">
                      বুকিং: {toBengaliDigits(camp.bookedSlots)} জন ({toBengaliDigits(progress)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  <span>সমন্বয়ক: </span>
                  <a
                    href={`tel:${camp.coordinatorPhone}`}
                    className="font-bold text-slate-700 hover:text-red-600 inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {camp.coordinatorPhone}
                  </a>
                </div>
                <button
                  onClick={() => setBookingCamp(camp)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>স্লট বুক করুন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Slot Modal */}
      {bookingCamp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  রক্তদান ক্যাম্পের সময় স্লট বুক করুন
                </h3>
              </div>
              <button
                onClick={() => setBookingCamp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 p-3 rounded-2xl text-xs text-red-950 space-y-1">
              <span className="font-bold text-red-700">{bookingCamp.title}</span>
              <p className="text-[11px] text-slate-600">{bookingCamp.location}</p>
              <p className="text-[11px] font-bold text-red-800">
                তারিখ: {bookingCamp.date} ({bookingCamp.time})
              </p>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    রক্তের গ্রুপ
                  </label>
                  <select
                    value={donorBloodGroup}
                    onChange={(e) => setDonorBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পছন্দের সময় স্লট
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                >
                  <option value="সকাল ৯:০০ - ১০:০০">সকাল ৯:০০ - ১০:০০</option>
                  <option value="সকাল ১০:০০ - ১১:০০">সকাল ১০:০০ - ১১:০০</option>
                  <option value="সকাল ১১:০০ - দুপুর ১২:০০">সকাল ১১:০০ - দুপুর ১২:০০</option>
                  <option value="দুপুর ১২:০০ - ১:০০">দুপুর ১২:০০ - ১:০০</option>
                  <option value="দুপুর ২:০০ - ৩:০০">দুপুর ২:০০ - ৩:০০</option>
                  <option value="বিকাল ৩:০০ - ৪:০০">বিকাল ৩:০০ - ৪:০০</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  স্লট নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Donor Camp Pass Modal */}
      {ticketData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-black text-lg text-slate-900">
              রক্তদান ক্যাম্প বুকিং নিশ্চিত হয়েছে!
            </h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300 text-left space-y-2 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">পাস আইডি:</span>
                <span className="font-mono font-black text-red-600">
                  {ticketData.passId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">রক্তদাতা:</span>
                <span className="font-bold text-slate-800">{ticketData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">গ্রুপ:</span>
                <span className="font-black text-red-600">{ticketData.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ক্যাম্প:</span>
                <span className="font-bold text-slate-800 line-clamp-1">
                  {ticketData.camp.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">তারিখ ও স্লট:</span>
                <span className="font-bold text-slate-800">
                  {ticketData.camp.date} ({ticketData.slot})
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              ক্যাম্পে পৌঁছানোর পর এই পাসটি স্ক্রিনে প্রদর্শন করুন।
            </p>
            <button
              onClick={() => setTicketData(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Add New Camp Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  নতুন রক্তদান ক্যাম্পেইন আবেদন
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewCamp} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ক্যাম্পেইনের শিরোনাম
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: কলেজ ক্যাম্পাস রক্তদান উৎসব"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  সংগঠন / আয়োজক
                </label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="সংগঠনের নাম"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    জেলা
                  </label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                  >
                    {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  স্থান ও ঠিকানা
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="বিস্তারিত ঠিকানা"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    টার্গেট ব্যাগ
                  </label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  আবেদন জমা দিন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
