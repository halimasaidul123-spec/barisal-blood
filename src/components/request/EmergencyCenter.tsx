import React, { useState } from 'react';
import { BloodRequest, Donor, BloodGroup } from '../../types/index.js';
import { BloodRequestCard } from './BloodRequestCard.js';
import { LiveDonorRadar } from '../premium/LiveDonorRadar.js';
import { SmartProximityEstimator } from '../premium/SmartProximityEstimator.js';
import { EmergencyPosterGenerator } from '../premium/EmergencyPosterGenerator.js';
import { EmergencySmsGenerator } from '../premium/EmergencySmsGenerator.js';
import { EmergencySpeedDialBoard } from '../premium/EmergencySpeedDialBoard.js';
import { AmbulanceOxygenDirectory } from '../premium/AmbulanceOxygenDirectory.js';
import { RiverWaterAmbulanceGuide } from '../premium/RiverWaterAmbulanceGuide.js';
import { LiveSOSAudioBroadcaster } from '../premium/LiveSOSAudioBroadcaster.js';
import { ThalassemiaBuddyNetwork } from '../premium/ThalassemiaBuddyNetwork.js';
import { PlateletApheresisMatcher } from '../premium/PlateletApheresisMatcher.js';
import { SeasonalCrisisMonitor } from '../premium/SeasonalCrisisMonitor.js';
import { BarishalTransitRouteEngine } from '../premium/BarishalTransitRouteEngine.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  HeartHandshake,
  Radio,
  Image,
  MessageSquare,
  PhoneCall,
  Truck,
  Ship,
  Flame,
  PlusCircle,
  AlertTriangle,
  Compass,
  Users,
  Activity,
  Heart,
  Droplet,
} from 'lucide-react';

interface EmergencyCenterProps {
  requests: BloodRequest[];
  donors?: Donor[];
  requestLoading: boolean;
  onOpenCreateRequest: () => void;
  onRespondClick: (r: BloodRequest) => void;
  onViewRequestDetails: (r: BloodRequest) => void;
  onShareClick: (r: BloodRequest) => void;
  onCallDonor?: (d: Donor) => void;
  onViewDonorProfile?: (d: Donor) => void;
  onFindBloodForRequest?: (bloodGroup: string) => void;
  isLoggedIn: boolean;
}

export const EmergencyCenter: React.FC<EmergencyCenterProps> = ({
  requests,
  donors = [],
  requestLoading,
  onOpenCreateRequest,
  onRespondClick,
  onViewRequestDetails,
  onShareClick,
  onCallDonor,
  onViewDonorProfile,
  onFindBloodForRequest,
  isLoggedIn,
}) => {
  const [activeEmergencyTab, setActiveEmergencyTab] = useState<
    | 'requests'
    | 'radar'
    | 'proximity'
    | 'poster'
    | 'sms'
    | 'speedDial'
    | 'ambulance'
    | 'waterAmbulance'
    | 'transitRoute'
    | 'sosAudio'
    | 'thalassemia'
    | 'platelet'
    | 'dengue'
  >('requests');

  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'urgent'>('all');

  const filteredRequests = requests.filter((r) => {
    if (urgencyFilter === 'critical') return r.emergency_level === 'critical';
    if (urgencyFilter === 'urgent') return r.emergency_level === 'urgent' || r.emergency_level === 'critical';
    return true;
  });

  const criticalCount = requests.filter((r) => r.emergency_level === 'critical').length;

  const handleCallDonorFallback = (donor: Donor) => {
    if (onCallDonor) {
      onCallDonor(donor);
    } else if (donor.phone) {
      window.location.href = `tel:${donor.phone}`;
    }
  };

  const handleViewProfileFallback = (donor: Donor) => {
    if (onViewDonorProfile) {
      onViewDonorProfile(donor);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Emergency Hub Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-red-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>জরুরি নিয়ন্ত্রণ কেন্দ্র (Ultimate Emergency Center)</span>
            </span>
            {criticalCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                {toBengaliDigits(criticalCount)} টি জীবনসংকটাপন্ন (Critical) আবেদন
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            জরুরি রক্তের প্রয়োজনে তৎক্ষণাৎ পদক্ষেপ নিন
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            বরিশাল বিভাগের ৬টি জেলার নিকটবর্তী ভেরিফাইড রক্তদাতাদের সাথে সংযোগ, অ্যাম্বুলেন্স, ও লাইভ ব্লাড ব্যাংকের সমন্বিত ইমার্জেন্সি হাব।
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateRequest}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ জরুরি রক্তের আবেদন</span>
            </button>
            <button
              onClick={() => setActiveEmergencyTab('poster')}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
            >
              <Image className="w-4 h-4 text-rose-300" />
              <span>সোশ্যাল পোস্টার</span>
            </button>
            <button
              onClick={() => setActiveEmergencyTab('speedDial')}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>হটলাইন স্পিড ডায়াল</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Center Tool Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveEmergencyTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'requests'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>আবেদনের তালিকা ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('radar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'radar'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>লাইভ ডোনার রাডার</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('proximity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'proximity'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>নিকটবর্তী ডোনার এস্টিমেটর</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('poster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'poster'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>জরুরি পোস্টার জেনারেটর</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('sms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'sms'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>জরুরি SMS ফরম্যাট</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('speedDial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'speedDial'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>জরুরি হটলাইন</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('ambulance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'ambulance'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>অ্যাম্বুলেন্স ও অক্সিজেন</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('waterAmbulance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'waterAmbulance'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>নৌ-অ্যাম্বুলেন্স</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('transitRoute')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'transitRoute'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>রুট এস্টিমেটর</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('sosAudio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'sosAudio'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>লাইভ সাইরেন ও অ্যালার্ট</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('thalassemia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'thalassemia'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>থ্যালাসেমিয়া বাডি</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('platelet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'platelet'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>প্লাটিলেট (SDP) ম্যাচ</span>
        </button>

        <button
          onClick={() => setActiveEmergencyTab('dengue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeEmergencyTab === 'dengue'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>মৌসুমী সংকট ও ডেঙ্গু</span>
        </button>
      </div>

      {/* Main Tab View */}
      {activeEmergencyTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">ফিল্টার:</span>
              <button
                onClick={() => setUrgencyFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  urgencyFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                সকল আবেদন ({requests.length})
              </button>
              <button
                onClick={() => setUrgencyFilter('critical')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  urgencyFilter === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                জীবনসংকটাপন্ন (Critical)
              </button>
            </div>
            <button
              onClick={onOpenCreateRequest}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs self-start sm:self-auto cursor-pointer"
            >
              + নতুন আবেদন
            </button>
          </div>

          {requestLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              রক্তের আবেদন লোড হচ্ছে...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200">
              <Droplet className="w-12 h-12 text-red-200 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-base mb-1">
                বর্তমানে কোনো রক্ত আবেদন পাওয়া যায়নি
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                জরুরি রক্তের প্রয়োজন হলে আপনি নিজে আবেদন প্রকাশ করতে পারেন।
              </p>
              <button
                onClick={onOpenCreateRequest}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + রক্ত আবেদন করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((r) => (
                <BloodRequestCard
                  key={r.id}
                  request={r}
                  onRespondClick={(req) => onRespondClick(req)}
                  onViewDetails={(req) => onViewRequestDetails(req)}
                  onShareClick={(req) => onShareClick(req)}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeEmergencyTab === 'radar' && (
        <LiveDonorRadar
          donors={donors}
          onCallDonor={handleCallDonorFallback}
          onViewDonorProfile={handleViewProfileFallback}
        />
      )}

      {activeEmergencyTab === 'proximity' && (
        <SmartProximityEstimator
          donors={donors}
          onCallDonor={handleCallDonorFallback}
          onViewProfile={handleViewProfileFallback}
          onOpenCreateRequest={onOpenCreateRequest}
        />
      )}

      {activeEmergencyTab === 'poster' && (
        <EmergencyPosterGenerator
          initialRequest={requests.length > 0 ? requests[0] : null}
          onOpenCreateRequest={onOpenCreateRequest}
        />
      )}

      {activeEmergencyTab === 'sms' && <EmergencySmsGenerator />}

      {activeEmergencyTab === 'speedDial' && <EmergencySpeedDialBoard />}

      {activeEmergencyTab === 'ambulance' && <AmbulanceOxygenDirectory />}

      {activeEmergencyTab === 'waterAmbulance' && <RiverWaterAmbulanceGuide />}

      {activeEmergencyTab === 'transitRoute' && <BarishalTransitRouteEngine />}

      {activeEmergencyTab === 'sosAudio' && <LiveSOSAudioBroadcaster />}

      {activeEmergencyTab === 'thalassemia' && <ThalassemiaBuddyNetwork />}

      {activeEmergencyTab === 'platelet' && <PlateletApheresisMatcher />}

      {activeEmergencyTab === 'dengue' && <SeasonalCrisisMonitor />}
    </div>
  );
};
