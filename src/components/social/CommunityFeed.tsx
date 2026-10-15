import React, { useState } from 'react';
import { SocialService } from '../../services/socialData.js';
import { SocialPost, ShortStory, BloodGroup } from '../../types/index.js';
import { useAuth } from '../../hooks/useAuth.js';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Droplet,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';

export const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const [stories] = useState<ShortStory[]>(() => SocialService.getStories());
  const [posts, setPosts] = useState<SocialPost[]>(() => SocialService.getPosts());
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'donation' | 'general' | 'emergency'>('donation');
  const [selectedStory, setSelectedStory] = useState<ShortStory | null>(null);

  const handleLike = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const hasLiked = post.user_reaction === 'support';
        return {
          ...post,
          user_reaction: hasLiked ? undefined : ('support' as const),
          reactions: {
            ...post.reactions,
            support: hasLiked ? Math.max(0, post.reactions.support - 1) : post.reactions.support + 1,
          },
        };
      }
      return post;
    });
    setPosts(updated);
    SocialService.savePosts(updated);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      author_id: user?.id || 999,
      author_name: user?.name || 'শুভাকাঙ্ক্ষী রক্তদাতা',
      author_avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      author_role: 'donor',
      author_blood_group: (user?.blood_group as BloodGroup) || 'O+',
      author_district: user?.district || 'বরিশাল',
      author_upazila: user?.upazila || 'বরিশাল সদর',
      is_verified_donor: user?.is_verified === 1,
      created_at: new Date().toISOString(),
      post_type: 'donation_story',
      category: newPostCategory,
      content: newPostContent.trim(),
      reactions: {
        support: 1,
        lifesaver: 0,
        respect: 0,
        hero: 0,
        congratulations: 0,
      },
      user_reaction: 'support',
      comments_count: 0,
      shares_count: 0,
      privacy: 'everyone',
      priority: 1,
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    SocialService.savePosts(updated);
    setNewPostContent('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Stories Rail */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider mb-3 px-1">
          লাইভ রক্তদান স্টোরিজ
        </h4>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex flex-col items-center shrink-0 cursor-pointer group">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50 group-hover:bg-red-100 transition">
              <Plus className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5 truncate w-16 text-center">
              আমার গল্প
            </span>
          </div>

          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-red-600 to-amber-500 group-hover:scale-105 transition-transform shadow-xs">
                <img
                  src={story.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={story.user_name}
                  className="w-full h-full object-cover rounded-[14px] border-2 border-white"
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-800 mt-1.5 truncate w-16 text-center">
                {story.user_name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story View Modal */}
      {selectedStory && (
        <div
          onClick={() => setSelectedStory(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white"
          >
            <div className="relative h-96">
              <img
                src={selectedStory.media_url || selectedStory.user_avatar}
                alt="Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
              
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedStory.user_avatar}
                    alt={selectedStory.user_name}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs leading-none">{selectedStory.user_name}</h5>
                    <span className="text-[10px] text-white/70">{selectedStory.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-black uppercase mb-1.5 inline-block">
                  {selectedStory.blood_group} গ্রুপ
                </span>
                <p className="text-xs text-white/95 font-medium leading-relaxed">
                  {selectedStory.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Post Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-red-600" />
          <h4 className="font-bold text-xs text-slate-800">কমিউনিটিতে অভিজ্ঞতা শেয়ার করুন</h4>
        </div>
        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="রক্তদানের অনুপ্রেরণামূলক অভিজ্ঞতা বা জরুরি বার্তা লিখুন..."
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition resize-none h-20"
          />
          <div className="flex items-center justify-between">
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700"
            >
              <option value="donation">রক্তদানের গল্প</option>
              <option value="general">সাধারণ আলোচনা</option>
              <option value="emergency">জরুরি বার্তা</option>
            </select>

            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>পোস্ট করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.map((post) => {
          const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
          const isLiked = post.user_reaction === 'support';
          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-sm text-slate-900">{post.author_name}</h5>
                      {post.author_blood_group && (
                        <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-black">
                          {post.author_blood_group}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{post.author_district || 'বরিশাল'}</span>
                      <span>•</span>
                      <span>{formatDateBengali(post.created_at)}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    post.category === 'emergency'
                      ? 'bg-red-100 text-red-700 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {post.category === 'emergency' ? 'জরুরি নোটিশ' : 'রক্তদান গল্প'}
                </span>
              </div>

              {/* Post Body */}
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Post Images if any */}
              {post.images && post.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-72">
                  <img
                    src={post.images[0]}
                    alt="Post visual"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    isLiked ? 'text-red-600 bg-red-50' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`}
                  />
                  <span>{toBengaliDigits(totalReactions)} সমর্থন</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{toBengaliDigits(post.comments_count || 0)} মন্তব্য</span>
                </div>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'বরিশাল রক্ত কমিউনিটি পোস্ট',
                        text: post.content,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>শেয়ার</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
