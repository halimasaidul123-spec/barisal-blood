import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LifesaverQuiz: React.FC = () => {
  const questions: Question[] = [
    {
      id: 1,
      question: 'সুস্থ পুরুষ প্রতি কত দিন পর পর নিরাপদে রক্তদান করতে পারেন?',
      options: [
        '৩০ দিন পর',
        '৯০ দিন (৩ মাস) পর',
        '১৮০ দিন পর',
      ],
      correctIndex: 1,
      explanation: 'পুরুষের শরীরে ৩ মাস (৯০ দিন) এবং নারীদের ক্ষেত্রে ৪ মাস (১২০ দিন) পর রক্তদান নিরাপদ।',
    },
    {
      id: 2,
      question: 'রক্তদানের জন্য রক্তদাতার ন্যূনতম শারীরিক ওজন কত হতে হয়?',
      options: [
        '৪০ কেজি',
        '৫০ কেজি (নারীদের জন্য ৪৫ কেজি)',
        '৬০ কেজি',
      ],
      correctIndex: 1,
      explanation: 'বিশ্ব স্বাস্থ্য সংস্থার মানদণ্ড অনুসারে পুরুষের ন্যূনতম ওজন ৫০ কেজি ও নারীদের ৪৫ কেজি হতে হয়।',
    },
    {
      id: 3,
      question: 'কোন রক্তের গ্রুপকে সার্বজনীন দাতা (Universal Donor) বলা হয়?',
      options: ['এবি পজিটিভ (AB+)', 'ও নেগেটিভ (O-)', 'বি পজিটিভ (B+)'],
      correctIndex: 1,
      explanation: 'O- রক্তে কোনো A, B বা Rh অ্যান্টিজেন না থাকায় জরুরি পরিস্থিতিতে যেকোনো রোগীকে এই রক্ত দেওয়া যায়।',
    },
    {
      id: 4,
      question: 'রক্তদানের পর রক্তের তরল অংশ (প্লাজমা) পূরণ হতে কত সময় লাগে?',
      options: [
        '১২ ঘণ্টা',
        '৪৮ থেকে ৭২ ঘণ্টা',
        '৩ মাস',
      ],
      correctIndex: 1,
      explanation: 'প্রচুর পানি ও তরল খাদ্য গ্রহণের মাধ্যমে মাত্র ২-৩ দিনে রক্তের প্লাজমার পরিমাণ স্বাভাবিক হয়ে যায়।',
    },
    {
      id: 5,
      question: 'এক ব্যাগ সংগৃহীত রক্ত প্রক্রিয়াজাত করে কয়টি মুমূর্ষু প্রাণ বাঁচানো সম্ভব?',
      options: [
        '৩ জনের জীবন (RBC, প্লাটিলেট, FFP)',
        '১ জনের জীবন',
        '১০ জনের জীবন',
      ],
      correctIndex: 0,
      explanation: 'হোল ব্লাড আলাদা করে লোহিত রক্তকণিকা, প্লাটিলেট ও প্লাজমা উপাদান ৩ জন ভিন্ন রোগীকে দেওয়া সম্ভব।',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>লাইফসেভার জ্ঞান যাচাই</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            রক্তদান সাধারণ জ্ঞান ও কুইজ
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            সঠিক তথ্য জেনে কুসংস্কারমুক্ত জীবনসেবায় অংশ নিন
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          প্রশ্ন: {toBengaliDigits(currentIdx + 1)} / {toBengaliDigits(questions.length)}
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-extrabold text-base text-slate-900 leading-snug">
              {toBengaliDigits(currentIdx + 1)}. {currentQ.question}
            </h4>
          </div>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'bg-white border-slate-200 hover:border-red-300 text-slate-800';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-950 font-bold';
                } else {
                  btnStyle = 'bg-white border-slate-200 opacity-60 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>ব্যাখ্যা:</span>
              </span>
              <p className="leading-relaxed text-blue-900">{currentQ.explanation}</p>
              <button
                onClick={handleNext}
                className="mt-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <span>{currentIdx + 1 === questions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900">কুইজ সম্পন্ন হয়েছে!</h4>
            <div className="text-3xl font-black text-red-600 mt-2">
              {toBengaliDigits(score)} / {toBengaliDigits(questions.length)} সঠিক
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {score >= 4
                ? 'চমৎকার! রক্তদান বিষয়ে আপনার চমৎকার সম্যক জ্ঞান রয়েছে।'
                : 'ভালো চেষ্টা! রক্তদান বিষয়ক আরও তথ্য জানতে আমাদের গাইড পড়ুন।'}
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>আবার চেষ্টা করুন</span>
          </button>
        </div>
      )}
    </div>
  );
};
