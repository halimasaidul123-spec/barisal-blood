import React, { useState } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const EligibilityCalculator: React.FC = () => {
  const [age, setAge] = useState<number | ''>(25);
  const [weight, setWeight] = useState<number | ''>(62);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [daysSinceDonation, setDaysSinceDonation] = useState<number | ''>(120);
  const [hasFeverOrAntibiotic, setHasFeverOrAntibiotic] = useState(false);
  const [hasSurgeryOrTattoo, setHasSurgeryOrTattoo] = useState(false);
  const [isPregnantOrLactating, setIsPregnantOrLactating] = useState(false);

  const numAge = Number(age) || 0;
  const numWeight = Number(weight) || 0;
  const numDays = daysSinceDonation === '' ? 999 : Number(daysSinceDonation);

  const isAgeValid = numAge >= 18 && numAge <= 65;
  const isWeightValid = gender === 'female' ? numWeight >= 45 : numWeight >= 50;
  const isIntervalValid = numDays >= 90;
  const isHealthConditionValid =
    !hasFeverOrAntibiotic && !hasSurgeryOrTattoo && !isPregnantOrLactating;

  const isFullyEligible =
    isAgeValid && isWeightValid && isIntervalValid && isHealthConditionValid;

  const reasonsToWait: string[] = [];
  if (!isAgeValid) reasonsToWait.push('বয়স অবশ্যই ১৮ থেকে ৬৫ বছরের মধ্যে হতে হবে।');
  if (!isWeightValid)
    reasonsToWait.push(
      gender === 'female'
        ? 'নারীদের ক্ষেত্রে ন্যূনতম ওজন ৪৫ কেজি হতে হবে।'
        : 'পুরুষদের ক্ষেত্রে ন্যূনতম ওজন ৫০ কেজি হতে হবে।'
    );
  if (!isIntervalValid)
    reasonsToWait.push(
      `রক্তদানের ন্যূনতম বিরতি ৯০ দিন। আপনাকে আরও ${90 - numDays} দিন অপেক্ষা করতে হবে।`
    );
  if (hasFeverOrAntibiotic)
    reasonsToWait.push('জ্বর বা অ্যান্টিবায়োটিক গ্রহণের পর সুস্থ হয়ে অন্তত ১৪ দিন বিরতি প্রয়োজন।');
  if (hasSurgeryOrTattoo)
    reasonsToWait.push('ট্যাটু বা বড় অস্ত্রোপচারের পর কমপক্ষে ৬ মাস রক্তদান স্থগিত রাখা আবশ্যক।');
  if (isPregnantOrLactating)
    reasonsToWait.push('গর্ভকালীন ও দুগ্ধদানকালীন সময়ে রক্তদান নিষিদ্ধ।');

  const handleReset = () => {
    setAge(25);
    setWeight(62);
    setGender('male');
    setDaysSinceDonation(120);
    setHasFeverOrAntibiotic(false);
    setHasSurgeryOrTattoo(false);
    setIsPregnantOrLactating(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" />
            রক্তদানের শারীরিক যোগ্যতা ক্যালকুলেটর (Medical Eligibility)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও স্বাস্থ্য মন্ত্রণালয়ের নির্দেশিকা মোতাবেক যাচাই
          </p>
        </div>
        <button
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>রিসেট করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <label className="block font-bold text-slate-700 mb-1.5">লিঙ্গ (Gender)</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-2 rounded-xl font-bold transition cursor-pointer ${
                gender === 'male'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              পুরুষ
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-2 rounded-xl font-bold transition cursor-pointer ${
                gender === 'female'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              নারী
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <label className="block font-bold text-slate-700 mb-1.5">বয়স (বছর)</label>
          <input
            type="number"
            min="15"
            max="80"
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <label className="block font-bold text-slate-700 mb-1.5">ওজন (কেজি)</label>
          <input
            type="number"
            min="30"
            max="150"
            value={weight}
            onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">
            সর্বশেষ রক্তদানের পর কতদিন অতিক্রান্ত হয়েছে?
          </span>
          <input
            type="number"
            min="0"
            max="999"
            value={daysSinceDonation}
            onChange={(e) =>
              setDaysSinceDonation(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="দিন..."
            className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold bg-white text-right"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <span className="font-semibold text-slate-700">
            বিগত ১৪ দিনে জ্বর, কাশি বা অ্যান্টিবায়োটিক সেবন করেছেন?
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasFeverOrAntibiotic}
              onChange={(e) => setHasFeverOrAntibiotic(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded-sm accent-red-600"
            />
            <span className="font-bold">{hasFeverOrAntibiotic ? 'হ্যাঁ' : 'না'}</span>
          </label>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <span className="font-semibold text-slate-700">
            বিগত ৬ মাসে বড় কোনো সার্জারি বা শরীরে ট্যাটু করিয়েছেন?
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSurgeryOrTattoo}
              onChange={(e) => setHasSurgeryOrTattoo(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded-sm accent-red-600"
            />
            <span className="font-bold">{hasSurgeryOrTattoo ? 'হ্যাঁ' : 'না'}</span>
          </label>
        </div>

        {gender === 'female' && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="font-semibold text-slate-700">
              আপনি কি বর্তমানে গর্ভবতী বা সন্তানকে বুকের দুধ পান করাচ্ছেন?
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPregnantOrLactating}
                onChange={(e) => setIsPregnantOrLactating(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm accent-red-600"
              />
              <span className="font-bold">{isPregnantOrLactating ? 'হ্যাঁ' : 'না'}</span>
            </label>
          </div>
        )}
      </div>

      <div
        className={`p-5 rounded-2xl border transition-all ${
          isFullyEligible
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {isFullyEligible ? (
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertCircle className="w-7 h-7" />
            </div>
          )}
          <div>
            <h4 className="text-base sm:text-lg font-black">
              {isFullyEligible
                ? 'অভিনন্দন! আপনি রক্তদানের জন্য সম্পূর্ণ উপযুক্ত'
                : 'সাময়িক স্থগিতাদেশ: অনুগ্রহ করে অপেক্ষা করুন'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isFullyEligible
                ? 'আপনার রক্তদানের মাধ্যমে একটি মুমূর্ষু মানুষের জীবন রক্ষা হতে পারে।'
                : 'আপনার শারীরিক সুস্থতার স্বার্থে এখনই রক্তদান করা সমীচীন হবে না।'}
            </p>
          </div>
        </div>

        {!isFullyEligible && (
          <ul className="mt-4 space-y-1.5 text-xs text-amber-800 list-disc list-inside bg-white/60 p-3.5 rounded-xl border border-amber-200/80">
            {reasonsToWait.map((r, i) => (
              <li key={i} className="font-medium">
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
