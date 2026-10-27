/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { AIChatbot } from './components/AIChatbot';
import AdminDashboardView from './components/AdminDashboardView';
import { SettingsView } from './components/SettingsView';
import React, { useState, useEffect } from 'react';
import { ViewMode, AnimeShow, Episode, User } from './types';
import { ANIME_SHOWS, DEFAULT_AVATARS } from './data/animeData';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { DiscoverView } from './components/DiscoverView';
import { GenresView } from './components/GenresView';
import { ShowDetailsView } from './components/ShowDetailsView';
import { VideoPlayerView } from './components/VideoPlayerView';
import { CreatorStudioView } from './components/CreatorStudioView';
import { CommunityView } from './components/CommunityView';
import { MyListView } from './components/MyListView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { PremiumModal } from './components/PremiumModal';
import { Toast } from './components/Toast';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedShow, setSelectedShow] = useState<AnimeShow>(ANIME_SHOWS[0]);
  const [activeEpisode, setActiveEpisode] = useState<Episode | undefined>(
    ANIME_SHOWS[0].episodes[0]
  );
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('All');

  // Watchlist stored in state & localStorage
  const [myList, setMyList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('AniGalnexo_watchlist');
      return saved ? JSON.parse(saved) : ['shadow-of-sakura', 'neon-shinobi'];
    } catch {
      return ['shadow-of-sakura', 'neon-shinobi'];
    }
  });

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Restore a real Supabase session and apply saved appearance preferences globally.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('anigalnexo_settings');
      const prefs = raw ? JSON.parse(raw) : {};
      const root = document.documentElement;
      const accent = typeof prefs.accent === 'string' ? prefs.accent : '#ff7a00';
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent-soft', `color-mix(in srgb, ${accent} 15%, transparent)`);
      root.style.setProperty('--accent-border', `color-mix(in srgb, ${accent} 45%, transparent)`);
      root.style.setProperty('--accent-glow', `color-mix(in srgb, ${accent} 40%, transparent)`);
      root.dataset.theme = prefs.theme === 'darker' ? 'midnight' : 'dark';
    } catch { /* use CSS defaults when preferences are unavailable */ }

    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      const authUser = data.session?.user;
      if (!alive || !authUser) return;
      setCurrentUser({
        id: authUser.id,
        name: (authUser.user_metadata?.full_name as string) || authUser.email?.split('@')[0] || 'AniGalnexo User',
        email: authUser.email || '',
        avatar: (authUser.user_metadata?.avatar_url as string) || DEFAULT_AVATARS.arjun,
        role: 'viewer',
        isPremium: false,
        joinedDate: new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      if (!session?.user) { setCurrentUser(null); return; }
      const authUser = session.user;
      setCurrentUser({
        id: authUser.id,
        name: (authUser.user_metadata?.full_name as string) || authUser.email?.split('@')[0] || 'AniGalnexo User',
        email: authUser.email || '',
        avatar: (authUser.user_metadata?.avatar_url as string) || DEFAULT_AVATARS.arjun,
        role: 'viewer',
        isPremium: false,
        joinedDate: new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  // Modals & Toast State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Watchlist
  useEffect(() => {
    try {
      localStorage.setItem('AniGalnexo_watchlist', JSON.stringify(myList));
    } catch {
      // Local storage fallback
    }
  }, [myList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleMyList = (showId: string) => {
    if (myList.includes(showId)) {
      setMyList(myList.filter((id) => id !== showId));
      showToast('Removed from My Watchlist');
    } else {
      setMyList([...myList, showId]);
      showToast('Added to My Watchlist');
    }
  };

  const handleSelectShow = (show: AnimeShow) => {
    setSelectedShow(show);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handlePlayEpisode = (show: AnimeShow, episode?: Episode) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please log in to watch anime.');
      return;
    }

    setSelectedShow(show);
    setActiveEpisode(episode || show.episodes[0]);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenreFilter(genre);
    setCurrentView('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (_plan: string) => {
    // Never grant paid access until a verified payment provider confirms a transaction.
    setIsPremiumOpen(false);
    showToast('Premium checkout is not connected yet. No payment or subscription was activated.');
  };

  return (
    // <div className="min-h-screen bg-[#11131c] text-[#e1e1ef] font-sans selection:bg-[var(--accent)] selection:text-white">
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Side / Bottom Navigation */}
      <Navbar
        currentView={currentView}

        onNavigate={(view) => {
          if (view === 'community' && !currentUser) {
            setIsAuthOpen(true);
            showToast('Please log in to access the Community.');
            return;
          }

          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}

        currentUser={currentUser}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area (Offset for side navbar on lg) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenPremium={() => setIsPremiumOpen(true)}
          onSelectShow={handleSelectShow}
          onNavigateToStudio={() => {
            setCurrentView('creator-studio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={async () => {
            if (supabase) await supabase.auth.signOut();
            setCurrentUser(null);
            showToast('Signed out of AniGalnexo');
          }}
          onSearchSubmit={(query) => {
            setSelectedGenreFilter('All');
            setCurrentView('discover');
          }}
        />

        {/* View Routing */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 max-w-7xl w-full mx-auto">
          {currentView === 'home' && (
            <HomeView
              onSelectShow={handleSelectShow}
              onPlayEpisode={handlePlayEpisode}
              myList={myList}
              onToggleMyList={handleToggleMyList}
              onNavigateToDiscover={() => {
                setSelectedGenreFilter('All');
                setCurrentView('discover');
              }}
              onNavigateToStudio={() => setCurrentView('creator-studio')}
            />
          )}

          {currentView === 'discover' && (
            <DiscoverView
              onSelectShow={handleSelectShow}
              myList={myList}
              onToggleMyList={handleToggleMyList}
              initialGenre={selectedGenreFilter}
            />
          )}

          {currentView === 'genres' && (
            <GenresView
              onSelectGenre={handleGenreSelect}
              onSelectShow={handleSelectShow}
            />
          )}

          {currentView === 'details' && (
            <ShowDetailsView
              show={selectedShow}
              onBack={() => setCurrentView('home')}
              onPlayEpisode={handlePlayEpisode}
              myList={myList}
              onToggleMyList={handleToggleMyList}
              onSelectShow={handleSelectShow}
              onOpenPremium={() => setIsPremiumOpen(true)}
              onToast={showToast}
            />
          )}

          {currentView === 'player' && (
            <VideoPlayerView
              show={selectedShow}
              initialEpisode={activeEpisode}
              onBack={() => setCurrentView('details')}
              onSelectShow={handleSelectShow}
              myList={myList}
              onToggleMyList={handleToggleMyList}
              onOpenPremium={() => setIsPremiumOpen(true)}
              onToast={showToast}
              onRequireLogin={() => {
                setIsAuthOpen(true);
                showToast('Please log in to watch anime.');
              }}
            />
          )}

          {currentView === 'creator-studio' && (
            <CreatorStudioView onToast={showToast} />
          )}

          {currentView === 'community' && (
            <CommunityView onToast={showToast} />
          )}

          {currentView === 'mylist' && (
            <MyListView
              myList={myList}
              onRemoveFromList={handleToggleMyList}
              onSelectShow={handleSelectShow}
              onNavigateToDiscover={() => setCurrentView('discover')}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              onOpenPremium={() => setIsPremiumOpen(true)}
              onNavigateToStudio={() => setCurrentView('creator-studio')}
              onLogout={async () => {
                if (supabase) await supabase.auth.signOut();
                setCurrentUser(null);
                setCurrentView('home');
                showToast('Signed out of AniGalnexo');
              }}
              onToast={showToast}
            />
          )}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'admin' && currentUser?.role === 'admin' && (
            <AdminDashboardView />
          )}
        </main>
      </div>

      {/* Modals & Toast */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
      />

      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        onSubscribe={handleSubscribe}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <AIChatbot
        isLoggedIn={!!currentUser}
        onRequireLogin={() => {
          setIsAuthOpen(true);
          showToast('Please log in to use AniGalnexo AI.');
        }}
      />
    </div>
  );
}
