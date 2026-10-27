import React from 'react';
import {
  User,
  Crown,
  Sparkles,
  Settings,
  Shield,
  Download,
  Languages,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileViewProps {
  currentUser: UserType | null;
  onOpenPremium: () => void;
  onNavigateToStudio: () => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onOpenPremium,
  onNavigateToStudio,
  onLogout,
  onToast,
}) => {
  if (!currentUser) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24 lg:pb-16 animate-in fade-in duration-300">
      {/* Profile Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-[var(--accent)]/50 shadow-2xl flex-shrink-0"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-white">
              {currentUser.name}
            </h1>
            {currentUser.isPremium && (
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Crown className="w-3.5 h-3.5" />
                VIP Member
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#e0c0af]/80">{currentUser.email}</p>
          <p className="text-[12px] text-[var(--accent)]">
            Member since {currentUser.joinedDate} • Role: {currentUser.role.toUpperCase()}
          </p>
        </div>

        <button
          onClick={onOpenPremium}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[13px] shadow-[0_0_15px_var(--accent-glow)] flex-shrink-0"
        >
          Manage VIP Pass
        </button>
      </div>

      {/* Settings & Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Creator Studio Card */}
        <div
          onClick={onNavigateToStudio}
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-[var(--accent)]/50 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold text-lg text-white group-hover:text-[var(--accent)] transition-colors">
            Creator Studio Dashboard
          </h3>
          <p className="text-[13px] text-[#e0c0af]/80">
            Publish original anime series, view streaming metrics, and manage earnings payouts.
          </p>
          <div className="pt-2 flex items-center gap-1 text-[13px] font-bold text-[var(--accent)]">
            <span>Open Studio</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Downloads */}
        <div
          onClick={() => onToast('You have 3 episodes stored offline.')}
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#00f4fe] flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold text-lg text-white">Offline Downloads</h3>
          <p className="text-[13px] text-[#e0c0af]/80">
            Manage downloaded 1080p episodes for offline viewing without consuming mobile data.
          </p>
        </div>

        {/* Audio & Dubbing Preferences */}
        <div
          onClick={() => onToast('Default audio set to Hindi (Dub) with English CC.')}
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[var(--accent)] flex items-center justify-center">
            <Languages className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold text-lg text-white">Playback Language Defaults</h3>
          <p className="text-[13px] text-[#e0c0af]/80">
            Preferred Default: Hindi (Dub) with English Subtitles.
          </p>
        </div>

        {/* Security & Account */}
        <div
          onClick={() => onToast('Security settings verified.')}
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-emerald-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold text-lg text-white">Security & Privacy</h3>
          <p className="text-[13px] text-[#e0c0af]/80">
            Manage active streaming devices, connected TV credentials, and profile locks.
          </p>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onLogout}
          className="px-6 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-[13px] flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of AniGalnexo</span>
        </button>
      </div>
    </div>
  );
};
