import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Cloud,
  Database,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Play,
  RefreshCw,
  HardDrive,
  Globe,
  ShieldCheck,
  Server,
  Zap,
  X,
  FileCode,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface CloudflareDeploymentModalProps {
  onClose: () => void;
}

export const CloudflareDeploymentModal: React.FC<CloudflareDeploymentModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'deploy' | 'd1' | 'sql' | 'files'>('deploy');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [d1Status, setD1Status] = useState<any>(null);
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  // SQL Console State
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT name, blood_group, district, upazila, is_available FROM donors LIMIT 10;');
  const [sqlLoading, setSqlLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const [statusRes, instRes] = await Promise.all([
        api.getD1Status().catch(() => ({ success: false, data: null })),
        api.getD1Instances().catch(() => ({ success: false, data: [] })),
      ]);

      if (statusRes.success && statusRes.data) {
        setD1Status(statusRes.data);
      }
      if (instRes.success && instRes.data) {
        setInstances(instRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return;
    setSqlLoading(true);
    setQueryError(null);
    try {
      const res = await api.executeD1Query(sqlQuery);
      if (res.success && res.data) {
        setQueryResult(res.data);
      } else {
        setQueryError(res.error || res.message || 'কুয়েরি সম্পন্ন হয়নি');
      }
    } catch (e: any) {
      setQueryError(e.message || 'SQL এক্সিকিউশন ব্যর্থ');
    } finally {
      setSqlLoading(false);
    }
  };

  const handleTestPing = async (instanceId: string) => {
    setPingResult('পিং পাঠানো হচ্ছে...');
    try {
      const res = await api.testD1Instance(instanceId);
      if (res.success && res.data) {
        setPingResult(`ল্যাটেন্সি: ${res.data.latencyMs}ms | প্রোটোকল: ${res.data.protocolVersion}`);
        fetchStatus();
      } else {
        setPingResult('পিং সংযোগ ব্যর্থ');
      }
    } catch {
      setPingResult('পিং সম্পন্ন হয়নি');
    }
  };

  const deploymentSteps = [
    {
      step: 1,
      title: 'Cloudflare CLI অথোরাইজেশন',
      cmd: 'npx wrangler login',
      desc: 'আপনার Cloudflare অ্যাকাউন্ট টার্মিনালের সাথে কানেক্ট করুন',
    },
    {
      step: 2,
      title: 'D1 সার্ভারলেস ডেটাবেস তৈরি',
      cmd: 'npm run d1:create',
      desc: 'barishal-rokto-d1 নামে ক্লাউডফ্লেয়ার এজ ডেটাবেস ইনস্ট্যান্স প্রস্তুত করে',
    },
    {
      step: 3,
      title: 'D1 স্কিমা টেবিল মাইগ্রেশন চালান',
      cmd: 'npm run d1:migrate:remote',
      desc: '২৩টি প্রয়োজনীয় টেবিল, ফরেন কি এবং ইনডেক্স D1 ডেটাবেসে পুশ করে',
    },
    {
      step: 4,
      title: 'প্রাথমিক হাসপাতাল ও ডোনার ডেটা সিড',
      cmd: 'npm run d1:seed:remote',
      desc: 'বরিশালের হাসপাতাল তালিকা ও ডেমো ডেটাবেস ইনিশিয়ালাইজ করে',
    },
    {
      step: 5,
      title: 'Cloudflare R2 মিডিয়া বাকেট তৈরি (ঐচ্ছিক)',
      cmd: 'npx wrangler r2 bucket create barishal-rokto-media',
      desc: 'ছবি ও ডিজিটাল ডোনার সার্টিফিকেটের জন্য অবজেক্ট স্টোরেজ বাকেট তৈরি করে',
    },
    {
      step: 6,
      title: 'Cloudflare Pages এ লাইভ ডিপ্লয়',
      cmd: 'npm run deploy:cf',
      desc: 'অ্যাসেট বিল্ড করে গ্লোবাল এজ নেটওয়ার্কে তাৎক্ষণিক লাইভ করে',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-orange-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/20 text-white">
              <Cloud className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Cloudflare D1 & Pages ডিপ্লয়মেন্ট সেন্টার
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full">
                  Edge Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cloudflare D1 Serverless SQL Storage & Workers Pages Functions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-4 gap-2 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'deploy'
                ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            ডিপ্লয়মেন্ট নির্দেশিকা (CLI)
          </button>
          <button
            onClick={() => setActiveTab('d1')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'd1'
                ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            D1 ডেটাবেস স্ট্যাটাস
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'sql'
                ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            D1 লাইভ SQL কনসোল
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'files'
                ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            কনফিগ ও স্কিমা ফাইলস
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto space-y-5">
          
          {/* TAB 1: DEPLOYMENT STEPS */}
          {activeTab === 'deploy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                  <p className="font-semibold text-white">
                    Cloudflare D1 সার্ভারলেস এসকিউএল আর্কিটেকচার
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    এই প্রজেক্টে <code className="text-orange-300 font-mono">wrangler.jsonc</code>, <code className="text-orange-300 font-mono">migrations/</code>, এবং <code className="text-orange-300 font-mono">functions/api/</code> সম্পূর্ণ প্রস্তুত রয়েছে। নিচের কমান্ডগুলো আপনার টার্মিনালে রান করলেই কোনো কনফিগারেশন জটিলতা ছাড়াই ক্লাউডফ্লেয়ারে ডিপ্লয় হয়ে যাবে।
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {deploymentSteps.map((s) => (
                  <div
                    key={s.step}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold flex items-center justify-center">
                          {toBengaliDigits(s.step)}
                        </span>
                        <h4 className="font-semibold text-sm sm:text-base text-white">
                          {s.title}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400">{s.desc}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-emerald-400 overflow-x-auto py-1">
                        <span className="text-slate-500">$</span>
                        <span className="select-all">{s.cmd}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(s.cmd, `step-${s.step}`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        {copiedCmd === `step-${s.step}` ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* GitHub Pages Option */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-xs sm:text-sm space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  Cloudflare Pages Dashboard থেকে অটো-ডিপ্লয় (GitHub)
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Cloudflare Dashboard &gt; <strong>Workers &amp; Pages</strong> &gt; <strong>Create application</strong> &gt; <strong>Connect to Git</strong> সিলেক্ট করে ফ্রেমওয়ার্ক হিসেবে <span className="text-white font-mono">Vite</span>, বিল্ড কমান্ড <span className="text-white font-mono">npm run build</span>, এবং ডিরেক্টরি <span className="text-white font-mono">dist</span> সিলেক্ট করুন। সেটিংস থেকে D1 Database binding <span className="text-orange-400 font-mono">DB</span> সিলেক্ট করে দিলেই স্বয়ংক্রিয়ভাবে ডিপ্লয় হয়ে যাবে।
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: D1 STATUS & INSTANCES */}
          {activeTab === 'd1' && (
            <div className="space-y-5">
              {/* Quick Status Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-orange-400" />
                    স্টোরেজ ইঞ্জিন
                  </div>
                  <div className="text-sm font-bold text-white">Cloudflare D1</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Serverless Edge SQL
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    এজ রিজিয়ন
                  </div>
                  <div className="text-sm font-bold text-white">APAC (SIN/DAC)</div>
                  <div className="text-[11px] text-slate-400">Low-latency Edge</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    মোট স্কিমা টেবিল
                  </div>
                  <div className="text-lg font-bold text-white">
                    {toBengaliDigits(d1Status?.total_tables || 23)}টি
                  </div>
                  <div className="text-[11px] text-slate-400">ইনডেক্স সহ</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    বাইন্ডিং ভেরিয়েবল
                  </div>
                  <div className="text-sm font-bold font-mono text-orange-400">env.DB</div>
                  <div className="text-[11px] text-slate-400">Pages &amp; Workers</div>
                </div>
              </div>

              {/* Instances List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-orange-400" />
                    কানেক্টেড Cloudflare D1 ইনস্ট্যান্স তালিকা
                  </h4>
                  <button
                    onClick={fetchStatus}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    রিফ্রেশ
                  </button>
                </div>

                <div className="space-y-2.5">
                  {instances.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-center text-slate-400 text-sm">
                      ইনস্ট্যান্স লোড হচ্ছে...
                    </div>
                  ) : (
                    instances.map((inst) => (
                      <div
                        key={inst.id}
                        className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">
                              {inst.name}
                            </span>
                            {inst.is_primary === 1 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                PRIMARY D1
                              </span>
                            )}
                            <span className="text-xs font-mono text-slate-400">
                              ID: {inst.database_id}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span>লোকেশন: {inst.region}</span>
                            <span>বাইন্ডিং: <code className="text-orange-400 font-mono">{inst.binding_name}</code></span>
                            <span>ল্যাটেন্সি: ~{inst.read_latency_ms}ms</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleTestPing(inst.id)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            পিং টেস্ট
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {pingResult && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono">
                    {pingResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE D1 SQL CONSOLE */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="font-medium text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-orange-400" />
                    D1 এসকিউএল কুয়েরি লিখুন (Cloudflare D1 Driver)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSqlQuery('SELECT name, blood_group, district, upazila, is_available FROM donors LIMIT 5;')}
                      className="hover:text-white underline text-[11px]"
                    >
                      ডোনার তালিকা
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setSqlQuery('SELECT name, district, phone FROM hospitals LIMIT 5;')}
                      className="hover:text-white underline text-[11px]"
                    >
                      হাসপাতাল
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setSqlQuery('SELECT patient_name, blood_group, hospital_name, emergency_level FROM blood_requests LIMIT 5;')}
                      className="hover:text-white underline text-[11px]"
                    >
                      জরুরি অনুরোধ
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-emerald-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="SELECT * FROM table_name;"
                  />
                  <button
                    onClick={handleRunQuery}
                    disabled={sqlLoading}
                    className="absolute bottom-3 right-3 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all"
                  >
                    {sqlLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        রান হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Execute D1 Query
                      </>
                    )}
                  </button>
                </div>
              </div>

              {queryError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 font-mono">
                  ত্রুটি: {queryError}
                </div>
              )}

              {queryResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      রেজাল্ট: {toBengaliDigits(queryResult.rows?.length || 0)} সারি
                    </span>
                    <span className="text-emerald-400">
                      ল্যাটেন্সি: {queryResult.executionTimeMs}ms
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 max-h-60">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-300 sticky top-0">
                        <tr>
                          {queryResult.columns?.map((col: string) => (
                            <th key={col} className="p-2.5 font-semibold">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-slate-300">
                        {queryResult.rows?.map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-900/60">
                            {queryResult.columns?.map((col: string) => (
                              <td key={col} className="p-2.5 whitespace-nowrap">
                                {String(row[col] ?? 'NULL')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONFIGURATION & SCHEMAS */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <FileCode className="w-4 h-4 text-orange-400" />
                    wrangler.jsonc
                  </div>
                  <p className="text-slate-400 text-xs">
                    Cloudflare Pages Functions এবং D1 ডেটাবেস বাইন্ডিং ডিক্লারেশন।
                  </p>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    <code>binding: &quot;DB&quot;, database_name: &quot;barishal-rokto-d1&quot;</code>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Database className="w-4 h-4 text-emerald-400" />
                    migrations/0001_d1_schema.sql
                  </div>
                  <p className="text-slate-400 text-xs">
                    ২৩টি কোর টেবিল, ইনডেক্স ও কনস্ট্রেইন্ট সহ সম্পূর্ণ D1 স্কিমা।
                  </p>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    <code>users, donors, blood_requests, hospitals...</code>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Server className="w-4 h-4 text-sky-400" />
                    functions/api/[[route]].ts
                  </div>
                  <p className="text-slate-400 text-xs">
                    Cloudflare Pages এজ হ্যান্ডলার যা রিকোয়েস্ট সরাসরি D1-এ কুয়েরি করে।
                  </p>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    <code>context.env.DB.prepare(...).all()</code>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Globe className="w-4 h-4 text-purple-400" />
                    public/_routes.json &amp; _headers
                  </div>
                  <p className="text-slate-400 text-xs">
                    এজ ক্যাশিং, সিকিউরিটি হেডার এবং রাউটিং কনফিগারেশন।
                  </p>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    <code>include: [&quot;/api/*&quot;], exclude: [&quot;/assets/*&quot;]</code>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 font-mono">
                    CLOUDFLARE_DEPLOYMENT_GUIDE.md
                  </span>
                  <span className="text-[11px] text-emerald-400">প্রজেক্ট রুটে সংরক্ষিত</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  সম্পূর্ণ বিস্তারিত ডিপ্লয়মেন্ট নির্দেশিকা প্রজেক্টের রুটে <code className="text-orange-400 font-mono">CLOUDFLARE_DEPLOYMENT_GUIDE.md</code> ফাইলে রয়েছে। সেখানে কোনো কমান্ড বা ইরর ট্রাবলশুটের দরকার হলে দেখতে পারেন।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloudflare D1 &amp; Pages Deployment Ready</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
