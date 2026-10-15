import React, { useState } from 'react';
import { Donor, BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS, BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import { Radio, Phone, User, MapPin, CheckCircle2, Shield, Heart } from 'lucide-react';

interface LiveDonorRadarProps {
  donors?: Donor[];
  onCallDonor?: (donor: Donor) => void;
  onViewDonorProfile?: (donor: Donor) => void;
}

export const LiveDonorRadar: React.FC<LiveDonorRadarProps> = ({
  donors = [],
  onCallDonor,
  onViewDonorProfile,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const availableDonors = donors.filter(
    (d) =>
      d.is_available === 1 &&
      (selectedGroup === 'all' || d.blood_group === selectedGroup) &&
      (selectedDistrict === 'all' || d.district === selectedDistrict)
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Radar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="font-extrabold text-base text-slate-900">
              লাইভ ডোনার রাডার (Live Donor Radar)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            বরিশাল বিভাগের প্রস্তুত ও সক্রিয় রক্তদাতাদের রিয়েল-টাইম উপস্থিতি
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700"
          >
            <option value="all">সকল জেলা</option>
            {BARISHAL_DIVISION_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-red-600"
          >
            <option value="all">সকল রক্তের গ্রুপ</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg} গ্রুপ
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Radar Animation Box */}
      <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        
        {/* Radar Concentric Circles */}
        <div className="absolute w-24 h-24 rounded-full border border-red-500/30" />
        <div className="absolute w-44 h-44 rounded-full border border-red-500/20" />
        <div className="absolute w-64 h-64 rounded-full border border-red-500/10" />

        {/* Rotating Radar Sweep Line */}
        <div className="absolute w-64 h-64 rounded-full border border-transparent border-t-red-500/40 animate-spin" style={{ animationDuration: '4s' }} />

        {/* Center Node */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
            <Radio className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white mt-1.5">বরিশাল বিভাগ</span>
          <span className="text-[10px] text-emerald-400 font-mono">
            {toBengaliDigits(availableDonors.length)} জন প্রস্তুত ডোনার
          </span>
        </div>
      </div>

      {/* Active Donors List */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-slate-700">
          নিকটস্থ সক্রিয় রক্তদাতাগণ ({toBengaliDigits(availableDonors.length)} জন):
        </h4>

        {availableDonors.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
            এই ফিল্টারে বর্তমানে কোনো সক্রিয় রক্তদাতা পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableDonors.slice(0, 6).map((donor) => (
              <div
                key={donor.id}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-red-200 transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-600 text-xs font-black">
                      {donor.blood_group}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> সক্রিয়
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 truncate">{donor.name}</h5>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {donor.upazila ? `${donor.upazila}, ` : ''}{donor.district}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                  <a
                    href={`tel:${donor.phone}`}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Phone className="w-3 h-3" /> কল করুন
                  </a>
                  {onViewDonorProfile && (
                    <button
                      onClick={() => onViewDonorProfile(donor)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                    >
                      প্রোফাইল
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
