import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Donor, BloodRequest } from '../../types/index.js';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import {
  Shield,
  Users,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Check,
  Building2,
  Trash2,
  Activity,
  X,
  Cloud,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onOpenCloudflareModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onOpenCloudflareModal }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'donors' | 'requests' | 'audit'>('stats');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donorsRes, reqRes, auditRes] = await Promise.all([
        api.searchDonors({ limit: 100 }),
        api.getRequests({ limit: 100 }),
        api.getAuditLogs().catch(() => ({ success: false, data: [] })),
      ]);

      if (donorsRes.success && donorsRes.data) {
        setDonors(donorsRes.data.donors || []);
      }
      if (reqRes.success && reqRes.data) {
        setRequests(reqRes.data.requests || []);
      }
      if (auditRes.success && auditRes.data) {
        setAuditLogs((auditRes.data as any) || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyDonor = async (id: number) => {
    try {
      const res = await api.verifyDonor(id, true, 'Verified by administrator');
      if (res.success) {
        setActionMsg('ডোনার সফলভাবে ভেরিফাই করা হয়েছে');
        setDonors((prev) =>
          prev.map((d) => (d.id === id ? { ...d, is_verified: 1 } : d))
        );
      }
    } catch {
      setActionMsg('ভেরিফিকেশন সম্পন্ন হয়নি');
    }
  };

  const handleUpdateReqStatus = async (id: number, status: 'fulfilled' | 'cancelled') => {
    try {
      const res = await api.updateRequestStatus(id, status);
      if (res.success) {
        setActionMsg('অনুরোধের স্ট্যাটাস হালনাগাদ করা হয়েছে');
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch {
      setActionMsg('হালনাগাদ সম্পন্ন হয়নি');
    }
  };

  const filteredDonors = donors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.blood_group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  সুপার এডমিন ও ম্যানেজমেন্ট ড্যাশবোর্ড
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  রিয়েল-টাইম এক্সেস
                </span>
              </div>
              <p className="text-xs text-slate-400">
                বরিশাল রক্ত সেবা ও ডোনার ভেরিফিকেশন সিস্টেম
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="রিফ্রেশ"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Msg Bar */}
        {actionMsg && (
          <div className="px-6 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-between border-b border-emerald-100">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg('')} className="text-emerald-600 hover:underline">
              বন্ধ
            </button>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50/70 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            সারসংক্ষেপ (Overview)
          </button>
          <button
            onClick={() => setActiveTab('donors')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'donors'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            রক্তদাতা তালিকা ({donors.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            রক্তের আবেদনসমূহ ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            নিরাপত্তা অডিট লগ
          </button>
          {onOpenCloudflareModal && (
            <button
              onClick={() => {
                onClose();
                onOpenCloudflareModal();
              }}
              className="ml-auto px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Cloud className="w-3.5 h-3.5 text-orange-600" />
              <span>Cloudflare D1 কনসোল</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                  <span className="text-xs text-red-600 font-bold block mb-1">মোট রক্তদাতা</span>
                  <span className="text-2xl font-black text-slate-900">
                    {toBengaliDigits(donors.length)} জন
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-xs text-amber-600 font-bold block mb-1">সক্রিয় আবেদন</span>
                  <span className="text-2xl font-black text-slate-900">
                    {toBengaliDigits(requests.filter((r) => r.status === 'active' || r.status === 'pending').length)} টি
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs text-emerald-600 font-bold block mb-1">ভেরিফাইড ডোনার</span>
                  <span className="text-2xl font-black text-slate-900">
                    {toBengaliDigits(donors.filter((d) => d.is_verified === 1).length)} জন
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <span className="text-xs text-blue-600 font-bold block mb-1">সম্পন্ন রক্তদান</span>
                  <span className="text-2xl font-black text-slate-900">
                    {toBengaliDigits(requests.filter((r) => r.status === 'fulfilled').length)} টি
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-sm text-slate-800">সিস্টেম স্ট্যাটাস ও তথ্যপ্রযুক্তি বিবরণ</h4>
                <p>• ডাটাবেস: Node SQLite হাই-পারফরম্যান্স স্টোরেজ ইঞ্জিন</p>
                <p>• অ্যাপ্লিকেশন মোড: প্রোডাকশন রেডি ফুলস্ট্যাক পিডব্লিউএ (PWA Offline Enabled)</p>
                <p>• বরিশাল বিভাগের ৬ জেলা: বরিশাল, পটুয়াখালী, ভোলা, পিরোজপুর, বরগুনা, ঝালকাঠি</p>
                <p>• লিড সফটওয়্যার আর্কিটেক্ট: <strong>MD. SAIDUL ISLAM</strong></p>
              </div>
            </div>
          )}

          {activeTab === 'donors' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, ফোন বা ব্লাড গ্রুপ দিয়ে খুঁজুন..."
                  className="bg-transparent flex-1 text-xs focus:outline-none"
                />
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {filteredDonors.map((d) => (
                  <div key={d.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black text-sm flex items-center justify-center shrink-0">
                        {d.blood_group}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs text-slate-900">{d.name}</h5>
                          {d.is_verified === 1 ? (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                              ভেরিফাইড
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">
                              অযাচিত
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {d.phone} • {d.upazila ? `${d.upazila}, ` : ''}{d.district}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {d.is_verified !== 1 && (
                        <button
                          onClick={() => handleVerifyDonor(d.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                        >
                          ভেরিফাই
                        </button>
                      )}
                      <a
                        href={`tel:${d.phone}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
                      >
                        কল
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-bold text-xs">
                        {r.blood_group}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{r.patient_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase font-semibold">
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {r.hospital_name} • {r.upazila ? `${r.upazila}, ` : ''}{r.district} • {r.contact_phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(r.status === 'active' || r.status === 'pending') && (
                      <button
                        onClick={() => handleUpdateReqStatus(r.id, 'fulfilled')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        রক্ত সম্পন্ন হয়েছে
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-2 text-xs">
              {auditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400">কোনো সাম্প্রতিক অডিট লগ নেই</div>
              ) : (
                auditLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{log.action || 'অ্যাকশন'}</span>
                      <p className="text-[11px] text-slate-500">{log.details || JSON.stringify(log)}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {log.created_at ? formatDateBengali(log.created_at) : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
