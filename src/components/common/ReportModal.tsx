import React, { useState } from 'react';
import { api } from '../../services/api.js';
import { X, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'donor' | 'request' | 'hospital';
  targetId: number;
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
}) => {
  const [reason, setReason] = useState('ভুয়া তথ্য প্রদান বা মিথ্যা রক্তদাতা');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'অন্যান্য' ? customReason : reason;
    if (!finalReason.trim()) {
      setError('কারণ উল্লেখ করুন');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.submitReport(targetType, targetId, finalReason);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      } else {
        setError(res.message || 'অভিযোগ পাঠাতে ব্যর্থ');
      }
    } catch {
      setError('সার্ভার ত্রুটি');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold text-base text-slate-900">অভিযোগ দায়ের করুন</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          আপনি <strong>"{targetName}"</strong>-এর বিরুদ্ধে রিপোর্ট করছেন:
        </p>

        {success ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold text-center">
            অভিযোগ সফলভাবে জমা দেওয়া হয়েছে। এডমিন টিম যাচাই করবে।
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {error && (
              <div className="p-2 bg-red-50 text-red-700 rounded-lg">{error}</div>
            )}
            <div>
              <label className="block font-bold text-slate-700 mb-1">কারণ নির্বাচন করুন</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="ভুয়া তথ্য প্রদান বা মিথ্যা রক্তদাতা">ভুয়া তথ্য প্রদান বা মিথ্যা রক্তদাতা</option>
                <option value="রক্তদানের বিনিময়ে অর্থ বা অনৈতিক দাবি">রক্তদানের বিনিময়ে অর্থ বা অনৈতিক দাবি</option>
                <option value="ভুল বা বন্ধ মোবাইল নম্বর">ভুল বা বন্ধ মোবাইল নম্বর</option>
                <option value="অশালীন বা অসৌজন্যমূলক আচরণ">অশালীন বা অসৌজন্যমূলক আচরণ</option>
                <option value="স্প্যাম বা ভুয়া রক্তের আবেদন">স্প্যাম বা ভুয়া রক্তের আবেদন</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            {reason === 'অন্যান্য' && (
              <div>
                <textarea
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="বিস্তারিত কারণ লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'পাঠানো হচ্ছে...' : 'জমা দিন'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
