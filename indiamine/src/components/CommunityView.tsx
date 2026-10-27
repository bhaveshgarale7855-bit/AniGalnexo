import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Send,
  Sparkles,
  Radio,
  Flame,
  UserCheck,
} from 'lucide-react';
import { COMMUNITY_POSTS, DEFAULT_AVATARS } from '../data/animeData';
import { CommunityPost } from '../types';

interface CommunityViewProps {
  onToast: (msg: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onToast }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'watchparty'>('feed');

  // Watch party state
  const [chatMessages, setChatMessages] = useState([
    { user: 'Vikram_99', text: 'That Katana ignition animation was unreal!! 🔥', time: '18:42' },
    { user: 'Anya_Deshmukh', text: 'Hindi dub is so well casted! 👏', time: '18:43' },
    { user: 'SamuraiX', text: 'Episode 4 cliffhanger got me sweating', time: '18:44' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        name: 'Arjun M.',
        avatar: DEFAULT_AVATARS.arjun,
        role: 'Anime Enthusiast',
      },
      timestamp: 'Just now',
      title: 'Community Discussion',
      content: newPostContent,
      likes: 1,
      commentsCount: 0,
      isLiked: true,
      tags: ['Discussion', 'AniGalnexoCommunity'],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    onToast('Post published to AniGalnexo Community!');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        user: 'Arjun M.',
        text: newChatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewChatMessage('');
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[var(--accent)]" />
            <span>Community & Watch Parties</span>
          </h1>
          <p className="text-[14px] text-[#e0c0af]/80 mt-1">
            Connect with creators, discuss weekly episodes, and join live watch rooms.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#191b24] border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-[var(--accent)] text-white shadow-[0_0_12px_var(--accent-glow)]'
                : 'text-[#e0c0af] hover:text-white'
            }`}
          >
            Creator Feed
          </button>
          <button
            onClick={() => setActiveTab('watchparty')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'watchparty'
                ? 'bg-[var(--accent)] text-white shadow-[0_0_12px_var(--accent-glow)]'
                : 'text-[#e0c0af] hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Live Watch Party</span>
          </button>
        </div>
      </div>

      {activeTab === 'feed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Create Post Card */}
            <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={DEFAULT_AVATARS.arjun}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--accent)]/50"
                />
                <span className="text-[13px] font-bold text-white">Share your thoughts on recent episodes...</span>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-3">
                <textarea
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What did you think of Shadow of Sakura Episode 3?"
                  className="w-full p-3 bg-[#11131c] border border-white/10 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[13px] flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="glass-card p-6 rounded-3xl border border-white/10 space-y-4"
                >
                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[var(--accent)]/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[15px] text-white">{post.author.name}</h4>
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                            {post.author.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#e0c0af]/60">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div>
                    <h3 className="font-headline font-bold text-base text-white">{post.title}</h3>
                    <p className="text-[14px] text-[#e0c0af] leading-relaxed mt-1">
                      {post.content}
                    </p>
                  </div>

                  {/* Optional Image */}
                  {post.image && (
                    <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 bg-black/40">
                      <img
                        src={post.image}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-md border border-[var(--accent)]/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[13px] text-[#e0c0af]/80">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.isLiked ? 'text-rose-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => onToast('Opening discussion comments')}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount} Comments</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        onToast('Post link copied!');
                      }}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Highlights (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-[var(--accent)]" />
                <span>Trending Discussions</span>
              </h3>
              <div className="space-y-3 text-[13px]">
                <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <p className="font-bold text-white">#ShadowOfSakura Ep 4 Dub Reveal</p>
                  <span className="text-[11px] text-[#e0c0af]/60">3.4K discussions</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <p className="font-bold text-white">#AniGalnexoOriginals Season 2 Renewals</p>
                  <span className="text-[11px] text-[#e0c0af]/60">1.8K discussions</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <p className="font-bold text-white">#MechaFest2024 Launch</p>
                  <span className="text-[11px] text-[#e0c0af]/60">940 discussions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live Watch Party Room */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 glass-card p-6 rounded-3xl border border-white/10">
          <div className="lg:col-span-8 space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsK9mOFe5UUyycxys9xopKEs2rmBYILfwOCiPns6uIH7ON5QGQPaFHQPvd_ady9Hg0FSC57CI_h90wxHEr4VTysoIOOV9dEUuSKxFicTkC9pz8QnVUdJaujcy7Xv2bpUBbXZ7r5l3t4Rz5mHRmAU5CHdkCbWHN8GYxMu9XBUqmFVVi9l4HdMSxF7oIEGn0soFQ2Y8BeMEamLkAzBL335u5TcPkzfKgEI7xrs75DTvHaKUJXWh4YkVqDA"
                alt="Watch party stream"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Simulcast • 2,410 Watching</span>
              </div>
            </div>
            <h3 className="font-headline font-bold text-xl text-white">
              Shadow of Sakura: Episode 3 Live Stream with Director Kenji Sato
            </h3>
          </div>

          <div className="lg:col-span-4 flex flex-col h-96 lg:h-auto bg-[#11131c] border border-white/10 rounded-2xl p-4">
            <h4 className="font-bold text-white text-[14px] pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Live Chat</span>
              <span className="text-[11px] text-emerald-400 font-bold">2.4k online</span>
            </h4>
            <div className="flex-1 overflow-y-auto space-y-3 py-3 text-[13px]">
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#e0c0af]/60">
                    <span className="font-bold text-[var(--accent)]">{msg.user}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-white text-[13px]">{msg.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 px-3 py-1.5 bg-[#191b24] border border-white/10 rounded-xl text-[12px] text-white focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[var(--accent)] text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
