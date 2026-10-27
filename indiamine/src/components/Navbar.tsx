import React from 'react';
import {
  Home,
  Compass,
  Layers,
  Users,
  Bookmark,
  User,
  Crown,
  LayoutDashboard,
  UploadCloud,
  Sparkles,
  Settings,
} from 'lucide-react';
import { ViewMode, User as UserType } from '../types';
import { BRAND_LOGO_URL } from '../data/animeData';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  currentUser: UserType | null;
  onOpenPremium: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenPremium,
  onOpenAuth,
}) => {
  const isCreatorMode = currentView === 'creator-studio';
  const accent = 'var(--accent, var(--accent))';

  return (
    <>
      {/* Desktop SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-64 hidden lg:flex flex-col pt-8 pb-6 bg-[#191b24]/60 backdrop-blur-2xl border-r border-white/10 z-40 transition-colors duration-200">
        {/* Brand Logo & Name */}
        <div
          className="px-6 mb-8 flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_var(--accent-glow)] flex-shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="AniGalnexo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="font-headline text-[22px] font-bold text-[var(--accent)] leading-none tracking-tight group-hover:text-[var(--accent)] transition-colors">
              AniGalnexo
            </h1>
            <p className="text-[12px] text-[#e0c0af]/80 font-medium tracking-wide mt-1">
              {isCreatorMode ? 'Creator Studio' : 'Anime Streaming platform'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1.5">
          {!isCreatorMode ? (
            <>
              <button
                onClick={() => onNavigate('home')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left font-semibold text-[14px] ${currentView === 'home'
                  ? 'text-[var(--accent)] border-l-4 border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_15px_var(--accent-glow)] font-bold'
                  : 'text-[#e0c0af] hover:text-white hover:bg-white/5'
                  }`}
                style={
                  currentView === 'home'
                    ? {
                      color: accent,
                      borderLeftColor: accent,
                      backgroundColor: 'color-mix(in srgb, var(--accent, var(--accent)) 15%, transparent)',
                    }
                    : undefined
                }
              >
                <Home
                  className="w-5 h-5"
                  style={{ color: currentView === 'home' ? accent : undefined }}
                />
                <span>Home</span>
              </button>

              <button
                onClick={() => onNavigate('discover')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left font-semibold text-[14px] ${currentView === 'discover'
                  ? 'text-[var(--accent)] border-l-4 border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_15px_var(--accent-glow)] font-bold'
                  : 'text-[#e0c0af] hover:text-white hover:bg-white/5'
                  }`}
              >
                <Compass className={`w-5 h-5 ${currentView === 'discover' ? 'text-[var(--accent)]' : ''}`} />
                <span>Discover</span>
              </button>

              <button
                onClick={() => onNavigate('genres')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left font-semibold text-[14px] ${currentView === 'genres'
                  ? 'text-[var(--accent)] border-l-4 border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_15px_var(--accent-glow)] font-bold'
                  : 'text-[#e0c0af] hover:text-white hover:bg-white/5'
                  }`}
              >
                <Layers className={`w-5 h-5 ${currentView === 'genres' ? 'text-[var(--accent)]' : ''}`} />
                <span>Genres</span>
              </button>

              <button
                onClick={() => onNavigate('community')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left font-semibold text-[14px] ${currentView === 'community'
                  ? 'text-[var(--accent)] border-l-4 border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_15px_var(--accent-glow)] font-bold'
                  : 'text-[#e0c0af] hover:text-white hover:bg-white/5'
                  }`}
              >
                <Users className={`w-5 h-5 ${currentView === 'community' ? 'text-[var(--accent)]' : ''}`} />
                <span>Community</span>
              </button>

              <button
                onClick={() => onNavigate('mylist')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left font-semibold text-[14px] ${currentView === 'mylist'
                  ? 'text-[var(--accent)] border-l-4 border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_15px_var(--accent-glow)] font-bold'
                  : 'text-[#e0c0af] hover:text-white hover:bg-white/5'
                  }`}
              >
                <Bookmark className={`w-5 h-5 ${currentView === 'mylist' ? 'text-[var(--accent)]' : ''}`} />
                <span>My List</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                  } else {
                    onNavigate('profile');
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left font-semibold text-[14px] ${currentView === 'profile'
                  ? 'text-[var(--accent)] border-l-4 border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_15px_var(--accent-glow)] font-bold'
                  : 'text-[#e0c0af] hover:text-white hover:bg-white/5'
                  }`}
              >
                <User className={`w-5 h-5 ${currentView === 'profile' ? 'text-[var(--accent)]' : ''}`} />
                <span>Profile</span>
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'settings'
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                  : 'text-[#e0c0af]/80 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </button>

              <div className="pt-4 border-t border-white/10 mt-3">
                <button
                  onClick={() => onNavigate('creator-studio')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[var(--accent)]/15 border border-white/10 hover:border-[var(--accent)]/40 text-[#e1e1ef] text-[13px] font-medium transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[var(--accent)] group-hover:rotate-12 transition-transform" />
                    <span>Creator Studio</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[var(--accent)]/20 text-[var(--accent)]">
                    Pro
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Creator Studio navigation */
            <>
              <button
                onClick={() => onNavigate('creator-studio')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[var(--accent)] border-l-4 border-[var(--accent)] bg-[var(--accent)]/15 font-bold text-[14px]"
              >
                <LayoutDashboard className="w-5 h-5 text-[var(--accent)]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('creator-studio')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[#e0c0af] hover:text-white hover:bg-white/5 font-semibold text-[14px]"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Uploads</span>
              </button>

              <button
                onClick={() => onNavigate('community')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[#e0c0af] hover:text-white hover:bg-white/5 font-semibold text-[14px]"
              >
                <Users className="w-5 h-5" />
                <span>Followers</span>
              </button>

              <div className="pt-4 border-t border-white/10 mt-3">
                <button
                  onClick={() => onNavigate('home')}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e1e1ef] text-[13px] font-medium transition-all"
                >
                  <Home className="w-4 h-4 text-[#00f4fe]" />
                  <span>Back to Viewer App</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Go Premium CTA / Creator status */}
        <div className="px-5 mt-auto pt-4 border-t border-white/10">
          <button
            onClick={onOpenPremium}
            className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold text-[14px] rounded-xl glow-active transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_var(--accent-glow)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Crown className="w-4 h-4" />
            <span>Go Premium</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (84px fixed height with blur) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden flex justify-around items-center px-2 pb-safe bg-[#11131c]/85 backdrop-blur-[24px] border-t border-white/10 shadow-[0_-4px_25px_var(--accent-glow)] h-[76px]">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${currentView === 'home'
            ? 'text-[var(--accent)] after:content-[""] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[var(--accent)] after:rounded-full after:shadow-[0_0_10px_var(--accent)]'
            : 'text-[#e0c0af]/80 hover:text-white'
            }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">Home</span>
        </button>

        <button
          onClick={() => onNavigate('discover')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${currentView === 'discover'
            ? 'text-[var(--accent)] after:content-[""] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[var(--accent)] after:rounded-full after:shadow-[0_0_10px_var(--accent)]'
            : 'text-[#e0c0af]/80 hover:text-white'
            }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">Discover</span>
        </button>

        <button
          onClick={() => onNavigate('genres')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${currentView === 'genres'
            ? 'text-[var(--accent)] after:content-[""] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[var(--accent)] after:rounded-full after:shadow-[0_0_10px_var(--accent)]'
            : 'text-[#e0c0af]/80 hover:text-white'
            }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">Genres</span>
        </button>

        <button
          onClick={() => onNavigate('mylist')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${currentView === 'mylist'
            ? 'text-[var(--accent)] after:content-[""] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[var(--accent)] after:rounded-full after:shadow-[0_0_10px_var(--accent)]'
            : 'text-[#e0c0af]/80 hover:text-white'
            }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">My List</span>
        </button>


        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center flex-1 min-w-0 py-1 transition-all relative ${currentView === 'settings'
            ? 'text-[var(--accent)] after:content-[""] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[var(--accent)] after:rounded-full after:shadow-[0_0_10px_var(--accent)]'
            : 'text-[#e0c0af]/80 hover:text-white'
            }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </button>


        <button
          onClick={() => {
            if (!currentUser) {
              onOpenAuth();
            } else {
              onNavigate('profile');
            }
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${currentView === 'profile' || currentView === 'creator-studio'
            ? 'text-[var(--accent)] after:content-[""] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[var(--accent)] after:rounded-full after:shadow-[0_0_10px_var(--accent)]'
            : 'text-[#e0c0af]/80 hover:text-white'
            }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">
            {currentUser ? 'Profile' : 'Login'}
          </span>
        </button>
      </nav>
    </>
  );
};
