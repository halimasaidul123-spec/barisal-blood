import React from 'react';
import { User } from '../../types/index.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import { Droplet, Award, ShieldCheck, QrCode, Sparkles } from 'lucide-react';

interface DigitalDonorCardProps {
  user: User;
  onOpenCertificate?: () => void;
}

export const DigitalDonorCard: React.FC<DigitalDonorCardProps> = ({
  user,
  onOpenCertificate,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 text-white p-6 shadow-xl border border-red-500/30">
      {/* Decorative background glow & blood drop watermark */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <Droplet className="absolute right-4 bottom-4 w-32 h-32 text-white/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Droplet className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-100">বরিশাল রক্ত সেবা</h4>
            <p className="text-[10px] text-white/70">স্মার্ট রক্তদাতা আইডি কার্ড</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ভেরিফাইড লাইফসেভার</span>
        </div>
      </div>

      {/* Main Donor Info */}
      <div className="grid grid-cols-3 gap-4 items-center mb-6 relative z-10">
        <div className="col-span-2">
          <span className="text-[10px] uppercase tracking-wider text-red-200">রক্তদাতার নাম</span>
          <h3 className="text-lg font-black text-white truncate">{user.name}</h3>
          <p className="text-xs text-red-100/80 mt-0.5">
            {user.upazila ? `${user.upazila}, ` : ''}{user.district || 'বরিশাল বিভাগ'}
          </p>
          <p className="text-[11px] text-white/70 font-mono mt-1">
            আইডি: BR-{(user.id || 1).toString().padStart(5, '0')}
          </p>
        </div>

        {/* Blood Group Badge */}
        <div className="flex flex-col items-center justify-center bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/25 shadow-inner">
          <span className="text-[9px] text-red-200 font-bold uppercase">গ্রুপ</span>
          <span className="text-2xl font-black text-white leading-none my-0.5">
            {user.blood_group || 'O+'}
          </span>
          <span className="text-[9px] text-emerald-300 font-medium">রক্তদাতা</span>
        </div>
      </div>

      {/* Stats and Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/15 relative z-10 text-xs">
        <div>
          <span className="text-[10px] text-red-200 block">মোট রক্তদান</span>
          <span className="text-base font-black text-white">
            {toBengaliDigits(user.total_donations || 0)} বার
          </span>
        </div>

        {onOpenCertificate && (
          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-red-700 hover:bg-red-50 text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>সনদপত্র দেখুন</span>
          </button>
        )}
      </div>
    </div>
  );
};
