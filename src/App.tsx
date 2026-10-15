import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.js';
import { ToastProvider, useToast } from './hooks/useToast.js';
import { HeaderNavbar } from './components/common/HeaderNavbar.js';
import { BottomNav } from './components/common/BottomNav.js';
import { OfflineIndicator } from './components/common/OfflineIndicator.js';
import { DeveloperModal } from './components/common/DeveloperModal.js';
import { ReportModal } from './components/common/ReportModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { DonorFilter } from './components/donor/DonorFilter.js';
import { DonorCard } from './components/donor/DonorCard.js';
import { DonorProfileModal } from './components/donor/DonorProfileModal.js';
import { EmergencyCenter } from './components/request/EmergencyCenter.js';
import { CreateRequestModal } from './components/request/CreateRequestModal.js';
import { RequestDetailModal } from './components/request/RequestDetailModal.js';
import { HospitalDirectory } from './components/hospital/HospitalDirectory.js';
import { CommunityFeed } from './components/social/CommunityFeed.js';
import { MessengerModal } from './components/social/MessengerModal.js';
import { LearnView } from './components/learn/LearnView.js';
import { FAQView } from './components/faq/FAQView.js';
import { UserProfile } from './components/profile/UserProfile.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { EmergencyShareModal } from './components/premium/EmergencyShareModal.js';
import { BloodRequisitionSlipModal } from './components/premium/BloodRequisitionSlipModal.js';
import { RoktoShohayokAI } from './components/premium/RoktoShohayokAI.js';
import { QuickEmergencySOSBar } from './components/premium/QuickEmergencySOSBar.js';
import { DonorCertificateModal } from './components/premium/DonorCertificateModal.js';
import { CloudflareDeploymentModal } from './components/cloudflare/CloudflareDeploymentModal.js';
import { api } from './services/api.js';
import { Donor, BloodRequest } from './types/index.js';
import { toBengaliDigits } from './utils/formatters.js';
import { Droplet, Search, Bot, Sparkles, X, PlusCircle } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Filters for Donor Search Tab
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [donorSearchTerm, setDonorSearchTerm] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    type: 'donor' | 'request' | 'hospital';
    id: number;
    name: string;
  } | null>(null);
  const [isRequisitionOpen, setIsRequisitionOpen] = useState(false);
  const [shareRequest, setShareRequest] = useState<BloodRequest | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);
  const [certificateDonor, setCertificateDonor] = useState<Donor | null>(null);

  // Fetch donors and requests
  const loadDonors = async () => {
    setDonorsLoading(true);
    try {
      const res = await api.searchDonors({
        blood_group: selectedBloodGroup || undefined,
        district: selectedDistrict || undefined,
        upazila: selectedUpazila || undefined,
        search: donorSearchTerm || undefined,
        only_available: onlyAvailable,
        only_verified: onlyVerified,
        limit: 100,
      });
      if (res.success && res.data) {
        setDonors(res.data.donors || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDonorsLoading(false);
    }
  };

  const loadRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await api.getRequests({ limit: 50 });
      if (res.success && res.data) {
        setRequests(res.data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    loadDonors();
  }, [
    selectedBloodGroup,
    selectedDistrict,
    selectedUpazila,
    donorSearchTerm,
    onlyAvailable,
    onlyVerified,
  ]);

  const handleLandingBloodSearch = (bg: string, district?: string, upazila?: string) => {
    setSelectedBloodGroup(bg);
    if (district) setSelectedDistrict(district);
    if (upazila) setSelectedUpazila(upazila);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCallDonor = (donor: Donor) => {
    if (!user) {
      showToast('রক্তদাতার সাথে যোগাযোগ করতে অনুগ্রহ করে লগইন করুন', 'info');
      setIsAuthOpen(true);
      return;
    }
    window.location.href = `tel:${donor.phone}`;
  };

  const handleReportDonor = (donor: Donor) => {
    setReportTarget({ type: 'donor', id: donor.id, name: donor.name });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-red-500 selection:text-white pb-20 sm:pb-0">
      {/* Offline Status Bar */}
      <OfflineIndicator />

      {/* Quick Emergency SOS Alert Banner */}
      <QuickEmergencySOSBar
        onOpenCreateRequest={() => setIsCreateRequestOpen(true)}
        onOpenRadar={() => {
          setActiveTab('requests');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Top Header Navbar */}
      <HeaderNavbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreateRequest={() => setIsCreateRequestOpen(true)}
        onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
        onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenRequisitionModal={() => setIsRequisitionOpen(true)}
        onOpenMessenger={() => setIsMessengerOpen(true)}
        onTriggerAdminPortal={() => setIsAdminDashboardOpen(true)}
      />

      {/* Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'landing' && (
          <LandingPage
            onSearchBloodGroup={handleLandingBloodSearch}
            onOpenCreateRequest={() => setIsCreateRequestOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
            recentRequests={requests.slice(0, 4)}
            featuredDonors={donors.slice(0, 6)}
            onViewRequestDetails={(req) => setSelectedRequest(req)}
            onViewCertificate={(d) => setCertificateDonor(d)}
            isLoggedIn={!!user}
          />
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Search className="w-5 h-5 text-red-600" />
                    বরিশাল রক্তদাতা ডিরেক্টরি
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    বরিশাল বিভাগের ৬টি জেলার নিবন্ধিত ও যাচাইকৃত স্বেচ্ছাসেবী রক্তদাতাগণ
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                  মোট রক্তদাতা: {toBengaliDigits(donors.length)} জন
                </div>
              </div>

              <DonorFilter
                selectedBloodGroup={selectedBloodGroup}
                onSelectBloodGroup={setSelectedBloodGroup}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                selectedUpazila={selectedUpazila}
                onSelectUpazila={setSelectedUpazila}
                searchTerm={donorSearchTerm}
                onSearchTermChange={setDonorSearchTerm}
                onlyAvailable={onlyAvailable}
                onToggleOnlyAvailable={() => setOnlyAvailable(!onlyAvailable)}
                onlyVerified={onlyVerified}
                onToggleOnlyVerified={() => setOnlyVerified(!onlyVerified)}
              />
            </div>

            {donorsLoading ? (
              <div className="py-20 text-center text-slate-400 text-sm">
                রক্তদাতা তথ্য লোড হচ্ছে...
              </div>
            ) : donors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                <Droplet className="w-12 h-12 text-red-200 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-base mb-1">
                  কোনো রক্তদাতা খুঁজে পাওয়া যায়নি
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  আপনার নির্বাচিত ফিল্টার পরিবর্তন করে পুনরায় সন্ধান করুন।
                </p>
                <button
                  onClick={() => {
                    setSelectedBloodGroup('');
                    setSelectedDistrict('');
                    setSelectedUpazila('');
                    setDonorSearchTerm('');
                    setOnlyAvailable(false);
                    setOnlyVerified(false);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {donors.map((donor) => (
                  <DonorCard
                    key={donor.id}
                    donor={donor}
                    onCallClick={handleCallDonor}
                    onReportClick={handleReportDonor}
                    onViewProfile={(d) => setSelectedDonor(d)}
                    onViewCertificate={(d) => setCertificateDonor(d)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <EmergencyCenter
            requests={requests}
            donors={donors}
            requestLoading={requestsLoading}
            onOpenCreateRequest={() => setIsCreateRequestOpen(true)}
            onRespondClick={(req) => setSelectedRequest(req)}
            onViewRequestDetails={(req) => setSelectedRequest(req)}
            onShareClick={(req) => setShareRequest(req)}
            isLoggedIn={!!user}
          />
        )}

        {activeTab === 'feed' && <CommunityFeed />}

        {activeTab === 'hospitals' && <HospitalDirectory />}

        {activeTab === 'learn' && <LearnView />}

        {activeTab === 'faq' && <FAQView />}

        {activeTab === 'portal' && (
          user ? (
            <UserProfile />
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Droplet className="w-8 h-8 fill-red-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                ব্যবহারকারী প্রোফাইল ও ড্যাশবোর্ড
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                আপনার রক্তদাতা প্রোফাইল পরিচালনা করতে, স্মার্ট ডোনার পাস পেতে ও রক্তদানের ইতিহাস সংরক্ষণ করতে লগইন বা নিবন্ধন করুন।
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                লগইন / নিবন্ধন করুন
              </button>
            </div>
          )
        )}
      </main>

      {/* Floating AI Assistant Trigger Button */}
      <button
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-5 z-40 bg-gradient-to-tr from-red-600 to-rose-600 hover:scale-105 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-all border border-red-400/40 group active:scale-95"
        title="রক্ত সহায়ক এআই"
      >
        <Bot className="w-5 h-5 text-amber-300" />
        <span className="text-xs font-black hidden sm:inline">রক্ত সহায়ক এআই</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
      </button>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Modals Container */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          loadDonors();
        }}
      />

      <CreateRequestModal
        isOpen={isCreateRequestOpen}
        onClose={() => setIsCreateRequestOpen(false)}
        onCreated={() => {
          setIsCreateRequestOpen(false);
          loadRequests();
          showToast('রক্তের আবেদন সফলভাবে প্রকাশিত হয়েছে!', 'success');
        }}
      />

      <RequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onRefresh={() => {
          loadRequests();
          setSelectedRequest(null);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <DonorProfileModal
        donor={selectedDonor}
        onClose={() => setSelectedDonor(null)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <DeveloperModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
        onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
      />

      {isCloudflareModalOpen && (
        <CloudflareDeploymentModal
          onClose={() => setIsCloudflareModalOpen(false)}
        />
      )}

      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          targetName={reportTarget.name}
        />
      )}

      <EmergencyShareModal
        request={shareRequest}
        onClose={() => setShareRequest(null)}
      />

      <BloodRequisitionSlipModal
        isOpen={isRequisitionOpen}
        onClose={() => setIsRequisitionOpen(false)}
      />

      {/* AI Assistant Modal */}
      {isAiAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">রক্ত সহায়ক এআই (Medical Blood Assistant)</h3>
                  <p className="text-[10px] text-slate-400">মেডিকেল জিজ্ঞাসা ও রক্তদানের প্রশ্ন করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiAssistantOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <RoktoShohayokAI />
            </div>
          </div>
        </div>
      )}

      {/* Messenger Modal */}
      <MessengerModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      />

      {/* Super Admin Dashboard Modal */}
      {isAdminDashboardOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminDashboardOpen(false)}
          onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
        />
      )}

      {/* Donor Certificate Modal for any donor */}
      {certificateDonor && (
        <DonorCertificateModal
          isOpen={!!certificateDonor}
          onClose={() => setCertificateDonor(null)}
          user={certificateDonor as any}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
