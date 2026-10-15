import React, { useState, useRef } from 'react';
import { BloodRequest, BloodGroup } from '../../types/index.js';
import { BARISHAL_DIVISION_DISTRICTS, BLOOD_GROUPS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  FileText,
  Printer,
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
} from 'lucide-react';

interface BloodRequisitionSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRequest?: BloodRequest | null;
}

export const BloodRequisitionSlipModal: React.FC<BloodRequisitionSlipModalProps> = ({
  isOpen,
  onClose,
  initialRequest,
}) => {
  const [patientName, setPatientName] = useState(initialRequest?.patient_name || 'আব্দুর রহিম');
  const [age, setAge] = useState('৪৫');
  const [gender, setGender] = useState('পুরুষ');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(initialRequest?.blood_group || 'B+');
  const [units, setUnits] = useState(initialRequest?.units_needed || 2);
  const [hospital, setHospital] = useState(initialRequest?.hospital_name || 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল');
  const [wardCabin, setWardCabin] = useState('সার্জারি ওয়ার্ড, বেড ১২');
  const [regNo, setRegNo] = useState(`SBMC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [diagnosis, setDiagnosis] = useState('তীব্র রক্তক্ষরণ ও ইমার্জেন্সি ল্যাপারোটমি');
  const [componentType, setComponentType] = useState('হোল ব্লাড (Whole Blood)');
  const [doctorName, setDoctorName] = useState('ডা. কাজী মাহবুবুল আলম (রেজিস্ট্রার)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                হাসপাতাল ব্লাড রিকুইজিশন ও ক্রস-ম্যাচ স্লিপ
              </h3>
              <p className="text-xs text-slate-500">
                হাসপাতালে রক্ত ব্যাংক ও দাতার কাছে প্রদর্শনের প্রাতিষ্ঠানিক রিকুইজিশন ফর্ম
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট স্লিপ</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview */}
        <div
          ref={printableRef}
          className="mt-6 p-6 sm:p-8 bg-white border-2 border-slate-800 rounded-2xl text-slate-900 font-sans space-y-5 print:border-none print:p-0"
        >
          <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার / হাসপাতাল ব্লাড ব্যাংক
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {hospital}
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              রক্ত পরিসঞ্চালন বিভাগ ও ট্রান্সফিউশন মেডিসিন
            </p>
            <span className="inline-block mt-1 px-4 py-0.5 rounded-full bg-slate-900 text-white font-bold text-xs">
              জরুরি রক্তের চাহিদা পত্র (Blood Requisition Form)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] block">রেজিস্ট্রেশন নং:</span>
              <strong className="font-mono text-slate-900">{regNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">তারিখ:</span>
              <strong className="text-slate-900">{date}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">ওয়ার্ড ও বেড:</span>
              <strong className="text-slate-900 line-clamp-1">{wardCabin}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">অগ্রাধিকার:</span>
              <strong className="text-red-700 font-black">জরুরি (Stat/Urgent)</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-1">
            <div className="space-y-1">
              <span className="text-slate-500 text-[11px]">রোগীর নাম:</span>
              <div className="font-bold text-sm text-slate-900 border-b border-dotted border-slate-400 pb-0.5">
                {patientName}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-slate-500 text-[11px]">বয়স / লিঙ্গ:</span>
                <div className="font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5">
                  {age} বছর / {gender}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-[11px]">রক্তের গ্রুপ:</span>
                <div className="font-black text-base text-red-600 border-b border-dotted border-slate-400 pb-0.5">
                  {bloodGroup}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-red-50/50 p-4 rounded-xl border border-red-100">
            <div>
              <span className="text-slate-600 block text-[11px]">প্রয়োজনীয় রক্তের পরিমাণ:</span>
              <strong className="text-red-700 text-sm font-black">
                {toBengaliDigits(units)} ব্যাগ
              </strong>
            </div>
            <div>
              <span className="text-slate-600 block text-[11px]">রক্তের ধরন (Component):</span>
              <strong className="text-slate-900 font-bold">{componentType}</strong>
            </div>
            <div>
              <span className="text-slate-600 block text-[11px]">রোগের বিবরণ:</span>
              <strong className="text-slate-900 font-bold line-clamp-1">{diagnosis}</strong>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl p-3 text-[11px] space-y-1.5 bg-slate-50/30">
            <span className="font-black text-slate-900 block text-xs">
              ল্যাবরেটরি স্ক্রিনিং চেকলিস্ট (বাধ্যতামূলক ৫টি পরীক্ষা):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
              <span>[ ] HBsAg (হেপাটাইটিস বি)</span>
              <span>[ ] HCV (হেপাটাইটিস সি)</span>
              <span>[ ] HIV (এইডস)</span>
              <span>[ ] VDRL (সিফিলিস)</span>
            </div>
            <div className="pt-1 text-slate-600 flex items-center justify-between border-t border-slate-200 mt-1">
              <span>[ ] এমপি (ম্যালেরিয়া প্যারাসাইট)</span>
              <span>ক্রস-ম্যাচিং স্ট্যাটাস: _________________</span>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-800 pt-1 font-bold text-slate-900">
                {doctorName}
              </div>
              <span className="text-[10px] text-slate-500">
                অনুরোধকারী চিকিৎসকের স্বাক্ষর ও সিল
              </span>
            </div>
            <div>
              <div className="border-t border-slate-800 pt-1 font-bold text-slate-900">
                ব্লাড ব্যাংক ইনচার্জ
              </div>
              <span className="text-[10px] text-slate-500">
                রক্ত প্রদানকারী ল্যাব টেকনোলজিস্ট
              </span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400">
            বরিশাল রক্ত বিভাগীয় প্ল্যাটফর্ম • আর্কিটেক্ট: MD. SAIDUL ISLAM
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 block">
            স্লিপের তথ্য পরিবর্তন করতে নিচে সম্পাদন করুন:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">রোগীর নাম:</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">হাসপাতাল:</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">ওয়ার্ড/বেড:</label>
              <input
                type="text"
                value={wardCabin}
                onChange={(e) => setWardCabin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
