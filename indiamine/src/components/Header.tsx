import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Crown,
  LogOut,
  ChevronDown,
  X,
  Play,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { User, AnimeShow } from '../types';
import { Download } from 'lucide-react';
import { ANIME_SHOWS, BRAND_LOGO_URL } from '../data/animeData';

interface HeaderProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  onSelectShow: (show: AnimeShow) => void;
  onNavigateToStudio: () => void;
  onLogout: () => void;
  onSearchSubmit?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  onOpenPremium,
  onSelectShow,
  onNavigateToStudio,
  onLogout,
  onSearchSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filter shows live for autocomplete search
  const searchResults = searchQuery.trim()
    ? ANIME_SHOWS.filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) onSearchSubmit(searchQuery);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 w-full z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-[#11131c]/80 backdrop-blur-2xl border-b border-white/5">
      {/* Mobile Logo Branding */}
      <div className="flex lg:hidden items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg overflow-hidden shadow-[0_0_10px_var(--accent-glow)]">
          <img src={BRAND_LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-headline font-bold text-lg text-[var(--accent)]">AniGalnexo</span>
      </div>

      {/* Global Search Bar (Desktop) */}
      <div className="relative flex-1 max-w-xl mx-4 hidden sm:block" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#e0c0af]/60 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search anime, creators, studios, or genres..."
            className="w-full pl-11 pr-10 py-2.5 bg-[#191b24]/90 border border-white/10 rounded-full text-[13px] text-[#e1e1ef] placeholder-[#e0c0af]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3.5 p-1 text-[#e0c0af]/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Results */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-[#191b24] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 divide-y divide-white/5">
            <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#e0c0af]/60">
              Matching Shows & Creators
            </div>
            {searchResults.map((show) => (
              <div
                key={show.id}
                onClick={() => {
                  onSelectShow(show);
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
              >
                <img
                  src={show.posterImage}
                  alt={show.title}
                  className="w-11 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[14px] font-bold text-white truncate group-hover:text-[var(--accent)] transition-colors">
                      {show.title}
                    </h4>
                    {show.isOriginal && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                        Original
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#e0c0af]/70 truncate">{show.genres.join(' • ')}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#e0c0af]/50 mt-0.5">
                    <span>★ {show.rating}</span>
                    <span>•</span>
                    <span>{show.year}</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-[var(--accent)] text-white transition-colors flex-shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* VIP Upgrade Pill */}
        <button
          onClick={onOpenPremium}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[#ff9e3b]/20 border border-[var(--accent)]/40 text-[var(--accent)] hover:text-white text-[12px] font-bold transition-all hover:scale-105"
        >
          <Crown className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>VIP Pass</span>
        </button>


        {/* Download App Button */}
        <button
          type="button"
          onClick={() => {
            window.alert(
              'Coming Soon! The AniGalnexo app is coming soon. Stay tuned!'
            );
          }}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/25 hover:text-white text-[10px] sm:text-[12px] font-bold transition-all whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Download App</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e1e1ef] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#191b24] border border-white/15 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-headline font-bold text-[15px] text-white">Notifications</h3>
                <span className="text-[11px] font-semibold text-[var(--accent)] cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto no-scrollbar pt-1">
                <div className="py-3 flex items-start gap-3 hover:bg-white/5 p-2 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">
                      <span className="font-bold text-[var(--accent)]">Shadow of Sakura</span> Episode 4
                      is now streaming in Hindi & Japanese!
                    </p>
                    <span className="text-[11px] text-[#e0c0af]/60 mt-1 block">15 mins ago</span>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-3 hover:bg-white/5 p-2 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#00f4fe]/20 flex items-center justify-center flex-shrink-0 text-[#00f4fe]">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">
                      Creator Studio payout of <span className="font-bold text-[#e1e1ef]">₹24,500</span> has been processed.
                    </p>
                    <span className="text-[11px] text-[#e0c0af]/60 mt-1 block">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile Menu */}
        {currentUser ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--accent)]/60"
              />
              <span className="hidden md:block text-[13px] font-bold text-white max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#e0c0af]/70" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#191b24] border border-white/15 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-white">{currentUser.name}</p>
                    {currentUser.isPremium && (
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#e0c0af]/60 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1.5 space-y-1">
                  {/* <button
                    onClick={() => {
                      onNavigateToStudio();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[#e1e1ef] hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                      <span>Creator Studio</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10">
                      Pro
                    </span>
                  </button> */}

                  <button
                    onClick={() => {
                      onOpenPremium();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[var(--accent)] hover:bg-white/10 transition-colors"
                  >
                    <Crown className="w-4 h-4 text-[var(--accent)]" />
                    <span>Subscription & VIP Pass</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-[13px] font-bold transition-all shadow-[0_0_12px_var(--accent-glow)]"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
