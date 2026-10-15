import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS } from '../../utils/locations.js';
import { Heart, ArrowRight, ShieldCheck, CheckCircle2, Info, Search } from 'lucide-react';

const COMPATIBILITY_DATA: Record<
  BloodGroup,
  {
    canGiveTo: BloodGroup[];
    canReceiveFrom: BloodGroup[];
    isUniversalDonor?: boolean;
    isUniversalRecipient?: boolean;
    note: string;
  }
> = {
  'O-': {
    canGiveTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-'],
    isUniversalDonor: true,
    note: 'সার্বজনীন দাতা (Universal Donor) হিসেবে পরিচিত। যেকোনো জরুরি অবস্থায় O- রক্ত যেকোনো রোগীকে দেওয়া যায়।',
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    note: 'বাংলাদেশের সবচেয়ে বেশি চাহিদাসম্পন্ন রক্তের গ্রুপ। যেকোনো পজিটিভ রোগীকে দেওয়া যায়।',
  },
  'A-': {
    canGiveTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    note: 'নেগেটিভ গ্রুপের রোগীদের জন্য অত্যন্ত গুরুত্বপূর্ণ। A ও AB উভয় গ্রুপে প্রযোজ্য।',
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    note: 'A+ এবং AB+ উভয় গ্রুপে রক্তদান করতে পারেন।',
  },
  'B-': {
    canGiveTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    note: 'B নেগেটিভ ও AB নেগেটিভ রোগীদের জরুরি প্রাণ রক্ষায় আবশ্যক।',
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    note: 'বাংলাদেশের অন্যতম প্রধান ও প্রচলিত গ্রুপ। B+ ও AB+ রোগীকে রক্তদান করা যায়।',
  },
  'AB-': {
    canGiveTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    note: 'অত্যন্ত বিরল রক্তের গ্রুপ। নিয়মিত তালিকাভুক্তি ও সংরক্ষণ জরুরি।',
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    isUniversalRecipient: true,
    note: 'সার্বজনীন গ্রহীতা (Universal Recipient)। যেকোনো গ্রুপের রক্ত গ্রহণ করতে সক্ষম।',
  },
};

interface BloodCompatibilityMatrixProps {
  onSearchGroup?: (group: BloodGroup) => void;
}

export const BloodCompatibilityMatrix: React.FC<BloodCompatibilityMatrixProps> = ({
  onSearchGroup,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const info = COMPATIBILITY_DATA[selectedGroup];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            রক্তের গ্রুপের সামঞ্জস্যতা নির্দেশিকা
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            কোন রক্তের গ্রুপ কার সাথে মিলে এবং জরুরি ক্ষেত্রে কাকে দেওয়া যায়
          </p>
        </div>
        {info.isUniversalDonor && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold text-xs">
            সার্বজনীন রক্তদাতা (Universal Donor)
          </span>
        )}
        {info.isUniversalRecipient && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
            সার্বজনীন গ্রহীতা (Universal Recipient)
          </span>
        )}
      </div>

      {/* Select Group Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          রক্তের গ্রুপ বেছে নিন:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`py-3 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                selectedGroup === bg
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105 ring-2 ring-red-400'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Compatibility Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Can Give Blood To */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{selectedGroup} রক্ত দিতে পারবে:</span>
          </div>
          <div className="flex flex-wrap gap-2 my-3">
            {info.canGiveTo.map((bg) => (
              <span
                key={bg}
                className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-200 font-black text-xs shadow-xs"
              >
                {bg}
              </span>
            ))}
          </div>
          <p className="text-xs text-emerald-700">
            এই রক্তের গ্রুপটি {info.canGiveTo.length}টি গ্রুপের রোগীদের জীবন বাঁচাতে সক্ষম।
          </p>
        </div>

        {/* Can Receive Blood From */}
        <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>{selectedGroup} রক্ত গ্রহণ করতে পারবে:</span>
          </div>
          <div className="flex flex-wrap gap-2 my-3">
            {info.canReceiveFrom.map((bg) => (
              <span
                key={bg}
                className="px-3 py-1.5 rounded-xl bg-white text-rose-800 border border-rose-200 font-black text-xs shadow-xs"
              >
                {bg}
              </span>
            ))}
          </div>
          <p className="text-xs text-rose-700">
            জরুরি পরিস্থিতিতে এই {info.canReceiveFrom.length}টি গ্রুপের রক্তের সাহায্য নেওয়া যাবে।
          </p>
        </div>
      </div>

      {/* Scientific Note & Action */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 text-slate-600">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{info.note}</p>
        </div>
        {onSearchGroup && (
          <button
            onClick={() => onSearchGroup(selectedGroup)}
            className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{selectedGroup} রক্তদাতা খুঁজুন</span>
          </button>
        )}
      </div>
    </div>
  );
};
