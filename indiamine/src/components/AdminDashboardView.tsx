import API_BASE_URL from '../lib/api';
import { ANIME_SHOWS } from '../data/animeData';
import { ProfileView } from './ProfileView';
import { SettingsView } from './SettingsView';
import type { User as UserType } from '../types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  CircleUserRound,
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  AlertCircle,
  Film,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type Stats = {
  total_users: number;
  total_anime: number;
  published_anime: number;
  pending_anime: number;
  draft_anime: number;
};

type Section =
  | 'Overview'
  | 'Users & Creators'
  | 'Anime Management'
  | 'Submissions'
  | 'Reports'
  | 'Settings'
  | 'My Profile';

const navigation: {
  label: Section;
  icon: React.ElementType;
}[] = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Users & Creators', icon: Users },
    { label: 'Anime Management', icon: Clapperboard },
    { label: 'Submissions', icon: FileText },
    { label: 'Reports', icon: Flag },
    { label: 'Settings', icon: Settings },
    { label: 'My Profile', icon: CircleUserRound },
  ];

const numberFormat = (n: number) => n.toLocaleString();

export default function AdminDashboardView() {
  const [section, setSection] = useState<Section>('Overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('Administrator');
  const [avatar, setAvatar] = useState('');
  const adminProfile: UserType = {
    id: 'admin',
    name: name || 'Administrator',
    email: email || '',
    avatar,
    role: 'admin',
    isPremium: false,
    joinedDate: 'Admin',
  };
  const [updatedAt, setUpdatedAt] = useState('');
  const [animeTitle, setAnimeTitle] = useState('');
  const [animeDescription, setAnimeDescription] = useState('');
  const [animePoster, setAnimePoster] = useState('');
  const [animeSaving, setAnimeSaving] = useState(false);

  const loadStats = useCallback(async (manual = false) => {
    if (!supabase) {
      setError('Supabase configuration is missing.');
      setStats(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (manual) setRefreshing(true);
    else setLoading(true);

    setError('');

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const authUser = sessionData.session?.user;

      if (!authUser) {
        throw new Error('Session expired. Sign in again.');
      }

      setEmail(authUser.email ?? '');
      setAvatar(
        (authUser.user_metadata?.avatar_url as string) ||
        (authUser.user_metadata?.picture as string) ||
        ''
      );
      setName(
        (authUser.user_metadata?.full_name as string) ||
        (authUser.user_metadata?.name as string) ||
        authUser.email?.split('@')[0] ||
        'Administrator'
      );

      // Verify that this account is registered as an administrator.
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!admin) {
        throw new Error(
          'Admin access denied. This account is not registered in admin_users.'
        );
      }

      // Counts come from the secure Supabase SQL function.
      const { data, error: rpcError } = await supabase.rpc(
        'admin_dashboard_stats'
      );

      if (rpcError) throw rpcError;

      const result = Array.isArray(data) ? data[0] : data;

      if (!result || typeof result !== 'object') {
        throw new Error('The database returned no valid statistics.');
      }

      const raw = result as Record<string, unknown>;

      const readNumber = (key: keyof Stats): number => {
        const value = raw[key];
        const parsed = typeof value === 'number' ? value : Number(value);

        if (
          value === null ||
          value === undefined ||
          !Number.isFinite(parsed)
        ) {
          throw new Error(`Invalid database value: ${key}`);
        }

        return parsed;
      };

      setStats({
        total_users: readNumber('total_users'),
        total_anime: readNumber('total_anime'),
        published_anime: readNumber('published_anime'),
        pending_anime: readNumber('pending_anime'),
        draft_anime: readNumber('draft_anime'),
      });

      setUpdatedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setStats(null);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load live database data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  const loadAnime = useCallback(async () => {
    if (!supabase) {
      setAnimeError('Supabase is not configured.');
      return;
    }

    setAnimeLoading(true);
    setAnimeError('');

    try {
      const { data, error } = await supabase
        .from('anime')
        .select('id, title, description, poster_url, status, metadata')
        .order('created_at', { ascending: false });

      if (error) {
        setAnimeError(error.message);
        return;
      }

      setDatabaseAnime(data ?? []);
    } catch (error) {
      setAnimeError(
        error instanceof Error ? error.message : 'Failed to load anime.'
      );
    } finally {
      setAnimeLoading(false);
    }
  }, []);
  type AnimeRecord = {
    id: string;
    title: string;
    description: string | null;
    poster_url: string | null;
    status: string;
    metadata?: Record<string, unknown>;
  };

  type LocalVideo = {
    id: string;
    title: string;
    genre?: string;
    synopsis?: string;
    episodesCount?: number;
    status: string;
    uploadedDate?: string;
    originalName?: string;
    thumbnailFile?: string;
    videoFile?: string;
    size?: number;
  };

  const [localVideos, setLocalVideos] = useState<LocalVideo[]>([]);
  const [localVideosLoading, setLocalVideosLoading] = useState(false);
  const [localVideosError, setLocalVideosError] = useState('');

  const [databaseAnime, setDatabaseAnime] = useState<AnimeRecord[]>([]);
  const [animeLoading, setAnimeLoading] = useState(false);
  const [animeError, setAnimeError] = useState('');
  const addAnime = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase || !animeTitle.trim()) return;

    setAnimeSaving(true);
    setAnimeError('');

    try {
      const { error } = await supabase.from('anime').insert({
        title: animeTitle.trim(),
        description: animeDescription.trim(),
        poster_url: animePoster.trim() || null,
        status: 'published',
        metadata: {},
      });

      if (error) {
        setAnimeError(error.message);
        return;
      }

      setAnimeTitle('');
      setAnimeDescription('');
      setAnimePoster('');

      await loadAnime();
      await loadStats(true);
    } catch (error) {
      setAnimeError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setAnimeSaving(false);
    }
  };

  const loadLocalVideos = useCallback(async () => {
    setLocalVideosLoading(true);
    setLocalVideosError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/videos`);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: LocalVideo[] = await response.json();
      setLocalVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      setLocalVideosError(
        error instanceof Error
          ? error.message
          : 'Could not load uploaded videos.'
      );
    } finally {
      setLocalVideosLoading(false);
    }
  }, []);


  const updateLocalVideoStatus = async (
    id: string,
    status: 'Live' | 'Rejected'
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/videos/${encodeURIComponent(id)}/status`
        , {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Status update failed.');
      }

      await loadLocalVideos();
      window.alert(
        status === 'Live'
          ? 'Video approved and marked Live.'
          : 'Video rejected.'
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Could not update video status.'
      );
    }
  };


  useEffect(() => {
    void loadStats();
    void loadAnime();
    void loadLocalVideos();

    const onFocus = () => void loadStats(true);
    window.addEventListener('focus', onFocus);

    const channel = supabase
      ?.channel('anigalnexo-admin-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'anime' },
        () => void loadStats(true)
      )
      .subscribe();

    return () => {
      window.removeEventListener('focus', onFocus);
      if (channel && supabase) {
        void supabase.removeChannel(channel);
      }
    };
  }, [loadStats, loadAnime, loadLocalVideos]);

  const signOut = async () => {
    if (!supabase) return;

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    window.location.reload();
  };

  const cards = [
    {
      label: 'Registered Users',
      value: stats?.total_users,
      detail: 'Accounts in Supabase Auth',
      icon: Users,
      color: 'text-orange-400',
      background: 'bg-orange-500/10',
    },
    {
      label: 'Total Anime',
      value: stats?.total_anime,
      detail: 'Records in anime database',
      icon: Film,
      color: 'text-violet-300',
      background: 'bg-violet-500/10',
    },
    {
      label: 'Published Anime',
      value: stats?.published_anime,
      detail: 'Published database records',
      icon: Clapperboard,
      color: 'text-emerald-300',
      background: 'bg-emerald-500/10',
    },
    {
      label: 'Pending Anime',
      value: stats?.pending_anime,
      detail: 'Awaiting review',
      icon: FileText,
      color: 'text-amber-300',
      background: 'bg-amber-500/10',
    },
  ];

  const visibleNavigation = navigation.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectSection = (next: Section) => {
    setSection(next);
    setMenuOpen(false);
    setProfileOpen(false);
    setSearch('');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#101117] text-slate-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/[0.08] bg-[#191a22] transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/[0.08] px-4">

          <button
            onClick={() => selectSection('Overview')}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img
                src="/logo.png"
                alt="AniGalnexo Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Clapperboard size={22} className="text-orange-400" />
            </span>

            <span>
              <span className="block text-lg font-extrabold text-white">
                Ani<span className="text-[var(--accent)]">Galnexo</span>
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-slate-500">
                ADMIN CONSOLE
              </span>
            </span>
          </button>

          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 pt-6">
          <p className="px-3 pb-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = section === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => selectSection(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active
                    ? 'border border-orange-500/20 bg-orange-500/10 font-semibold text-orange-400'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight size={15} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-3">
          <div className="rounded-xl border border-white/[0.08] bg-[#20212a] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-400">
              <ShieldCheck size={17} />
              Admin workspace
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Connected to your authenticated AniGalnexo account.
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 border-t border-white/[0.08] px-2 pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15 font-bold text-orange-300">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {name}
              </p>
              <p className="truncate text-xs text-slate-500">
                Verified admin
              </p>
            </div>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Top bar and page */}
      <div className="min-w-0 lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-white/[0.08] bg-[#101117]/95 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </button>

          <div className="relative hidden max-w-[480px] flex-1 sm:block">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search admin sections..."
              className="w-full rounded-full border border-white/10 bg-[#191a22] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500/50"
            />

            {search && (
              <div className="absolute left-0 right-0 top-12 rounded-xl border border-white/10 bg-[#191a22] p-2 shadow-xl">
                {visibleNavigation.length ? (
                  visibleNavigation.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => selectSection(item.label)}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
                    >
                      {item.label}
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-sm text-slate-500">
                    No matching sections
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 sm:hidden" />

          <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 px-3 py-2 text-xs text-emerald-300 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Admin
          </span>

          <button
            onClick={() => void loadStats(true)}
            disabled={loading || refreshing}
            className="rounded-xl border border-white/10 p-2.5 text-slate-300 hover:bg-white/5 disabled:opacity-50"
            title="Refresh live data"
          >
            <RefreshCw
              size={17}
              className={refreshing ? 'animate-spin' : ''}
            />
          </button>

          <button
            onClick={() => selectSection('Reports')}
            className="relative rounded-xl border border-white/10 p-2.5 text-slate-300 hover:bg-white/5"
            title="Reports"
          >
            <Bell size={17} />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className="flex max-w-[180px] items-center gap-2 rounded-full border border-white/10 bg-[#191a22] py-1.5 pl-1.5 pr-3 hover:bg-white/5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-300">
                {name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[95px] truncate text-xs font-semibold text-white">
                  {name}
                </span>
                <span className="block text-[10px] text-slate-500">
                  Administrator
                </span>
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border border-white/10 bg-[#1b1c25] p-2 shadow-xl">
                <div className="border-b border-white/10 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-white">
                    {name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{email}</p>
                </div>
                <button
                  onClick={() => selectSection('My Profile')}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5"
                >
                  <CircleUserRound size={16} />
                  My Profile
                </button>
                <button
                  onClick={() => selectSection('Settings')}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 xl:p-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <span>Admin</span>
                <ChevronRight size={13} />
                <span className="text-slate-300">{section}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {section}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {section === 'Overview'
                  ? 'Live platform statistics from your database.'
                  : section === 'Users & Creators'
                    ? 'Registered accounts in Supabase Auth.'
                    : section === 'Anime Management'
                      ? 'Anime records stored in the database.'
                      : section === 'Submissions'
                        ? 'Submission management.'
                        : section === 'Reports'
                          ? 'Platform reports.'
                          : section === 'Settings'
                            ? 'Administrator settings.'
                            : 'Your signed-in account information.'
                }
              </p>
            </div>

            {updatedAt && (
              <p className="text-xs text-slate-500">
                Last updated: {updatedAt}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Live data unavailable</p>
                <p className="mt-1 break-words">{error}</p>
                <p className="mt-2 text-red-100/70">
                  Check the SQL function and your admin_users record.
                </p>
              </div>
            </div>
          )}

          {section === 'Overview' && (
            <>
              {loading && !stats ? (
                <div className="rounded-2xl border border-white/10 bg-[#191a22] p-6 text-sm text-slate-400">
                  Loading live database data…
                </div>
              ) : stats ? (
                <>
                  <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    {cards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <section
                          key={card.label}
                          className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#191a22] p-5 transition hover:border-white/15"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm text-slate-400">
                                {card.label}
                              </p>
                              <p className="mt-3 break-words text-3xl font-bold tracking-tight text-white">
                                {numberFormat(card.value!)}
                              </p>
                              <p className="mt-2 text-xs text-slate-500">
                                {card.detail}
                              </p>
                            </div>
                            <span
                              className={`rounded-xl p-3 ${card.background} ${card.color}`}
                            >
                              <Icon size={21} />
                            </span>
                          </div>
                        </section>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#191a22] p-5 xl:col-span-2">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-orange-400" />
                        <h2 className="font-semibold text-white">
                          Platform activity
                        </h2>
                      </div>
                      <div className="mt-5 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                        <Activity
                          className="mx-auto text-slate-600"
                          size={26}
                        />
                        <p className="mt-3 text-sm font-medium text-slate-300">
                          No activity data yet
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Activity will appear when real events are recorded.
                        </p>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-white/[0.08] bg-[#191a22] p-5">
                      <h2 className="font-semibold text-white">
                        Anime status
                      </h2>
                      <div className="mt-4 space-y-3">
                        {[
                          ['Published', stats.published_anime],
                          ['Pending', stats.pending_anime],
                          ['Drafts', stats.draft_anime],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3"
                          >
                            <span className="text-sm text-slate-400">
                              {label}
                            </span>
                            <span className="font-semibold text-white">
                              {numberFormat(Number(value))}
                            </span>
                          </div>
                        ))}
                      </div>
                      {stats.total_anime === 0 && (
                        <p className="mt-4 text-xs leading-5 text-slate-500">
                          No anime records are stored in the database yet.
                          Existing hardcoded anime must be migrated before
                          this count includes the website catalogue.
                        </p>
                      )}
                    </section>
                  </div>
                </>
              ) : (
                !error && (
                  <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">
                    No dashboard data available.
                  </p>
                )
              )}
            </>
          )}

          {section === 'Users & Creators' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <Users className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Registered users
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {stats
                  ? `${numberFormat(stats.total_users)} registered accounts.`
                  : 'Live user count is unavailable until the database query succeeds.'}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Private account details are not exposed in this summary.
              </p>
            </section>
          )}


          {section === 'Anime Management' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Anime catalogue</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {ANIME_SHOWS.length + databaseAnime.length} catalogue entries
                    </p>
                  </div>
                  <button
                    onClick={() => void loadAnime()}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
                  >
                    Refresh
                  </button>
                </div>
              </section>

              <form
                onSubmit={(event) => void addAnime(event)}
                className="space-y-3 rounded-2xl border border-white/10 bg-[#191a22] p-6"
              >
                <h3 className="font-semibold text-white">Add anime to Supabase</h3>
                <input
                  required
                  value={animeTitle}
                  onChange={(event) => setAnimeTitle(event.target.value)}
                  placeholder="Anime title"
                  className="w-full rounded-lg border border-white/10 bg-[#101117] p-3 text-white"
                />
                <textarea
                  required
                  value={animeDescription}
                  onChange={(event) => setAnimeDescription(event.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-white/10 bg-[#101117] p-3 text-white"
                />
                <input
                  value={animePoster}
                  onChange={(event) => setAnimePoster(event.target.value)}
                  placeholder="Poster image URL (optional)"
                  className="w-full rounded-lg border border-white/10 bg-[#101117] p-3 text-white"
                />
                <button
                  disabled={animeSaving}
                  className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
                >
                  {animeSaving ? 'Saving...' : 'Add anime'}
                </button>
                {animeError && (
                  <p className="break-words text-sm text-red-300">{animeError}</p>
                )}
              </form>

              {animeLoading && (
                <p className="text-sm text-slate-400">Loading database anime...</p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {ANIME_SHOWS.map((anime) => (
                  <article
                    key={`local-${anime.id}`}
                    className="overflow-hidden rounded-xl border border-white/10 bg-[#191a22]"
                  >
                    <img
                      src={anime.posterImage}
                      alt={anime.title}
                      className="h-52 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-white">{anime.title}</h3>
                      <p className="mt-1 text-xs text-orange-300">Existing catalogue</p>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                        {anime.description}
                      </p>
                    </div>
                  </article>
                ))}

                {databaseAnime
                  .filter(
                    (item) =>
                      !ANIME_SHOWS.some(
                        (local) =>
                          local.title.trim().toLowerCase() ===
                          item.title.trim().toLowerCase()
                      )
                  )
                  .map((anime) => (
                    <article
                      key={`db-${anime.id}`}
                      className="overflow-hidden rounded-xl border border-white/10 bg-[#191a22]"
                    >
                      {anime.poster_url ? (
                        <img
                          src={anime.poster_url}
                          alt={anime.title}
                          className="h-52 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-52 items-center justify-center bg-white/5">
                          <Clapperboard size={32} className="text-slate-500" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-white">{anime.title}</h3>
                        <p className="mt-1 text-xs text-emerald-300">Supabase</p>
                        <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                          {anime.description}
                        </p>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          )}

          {section === 'Submissions' && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Uploaded videos
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Videos received by your local upload server.
                  </p>
                </div>

                <button
                  onClick={() => void loadLocalVideos()}
                  disabled={localVideosLoading}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
                >
                  {localVideosLoading ? 'Refreshing...' : 'Refresh videos'}
                </button>
              </div>

              {localVideosError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {localVideosError}
                  <p className="mt-1 text-xs">
                    Check that the local server is running on port 4000.
                  </p>
                </div>
              )}

              {localVideosLoading && localVideos.length === 0 && (
                <p className="text-sm text-slate-400">Loading uploaded videos...</p>
              )}

              {!localVideosLoading &&
                !localVideosError &&
                localVideos.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-[#191a22] p-8 text-center">
                    <Film className="mx-auto text-slate-500" size={30} />
                    <p className="mt-3 font-medium text-white">No uploaded videos found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Upload a video in Creator Studio, then refresh this section.
                    </p>
                  </div>
                )}

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {localVideos.map((video) => (
                  <article
                    key={video.id}
                    className="flex min-w-0 gap-4 rounded-2xl border border-white/10 bg-[#191a22] p-4"
                  >
                    {video.thumbnailFile ? (
                      <img
                        src={`http://127.0.0.1:4000/api/thumbnails/${encodeURIComponent(video.thumbnailFile)}`}
                        alt={video.title}
                        className="h-28 w-20 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <Film size={28} className="text-slate-500" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold text-white">
                        {video.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {video.genre || 'Uncategorized'}
                        {' · '}
                        {Number(video.episodesCount) || 1} episode(s)
                      </p>

                      <p className="mt-2 break-words text-xs text-slate-500">
                        {video.originalName || video.videoFile || 'Video file saved locally'}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={
                            video.status?.toLowerCase() === 'live' ||
                              video.status?.toLowerCase() === 'published'
                              ? 'rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300'
                              : 'rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300'
                          }
                        >
                          {video.status || 'Pending'}
                        </span>

                        {video.uploadedDate && (
                          <span className="text-xs text-slate-500">
                            {new Date(video.uploadedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {video.status?.toLowerCase() !== 'live' &&
                        video.status?.toLowerCase() !== 'published' && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => void updateLocalVideoStatus(video.id, 'Live')}
                              className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25"
                            >
                              Approve & Publish
                            </button>

                            <button
                              onClick={() => void updateLocalVideoStatus(video.id, 'Rejected')}
                              className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                      <p className="mt-3 break-words text-xs text-slate-400">
                        {video.synopsis || 'No synopsis provided.'}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === 'Reports' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <Flag className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Reports
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                No reports table has been connected to this view yet.
              </p>
            </section>
          )}

          {section === 'Settings' && <SettingsView />}
          {/* {section === 'Settings' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <Settings className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Admin settings
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Signed in as {email || 'your admin account'}.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Platform-wide settings are not saved because no settings
                table has been configured.
              </p>
            </section>
          )} */}

          {section === 'My Profile' && (
            <ProfileView
              currentUser={adminProfile}
              onOpenPremium={() => {
                setSection('Settings');
              }}
              onNavigateToStudio={() => {
                setSection('Anime Management');
              }}
              onLogout={async () => {
                if (!supabase) {
                  window.location.reload();
                  return;
                }

                const { error } = await supabase.auth.signOut();

                if (error) {
                  console.error('Sign out failed:', error.message);
                  return;
                }

                window.location.reload();
              }}
              onToast={(msg) => window.alert(msg)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
