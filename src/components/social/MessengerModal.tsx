import React, { useState } from 'react';
import { SocialService } from '../../services/socialData.js';
import { ChatConversation, ChatMessage } from '../../types/index.js';
import { useAuth } from '../../hooks/useAuth.js';
import { X, Send, Phone, MessageSquare } from 'lucide-react';

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessengerModal: React.FC<MessengerModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [conversations] = useState<ChatConversation[]>(() =>
    SocialService.getConversations()
  );
  const [activeConvId, setActiveConvId] = useState<string>(
    conversations.length > 0 ? conversations[0].id : ''
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    activeConvId ? SocialService.getMessages(activeConvId) : []
  );
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    setMessages(SocialService.getMessages(id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConvId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: activeConvId,
      sender_id: user?.id || 999,
      sender_name: user?.name || 'আমি',
      text: inputMsg.trim(),
      created_at: new Date().toISOString(),
      is_delivered: true,
      is_read: true,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    SocialService.saveMessages(activeConvId, updated);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">
        {/* Left Side: Conversations */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col h-full bg-slate-50/70">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-600" />
              <h3 className="font-extrabold text-sm text-slate-800">রক্তদাতা মেসেঞ্জার</h3>
            </div>
            <button
              onClick={onClose}
              className="md:hidden w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectConv(c.id)}
                className={`w-full p-3.5 flex items-start gap-3 text-left transition cursor-pointer ${
                  activeConvId === c.id ? 'bg-white shadow-xs' : 'hover:bg-slate-100/60'
                }`}
              >
                <img
                  src={c.participant_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={c.participant_name}
                  className="w-10 h-10 rounded-2xl object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{c.participant_name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.last_message_time}
                    </span>
                  </div>
                  {c.participant_blood_group && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-600 text-[9px] font-black">
                        {c.participant_blood_group}
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 truncate">{c.last_message}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {activeConv ? (
            <>
              {/* Chat Top Bar */}
              <div className="p-3.5 px-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConv.participant_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={activeConv.participant_name}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{activeConv.participant_name}</h4>
                      {activeConv.participant_blood_group && (
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                          {activeConv.participant_blood_group}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      সক্রিয় আলোচনা
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="hidden md:flex w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 items-center justify-center cursor-pointer transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/50">
                {messages.map((m) => {
                  const isMe = m.sender_id === user?.id || m.sender_name === 'আমি';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                          isMe
                            ? 'bg-red-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(m.created_at).toLocaleTimeString('bn-BD', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="আপনার বার্তা লিখুন..."
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 border border-transparent focus:border-red-500 transition"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="p-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              একটি কথোপকথন নির্বাচন করুন
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
