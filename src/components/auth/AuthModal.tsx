import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { api } from '../../services/api.js';
import {
  BARISHAL_DIVISION_DISTRICTS,
  BLOOD_GROUPS,
  getUpazilasForDistrict,
} from '../../utils/locations.js';
import { BloodGroup } from '../../types/index.js';
import { X, Lock, Phone, User, CheckCircle2, Shield, Heart } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  // Login form
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regPhone, setRegPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devDemoOtp, setDevDemoOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState<BloodGroup>('O+');
  const [regGender, setRegGender] = useState<'male' | 'female'>('male');
  const [regAge, setRegAge] = useState<number | ''>(24);
  const [regDistrict, setRegDistrict] = useState('বরিশাল');
  const [regUpazila, setRegUpazila] = useState('বরিশাল সদর');
  const [regArea, setRegArea] = useState('');
  const [regLastDonation, setRegLastDonation] = useState('');
  const [regIsAvailable, setRegIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const upazilas = getUpazilasForDistrict(regDistrict);

  const handleQuickDemoLogin = async (phone: string, pass: string) => {
    setLoading(true);
    setError('');
    const res = await login(phone, pass);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'লগইন ব্যর্থ হয়েছে');
    }
    setLoading(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginPhone || !loginPassword) {
      setError('মোবাইল নম্বর ও পাসওয়ার্ড পূরণ করুন');
      return;
    }

    setLoading(true);
    const res = await login(loginPhone, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'ভুল মোবাইল নম্বর বা পাসওয়ার্ড!');
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    setError('');
    if (!regPhone || !/^01[3-9]\d{8}$/.test(regPhone.trim())) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)');
      return;
    }
    setLoading(true);
    try {
      const res = await api.sendOtp(regPhone.trim(), 'register');
      if (res.success) {
        setOtpSent(true);
        if (res.data?.devDemoOtp) {
          setDevDemoOtp(res.data.devDemoOtp);
          setOtp(res.data.devDemoOtp);
        }
        setSuccessMsg(res.message || 'ওটিপি পাঠানো হয়েছে!');
      } else {
        setError(res.message || 'ওটিপি পাঠানো ব্যর্থ');
      }
    } catch {
      setError('সার্ভার ত্রুটি');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp) {
      setError('ওটিপি কোড প্রদান করুন');
      return;
    }
    setLoading(true);
    try {
      const res = await api.verifyOtp(regPhone.trim(), otp.trim());
      if (res.success) {
        setOtpVerified(true);
        setRegStep(2);
        setSuccessMsg('ওটিপি যাচাই সফল হয়েছে!');
      } else {
        setError(res.message || 'ভুল ওটিপি কোড');
      }
    } catch {
      setError('সার্ভার ত্রুটি');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName.trim() || !regPassword.trim()) {
      setError('সকল তথ্য সঠিকভাবে পূরণ করুন');
      return;
    }

    setLoading(true);
    const res = await register({
      name: regName.trim(),
      phone: regPhone.trim(),
      password: regPassword.trim(),
      role: 'donor',
      blood_group: regBloodGroup,
      gender: regGender,
      age: regAge || null,
      district: regDistrict,
      upazila: regUpazila,
      area: regArea.trim(),
      last_donation_date: regLastDonation || null,
      is_available: regIsAvailable ? 1 : 0,
      otp: otp.trim(),
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'রেজিস্ট্রেশন ব্যর্থ');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-6 relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {tab === 'login' ? 'অ্যাকাউন্টে লগইন' : 'নতুন রক্তদাতা নিবন্ধন'}
            </h2>
            <p className="text-xs text-red-100">বরিশাল রক্ত মানবিক নেটওয়ার্ক</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`py-3 text-center transition cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-red-600 border-b-2 border-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`py-3 text-center transition cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-red-600 border-b-2 border-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            নিবন্ধন
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 mb-4">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 mb-4">
              {successMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white py-3 rounded-xl font-bold shadow-md shadow-red-600/20 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {loading ? 'যাচাই হচ্ছে...' : 'লগইন করুন'}
              </button>

              {/* Demo Logins */}
              <div className="pt-4 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  পরীক্ষামূলক দ্রুত লগইন
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('01700000000', 'admin1234')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-red-600" />
                    <span>এডমিন লগইন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('01711000101', 'donor1234')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    <span>রক্তদাতা (তানভীর)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div>
              {regStep === 1 ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর লিখুন
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="01712345678"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                          disabled={otpSent}
                        />
                      </div>
                      {!otpSent && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={loading}
                          className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
                        >
                          {loading ? '...' : 'OTP পাঠান'}
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          ফোনে প্রেরিত ওটিপি (৬ ডিজিট)
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="XXXXXX"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-center font-bold text-lg tracking-widest bg-white"
                        />
                        {devDemoOtp && (
                          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                            (টেস্টিং ওটিপি কোড: {devDemoOtp})
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                      >
                        {loading ? 'যাচাই হচ্ছে...' : 'ওটিপি নিশ্চিত করুন'}
                      </button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          আবার ওটিপি পাঠান
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম *</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="আপনার নাম"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                      <select
                        value={regBloodGroup}
                        onChange={(e) => setRegBloodGroup(e.target.value as BloodGroup)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-red-600 bg-white"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">বয়স</label>
                      <input
                        type="number"
                        min="18"
                        max="65"
                        value={regAge}
                        onChange={(e) => setRegAge(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">জেলা *</label>
                      <select
                        value={regDistrict}
                        onChange={(e) => {
                          setRegDistrict(e.target.value);
                          setRegUpazila(getUpazilasForDistrict(e.target.value)[0] || 'বরিশাল সদর');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                          <option key={d.name} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">উপজেলা *</label>
                      <select
                        value={regUpazila}
                        onChange={(e) => setRegUpazila(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        {upazilas.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">এলাকা / মহল্লা</label>
                    <input
                      type="text"
                      value={regArea}
                      onChange={(e) => setRegArea(e.target.value)}
                      placeholder="যেমন: রূপাতলী, নতুন বাজার"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                    <input
                      type="date"
                      value={regLastDonation}
                      onChange={(e) => setRegLastDonation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড নির্ধারণ করুন *</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-md shadow-red-600/20 transition disabled:opacity-50 text-sm cursor-pointer"
                    >
                      {loading ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
