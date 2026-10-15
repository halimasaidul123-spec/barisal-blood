import { SocialPost, ShortStory, ChatConversation, ChatMessage, DonorReputationProfile, BloodGroup } from '../types/index.js';

const INITIAL_STORIES: ShortStory[] = [
  {
    id: 'story-1',
    user_id: 101,
    user_name: 'তানভীর আহমেদ',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    user_badge: 'গোল্ডেন লাইফসেভার',
    blood_group: 'O+',
    story_type: 'donation',
    media_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    caption: 'শের-ই-বাংলা মেডিকেলে ৮তম রক্তদান সম্পন্ন করলাম। আলহামদুলিল্লাহ!',
    location: 'বরিশাল সদর',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    has_unseen: true,
  },
  {
    id: 'story-2',
    user_id: 102,
    user_name: 'নুসরাত জাহান',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    user_badge: 'জরুরি রেসপন্ডার',
    blood_group: 'B+',
    story_type: 'emergency',
    media_url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80',
    caption: 'পটুয়াখালী হাসপাতালে জরুরি সিজারের রোগীর পাশে দাঁড়িয়েছি।',
    location: 'পটুয়াখালী',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    has_unseen: true,
  },
  {
    id: 'story-3',
    user_id: 103,
    user_name: 'ফারজানা আক্তার',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    user_badge: 'নিয়মিত রক্তদাতা',
    blood_group: 'A+',
    story_type: 'awareness',
    media_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
    caption: 'রক্তদানে কোনো ক্ষতি নেই, বরং শরীর সতেজ থাকে। এগিয়ে আসুন সবাই!',
    location: 'পিরোজপুর সদর',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    has_unseen: false,
  },
  {
    id: 'story-4',
    user_id: 201,
    user_name: 'শের-ই-বাংলা ব্লাড ব্যাংক',
    user_avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80',
    user_badge: 'ভেরিফাইড হাসপাতাল',
    blood_group: 'AB+',
    story_type: 'camp',
    media_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    caption: 'আজকের রক্তদান ক্যাম্পেইন সফলভাবে অনুষ্ঠিত হচ্ছে।',
    location: 'SBMCH বরিশাল',
    created_at: new Date(Date.now() - 11 * 3600000).toISOString(),
    has_unseen: false,
  },
];

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-101',
    author_id: 110,
    author_name: 'আব্দুর রহিম (রোগীর স্বজন)',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    author_blood_group: 'B+',
    author_district: 'বরিশাল',
    author_upazila: 'বরিশাল সদর',
    is_verified_donor: false,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    post_type: 'emergency',
    category: 'emergency',
    title: 'জরুরি রক্তের আবেদন (B+)',
    content: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতালে সার্জারি রোগীর জন্য ২ ব্যাগ B+ রক্ত জরুরি প্রয়োজন। যোগাযোগের অনুরোধ করা হচ্ছে।',
    emergency_meta: {
      blood_group: 'B+',
      hospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH), বরিশাল',
      units: 2,
      urgency: 'critical',
      contact_protected: true,
      request_id: 1,
    },
    reactions: {
      support: 28,
      lifesaver: 42,
      respect: 15,
      hero: 12,
      congratulations: 2,
    },
    comments_count: 9,
    shares_count: 34,
    privacy: 'everyone',
    priority: 1,
    comments: [
      {
        id: 'c-1',
        author_name: 'তানভীর আহমেদ',
        author_badge: 'রক্তদাতা O+',
        author_blood_group: 'O+',
        content: 'রোগীর অবস্থা কেমন? আমি আসছি মেডিকেলে।',
        created_at: new Date(Date.now() - 15 * 60000).toISOString(),
        likes: 8,
      },
      {
        id: 'c-2',
        author_name: 'মেহেদী হাসান',
        author_badge: 'স্বেচ্ছাসেবক',
        content: 'আমরা সন্ধানীর পক্ষ থেকে ডোনার ম্যানেজ করার চেষ্টা করছি।',
        created_at: new Date(Date.now() - 10 * 60000).toISOString(),
        likes: 5,
      },
    ],
  },
  {
    id: 'post-102',
    author_id: 501,
    author_name: 'বরিশাল মেডিকেল ব্লাড ব্যাংক',
    author_role: 'প্রতিষ্ঠান',
    author_avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80',
    author_district: 'বরিশাল',
    author_upazila: 'বরিশাল সদর',
    is_verified_institution: true,
    created_at: new Date(Date.now() - 90 * 60000).toISOString(),
    post_type: 'announcement',
    category: 'hospital',
    title: 'ব্লাড ব্যাংক স্টক আপডেট (O- ও A- ঘাটতি)',
    content: 'হাসপাতালে জরুরি রক্তের মজুদে O- এবং A- রক্তের ঘাটতি দেখা দিয়েছে। নিকটবর্তী রক্তদাতাদের স্বেচ্ছায় রক্তদানের আহ্বান জানানো হচ্ছে।',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'],
    reactions: {
      support: 84,
      lifesaver: 95,
      respect: 67,
      hero: 41,
      congratulations: 19,
    },
    comments_count: 14,
    shares_count: 58,
    privacy: 'everyone',
    priority: 3,
  },
  {
    id: 'post-103',
    author_id: 101,
    author_name: 'তানভীর আহমেদ',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_blood_group: 'O+',
    author_district: 'বরিশাল',
    author_upazila: 'বরিশাল সদর',
    is_verified_donor: true,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    post_type: 'donation_story',
    category: 'donation',
    title: 'আমার ১২তম রক্তদান অভিজ্ঞতা',
    content: 'আজ শের-ই-বাংলা মেডিকেলে এক থ্যালাসেমিয়া শিশুকে O+ রক্ত দিতে পেরে নিজেকে ধন্য মনে করছি। মানুষের জীবন বাঁচাতে রক্তদান করুন।',
    donation_meta: {
      donation_number: 12,
      hospital: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল',
      blood_group: 'O+',
      is_verified: true,
      patient_case: 'থ্যালাসেমিয়া নিয়মিত সঞ্চালন',
    },
    images: [
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    ],
    reactions: {
      support: 124,
      lifesaver: 215,
      respect: 143,
      hero: 98,
      congratulations: 87,
    },
    comments_count: 26,
    shares_count: 41,
    privacy: 'everyone',
    priority: 4,
    comments: [
      {
        id: 'c-3',
        author_name: 'সাইফুল ইসলাম',
        author_badge: 'রক্তযোদ্ধা',
        content: 'মাশাআল্লাহ ভাই! আপনার মতো মানুষই সমাজের গর্ব।',
        created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
        likes: 19,
      },
      {
        id: 'c-4',
        author_name: 'রোকসানা পারভীন',
        author_badge: 'স্বেচ্ছাসেবক',
        content: 'অনেক অনুপ্রেরণাদায়ক!',
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        likes: 12,
      },
    ],
  },
  {
    id: 'post-104',
    author_id: 105,
    author_name: 'মেহেদী হাসান',
    author_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    author_blood_group: 'A+',
    author_district: 'বরগুনা',
    author_upazila: 'বরগুনা সদর',
    is_verified_donor: true,
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    post_type: 'album',
    category: 'donation',
    title: 'স্মৃতি অ্যালবাম: My 10th Blood Donation Milestone',
    content: '১০ বার রক্তদানের মাইলফলক অর্জনের মুহূর্তগুলো অ্যালবামে ধরে রাখলাম।',
    album: {
      title: 'My 10th Blood Donation',
      hospital: 'বরগুনা জেলা সদর হাসপাতাল',
      date: '২০২৬-০৮-১০',
      blood_group: 'A+',
      donation_number: 10,
      photos: [
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
      ],
    },
    reactions: {
      support: 92,
      lifesaver: 110,
      respect: 76,
      hero: 64,
      congratulations: 58,
    },
    comments_count: 18,
    shares_count: 22,
    privacy: 'everyone',
    priority: 4,
  },
  {
    id: 'post-105',
    author_id: 301,
    author_name: 'ডা. সানজিদা সুলতানা',
    author_role: 'হেমাটোলজিস্ট',
    author_avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    author_district: 'বরিশাল',
    is_verified_institution: true,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    post_type: 'education',
    category: 'education',
    title: 'রক্তদানের পূর্বে কী কী খাবেন ও কী বর্জন করবেন?',
    content: 'রক্তদানের আগে প্রচুর পানি পান করুন, চর্বিযুক্ত খাবার এড়িয়ে চলুন এবং অন্তত ৬ ঘণ্টা পর্যাপ্ত ঘুমান। নিয়মিত রক্তদানে হৃদরোগের ঝুঁকি কমে।',
    images: ['https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80'],
    reactions: {
      support: 65,
      lifesaver: 45,
      respect: 80,
      hero: 22,
      congratulations: 15,
    },
    comments_count: 8,
    shares_count: 49,
    privacy: 'everyone',
    priority: 6,
  },
];

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    participant_id: 110,
    participant_name: 'আব্দুর রহিম',
    participant_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'B+',
    participant_online: true,
    participant_typing: false,
    is_emergency: true,
    emergency_details: {
      blood_group: 'B+',
      hospital: 'শের-ই-বাংলা মেডিকেল',
      units: 2,
      urgency: 'Critical',
    },
    last_message: 'ভাই, আপনি কি রক্ত দিতে আসছেন? আমরা সার্জারি ওয়ার্ডে আছি।',
    last_message_time: '১০ মিনিট আগে',
    unread_count: 1,
    type: 'emergency',
  },
  {
    id: 'conv-2',
    participant_id: 101,
    participant_name: 'তানভীর আহমেদ',
    participant_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'O+',
    participant_online: false,
    participant_typing: false,
    is_emergency: false,
    last_message: 'ইনশাআল্লাহ, পরের মাসে রক্ত দিতে পারব।',
    last_message_time: 'গতকাল',
    unread_count: 0,
    type: 'direct',
  },
  {
    id: 'conv-3',
    participant_id: 501,
    participant_name: 'SBMCH ব্লাড ব্যাংক সাপোর্ট',
    participant_avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'AB+',
    participant_online: true,
    participant_typing: false,
    is_emergency: false,
    last_message: 'রক্তদান ক্যাম্পের শিডিউল কনফার্ম করা হয়েছে।',
    last_message_time: '২ দিন আগে',
    unread_count: 0,
    type: 'hospital',
  },
  {
    id: 'conv-4',
    participant_id: 801,
    participant_name: 'বরিশাল O+ ব্লাড গ্রুপ কমিউনিটি',
    participant_avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'O+',
    participant_online: true,
    is_emergency: false,
    last_message: 'জরুরি নোটিস: রূপাতলী এলাকায় জরুরি রক্তের ডাক।',
    last_message_time: 'আজ দুপুর ১২টা',
    unread_count: 3,
    type: 'group',
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1',
      conversation_id: 'conv-1',
      sender_id: 110,
      sender_name: 'আব্দুর রহিম',
      text: 'আসসালামু আলাইকুম। আমার রোগীর জন্য B+ রক্ত দরকার।',
      created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      is_delivered: true,
      is_read: true,
    },
    {
      id: 'm-2',
      conversation_id: 'conv-1',
      sender_id: 'current_user',
      sender_name: 'আপনি',
      text: 'ওয়ালাইকুম আসসালাম। আমি রওনা হয়েছি, আধা ঘণ্টার মধ্যে মেডিকেলে পৌঁছে যাব।',
      created_at: new Date(Date.now() - 22 * 60000).toISOString(),
      is_delivered: true,
      is_read: true,
    },
    {
      id: 'm-3',
      conversation_id: 'conv-1',
      sender_id: 110,
      sender_name: 'আব্দুর রহিম',
      text: 'অনেক ধন্যবাদ ভাই! আমরা ব্লাড ব্যাংকের সামনে অপেক্ষা করছি।',
      created_at: new Date(Date.now() - 15 * 60000).toISOString(),
      is_delivered: true,
      is_read: true,
    },
    {
      id: 'm-4',
      conversation_id: 'conv-1',
      sender_id: 110,
      sender_name: 'আব্দুর রহিম',
      text: 'ভাই, আপনি কি রক্ত দিতে আসছেন? আমরা সার্জারি ওয়ার্ডে আছি।',
      created_at: new Date(Date.now() - 10 * 60000).toISOString(),
      is_delivered: true,
      is_read: false,
    },
  ],
};

const SAMPLE_REPUTATION: DonorReputationProfile = {
  id: 101,
  name: 'মো. সাইদুল ইসলাম (MD. SAID)',
  blood_group: 'O+',
  district: 'বরিশাল',
  upazila: 'বরিশাল সদর',
  is_verified_donor: true,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  cover_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  bio: 'স্বেচ্ছায় রক্তদান মানবকল্যাণে আমার অঙ্গীকার। যেকোনো জরুরি প্রয়োজনে পাশে আছি।',
  impact_score: 860,
  total_donations: 12,
  emergency_responses: 4,
  people_reached: 320,
  badges_count: 8,
  posts_count: 38,
  following_count: 142,
  followers_count: 489,
  level: 'Golden',
  badges: [
    { id: 'b-1', name: 'First Donation', icon: '🩸', description: 'প্রথম রক্তদান সম্পন্নকারী', unlocked_at: '২০২২' },
    { id: 'b-2', name: 'Community Supporter', icon: '🤝', description: 'কমিউনিটিতে নিয়মিত সক্রিয়', unlocked_at: '২০২৩' },
    { id: 'b-3', name: 'Emergency Responder', icon: '🚨', description: 'জরুরি রক্তের আবেদনে দ্রুত সাড়া প্রদান', unlocked_at: '২০২৩' },
    { id: 'b-4', name: 'Hospital Hero', icon: '🏥', description: 'হাসপাতাল রোগীদের জন্য নিবেদিত', unlocked_at: '২০২৪' },
    { id: 'b-5', name: 'Blood Educator', icon: '📚', description: 'সচেতনতামূলক কন্টেন্ট প্রস্তুতকারী', unlocked_at: '২০২৪' },
    { id: 'b-6', name: 'Community Builder', icon: '🌐', description: 'রক্তযোদ্ধা দল গঠনকারী', unlocked_at: '২০২৫' },
    { id: 'b-7', name: 'Verified Donor', icon: '🛡️', description: 'চিকিৎসাগতভাবে যাচাইকৃত রক্তদাতা', unlocked_at: '২০২৫' },
    { id: 'b-8', name: 'Regular Donor', icon: '⭐', description: 'বছরে একাধিকবার নিয়মিত দাতা', unlocked_at: '২০২৬' },
  ],
};

export class SocialStorageService {
  private static POSTS_KEY = 'barishal_rokto_posts_v2';
  private static STORIES_KEY = 'barishal_rokto_stories_v2';
  private static CONVS_KEY = 'barishal_rokto_convs_v2';
  private static MSGS_KEY = 'barishal_rokto_msgs_v2';
  private static REPUTATION_KEY = 'barishal_rokto_reputation_v2';

  static getPosts(): SocialPost[] {
    try {
      const data = localStorage.getItem(this.POSTS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }

  static savePosts(posts: SocialPost[]): void {
    try {
      localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
    } catch {}
  }

  static getStories(): ShortStory[] {
    try {
      const data = localStorage.getItem(this.STORIES_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.STORIES_KEY, JSON.stringify(INITIAL_STORIES));
    return INITIAL_STORIES;
  }

  static getConversations(): ChatConversation[] {
    try {
      const data = localStorage.getItem(this.CONVS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.CONVS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    return INITIAL_CONVERSATIONS;
  }

  static saveConversations(convs: ChatConversation[]): void {
    try {
      localStorage.setItem(this.CONVS_KEY, JSON.stringify(convs));
    } catch {}
  }

  static getMessages(convId: string): ChatMessage[] {
    try {
      const data = localStorage.getItem(`${this.MSGS_KEY}_${convId}`);
      if (data) return JSON.parse(data);
    } catch {}
    const initial = INITIAL_MESSAGES[convId] || [];
    localStorage.setItem(`${this.MSGS_KEY}_${convId}`, JSON.stringify(initial));
    return initial;
  }

  static saveMessages(convId: string, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(`${this.MSGS_KEY}_${convId}`, JSON.stringify(messages));
    } catch {}
  }

  static getReputation(): DonorReputationProfile {
    try {
      const data = localStorage.getItem(this.REPUTATION_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.REPUTATION_KEY, JSON.stringify(SAMPLE_REPUTATION));
    return SAMPLE_REPUTATION;
  }
}

export const SocialService = SocialStorageService;
