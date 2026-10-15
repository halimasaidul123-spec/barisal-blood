import React, { useRef } from 'react';
import { User } from '../../types/index.js';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import { X, Award, Download, Share2, Droplet, CheckCircle2, Shield } from 'lucide-react';

interface DonorCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const DonorCertificateModal: React.FC<DonorCertificateModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrintOrSave = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-800 text-sm">
              অফিসিয়াল রক্তদাতা সম্মাননা সনদ (Certificate of Appreciation)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="p-6 sm:p-8">
          <div
            ref={certificateRef}
            className="relative border-8 border-double border-amber-600/60 p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-red-50/20 shadow-inner text-center overflow-hidden"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
              <Droplet className="w-80 h-80 text-red-600" />
            </div>

            {/* Certificate Header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
              <span className="text-xs uppercase tracking-widest font-extrabold text-red-800">
                বরিশাল বিভাগীয় রক্তদাতা প্ল্যাটফর্ম
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 tracking-tight">
              সম্মাননা ও কৃতজ্ঞতাপত্র
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Certificate of Humanitarian Lifesaver Recognition
            </p>

            <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
              মানবতার সেবায় নিঃস্বার্থভাবে মূল্যবান রক্তদান করে মানুষের জীবন বাঁচানোর অনন্য অবদানের স্বীকৃতিস্বরূপ এই সনদপত্রটি সসম্মানে প্রদান করা হলো:
            </p>

            {/* Recipient Name */}
            <div className="my-4 border-b-2 border-red-600/40 pb-2 inline-block px-8">
              <h1 className="text-2xl sm:text-3xl font-black text-red-700 tracking-wide">
                {user.name}
              </h1>
            </div>

            {/* Blood Group and Details */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-700 mb-6">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold">
                রক্তের গ্রুপ: {user.blood_group || 'O+'}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                মোট রক্তদান: {toBengaliDigits(user.total_donations || 1)} বার
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                এলাকা: {user.district || 'বরিশাল'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 max-w-lg mx-auto italic mb-8">
              &ldquo;আপনার এক ব্যাগ রক্তে বেঁচে থাকে একটি পরিবার, প্রস্ফুটিত হয় একটি নতুন আশা। মানবকল্যাণে আপনার এই অবদান বরিশালবাসীর হৃদয়ে চিরস্মরণীয় থাকবে।&rdquo;
            </p>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-2 gap-8 items-end pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-1 rounded-full border-2 border-dashed border-red-600/50 flex items-center justify-center bg-red-50 text-red-600">
                  <Shield className="w-8 h-8" />
                </div>
                <span className="text-[10px] text-slate-400 block">যাচাইকৃত সিলমোহর</span>
                <span className="text-[11px] font-bold text-slate-700">বরিশাল রক্ত ফাউন্ডেশন</span>
              </div>
              <div className="text-center">
                <div className="h-10 flex items-end justify-center mb-1">
                  <span className="font-serif italic text-lg text-slate-800 font-bold">
                    Md. Saidul Islam
                  </span>
                </div>
                <div className="w-36 h-0.5 bg-slate-300 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-700 block">পরিচালক ও সমন্বয়ক</span>
                <span className="text-[10px] text-slate-400">তারিখ: {formatDateBengali(new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handlePrintOrSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>সনদটি প্রিন্ট / ডাউনলোড করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
