import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_INSTRUCTION = `আপনি "রক্ত সহায়ক এআই" (Rokto Shohayok AI) — বরিশাল রক্ত প্ল্যাটফর্মের (Barishal Rokto) একজন বিশ্বস্ত ও সহানুভূতিশীল মেডিকেল ব্লাড অ্যাসিস্ট্যান্ট।
আপনার দায়িত্ব:
১. রক্তদানের যোগ্যতা, নিয়মাবলী ও স্বাস্থ্যবিধি ব্যাখ্যা করা (যেমন: ওজন কমপক্ষে ৫০ কেজি, বয়স ১৮-৬০, হিমোগ্লোবিন পুরুষ ১২.৫ ও নারী ১২.০ g/dL, শেষ রক্তদানের ৩ মাস পর)।
২. রক্তের গ্রুপ ও ক্রস-ম্যাচিং কম্প্যাটিবিলিটি জানানো (O- সর্বজনীন দাতা, AB+ সর্বজনীন গ্রহীতা)।
৩. ডেঙ্গু ও জটিল রোগীর ক্ষেত্রে রক্তকণিকা (SDP) ও প্লাটিলেটের গুরুত্ব বোঝানো।
৪. বরিশাল বিভাগের সকল জেলা (বরিশাল, পটুয়াখালী, ভোলা, পিরোজপুর, বরগুনা, ঝালকাঠি) ও শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMC)-এর জরুরি যোগাযোগ সহায়তা দেওয়া।
৫. ব্যবহারকারীকে সর্বদা স্পষ্ট ও বিশুদ্ধ বাংলায় তথ্য দিন।
৬. সফটওয়্যার আর্কিটেক্ট ও লিড ইঞ্জিনিয়ার: MD. SAIDUL ISLAM।
জরুরি অবস্থায় ৯৯৯ বা নিকটস্থ হাসপাতালে যাওয়ার পরামর্শ দিন।`;

const getLocalFallbackReply = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('যোগ্যতা') || q.includes('কে দিতে পারবে') || q.includes('নিয়ম')) {
    return `**রক্তদানের প্রধান শর্তাবলী:**\n- **বয়স:** ১৮ থেকে ৬০ বছর\n- **ওজন:** কমপক্ষে ৫০ কেজি (নারীদের ক্ষেত্রে ৪৫ কেজি)\n- **হিমোগ্লোবিন:** পুরুষদের ১২.৫ g/dL ও নারীদের ১২.০ g/dL বা তার বেশি\n- **রক্তদানের বিরতি:** পুরুষদের ৩ মাস ও নারীদের ৪ মাস পর পর\n- **স্বাস্থ্য:** জ্বর, অ্যান্টিবায়োটিক সেবন বা অ্যালার্জি না থাকা।`;
  }
  if (q.includes('প্লাটিলেট') || q.includes('ডেঙ্গু')) {
    return `**ডেঙ্গু ও প্লাটিলেট (SDP) সংক্রান্ত পরামর্শ:**\n- রোগীর প্লাটিলেট ২০,০০০-এর নিচে নামলে বা রক্তক্ষরণ হলে জরুরি প্লাটিলেট প্রয়োজন হয়।\n- এফেরেসিস (SDP) পদ্ধতিতে ১ জন দাতার রক্ত থেকেই ১ ডোজ প্লাটিলেট তৈরি সম্ভব।\n- **শর্ত:** ওজন ৫৫+ কেজি ও ভালো শিরা থাকা প্রয়োজন।`;
  }
  if (q.includes('গ্রুপ') || q.includes('ও নেগেটিভ') || q.includes('কম্প্যাটিবল')) {
    return `**রক্তের গ্রুপের সামঞ্জস্যতা:**\n- **O- (ও নেগেটিভ):** ইউনিভার্সাল ডোনার, সব গ্রুপকে দেওয়া যায়।\n- **AB+ (এবি পজিটিভ):** ইউনিভার্সাল গ্রহীতা, সবার রক্ত নিতে পারে।\n- যেকোনো গ্রুপের পজিটিভ রক্ত পজিটিভদের এবং নেগেটিভ রক্ত পজিটিভ ও নেগেটিভ উভয়কে দেওয়া যায়।`;
  }
  return `**বরিশাল রক্ত সহকারী:**\nআপনার রক্তের প্রয়োজন হলে ওয়েবসাইটের "জরুরি আবেদন" বাটনে ক্লিক করে ফর্মটি পূরণ করুন অথবা সরাসরি শের-ই-বাংলা মেডিকেলের রক্ত ব্যাংকে যোগাযোগ করুন। জরুরি জাতীয় হটলাইন: **৯৯৯**।`;
};

router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'বার্তা প্রদান করুন' });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      const reply = getLocalFallbackReply(message);
      res.json({
        success: true,
        reply,
        model: 'local-medical-assistant',
      });
      return;
    }

    const contents: any[] = [];
    if (Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || getLocalFallbackReply(message);
    res.json({
      success: true,
      reply,
      model: 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.error('[AI Route Error]:', error);
    const fallbackText = getLocalFallbackReply(req.body?.message || '');
    res.json({
      success: true,
      reply: fallbackText,
      model: 'fallback-emergency-mode',
    });
  }
});

export default router;
