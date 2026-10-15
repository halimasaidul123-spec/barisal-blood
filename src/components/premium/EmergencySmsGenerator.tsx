import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS, BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Share2,
  Sparkles,
  Phone,
  Droplet,
  Building2,
  MapPin,
} from 'lucide-react';

export const EmergencySmsGenerator: React.FC = () => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [patientName, setPatientName] = useState('আব্দুর রহিম');
  const [units, setUnits] = useState(2);
  const [hospital, setHospital] = useState('শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল');
  const [district, setDistrict] = useState('বরিশাল');
  const [phone, setPhone] = useState('01719876543');
  const [problem, setProblem] = useState('জরুরি সার্জারি অপারেশন');
  const [copied, setCopied] = useState(false);
  const [formatType, setFormatType] = useState<'sms' | 'whatsapp' | 'facebook'>('sms');

  const generateText = () => {
    if (formatType === 'sms') {
      return `[জরুরি রক্তের আবেদন]\nরক্তের গ্রুপ: ${bloodGroup} (${toBengaliDigits(units)} ব্যাগ)\nরোগী: ${patientName} (${problem})\nহাসপাতাল: ${hospital}, ${district}\nযোগাযোগ: ${phone}\n- বরিশাল রক্ত নেটওয়ার্ক`;
    } else if (formatType === 'whatsapp') {
      return `🚨 *জরুরি রক্তের আবেদন (বরিশাল রক্ত)* 🚨\n\n🩸 *রক্তের গ্রুপ:* ${bloodGroup} (${toBengaliDigits(units)} ব্যাগ)\n👤 *রোগী:* ${patientName}\n⚠️ *সমস্যা:* ${problem}\n🏥 *হাসপাতাল:* ${hospital}\n📍 *জেলা:* ${district}\n\n📞 *জরুরি যোগাযোগ:* ${phone}\n\nদয়া করে শেয়ার করে জীবন বাঁচাতে সাহায্য করুন।\n\n- সফটওয়্যার আর্কিটেক্ট: MD. SAIDUL ISLAM`;
    } else {
      return `জরুরি রক্তের প্রয়োজন! গ্রুপ: ${bloodGroup}\n\nরোগীর নাম: ${patientName}\nহাসপাতাল: ${hospital}, ${district}\nরক্তের পরিমাণ: ${toBengaliDigits(units)} ব্যাগ\nশারীরিক অবস্থা: ${problem}\nযোগাযোগ নম্বর: ${phone}\n\n#BloodDonation #BarishalRokto #${bloodGroup} #Barishal\nমানবিক সাহায্যে এগিয়ে আসুন।`;
    }
  };

  const currentText = generateText();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>জরুরি মেসেজ টেমপ্লেট</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            রক্ত চাওয়ার দ্রুত মেসেজ জেনারেটর
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            এসএমএস, হোয়াটসঅ্যাপ ও ফেসবুক স্ট্যাটাসের জন্য প্রস্তুত করা স্ট্যান্ডার্ড টেক্সট
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'কপি সম্পন্ন!' : 'মেসেজ কপি করুন'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFormatType('sms')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
            formatType === 'sms'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          সাধারণ এসএমএস (SMS)
        </button>
        <button
          onClick={() => setFormatType('whatsapp')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
            formatType === 'whatsapp'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          হোয়াটসঅ্যাপ ফরম্যাট
        </button>
        <button
          onClick={() => setFormatType('facebook')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
            formatType === 'facebook'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          সোশ্যাল মিডিয়া পোস্ট
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ব্যাগ সংখ্যা</label>
              <input
                type="number"
                min="1"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">রোগীর নাম</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">হাসপাতাল</label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">শারীরিক সমস্যা</label>
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">যোগাযোগ নম্বর</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>লাইভ প্রিভিউ</span>
            <span>অক্ষর সংখ্যা: {toBengaliDigits(currentText.length)} টি</span>
          </div>
          <pre className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed shadow-xs min-h-[160px]">
            {currentText}
          </pre>
        </div>
      </div>
    </div>
  );
};
