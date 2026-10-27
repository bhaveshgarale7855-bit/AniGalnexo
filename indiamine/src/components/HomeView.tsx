import React, { useState } from 'react';
import {
  Play,
  Plus,
  Check,
  Star,
  Flame,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AnimeShow, Episode } from '../types';
import { ANIME_SHOWS } from '../data/animeData';

interface HomeViewProps {
  onSelectShow: (show: AnimeShow) => void;
  onPlayEpisode: (show: AnimeShow, episode?: Episode) => void;
  myList: string[];
  onToggleMyList: (showId: string) => void;
  onNavigateToDiscover: () => void;
  onNavigateToStudio: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectShow,
  onPlayEpisode,
  myList,
  onToggleMyList,
  onNavigateToDiscover,
  onNavigateToStudio,
}) => {
  // Hero Show is the flagship original "Shadow of Sakura"
  const heroShow = ANIME_SHOWS[0];
  const isInMyList = myList.includes(heroShow.id);
  const [heroEpIndex] = useState(2); // Ep 3 "Crimson Petals Fall"

  const continueWatchingEpisodes = [
    {
      show: ANIME_SHOWS[0],
      episode: ANIME_SHOWS[0].episodes[2], // S1 E3
      progress: 45,
      timeLeft: '13m left',
    },
    {
      show: ANIME_SHOWS[1],
      episode: ANIME_SHOWS[1].episodes[0], // Moonlit Warriors
      progress: 100,
      timeLeft: 'Finished',
    },
  ];

  return (
    <div className="space-y-12 pb-24 lg:pb-16 animate-in fade-in duration-300">
      {/* Grand Hero Banner (Shadow of Sakura) */}
      <div className="relative w-full min-h-[480px] lg:min-h-[580px] rounded-3xl overflow-hidden glass-card border border-white/10 group">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={heroShow.bannerImage}
            alt={heroShow.title}
            className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#11131c] via-[#11131c]/70 to-transparent w-full lg:w-3/4" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent-glow),transparent_50%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col justify-end min-h-[480px] lg:min-h-[580px] max-w-3xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <span className="px-3 py-1 rounded-full bg-[var(--accent)] text-white font-extrabold text-[11px] tracking-wider uppercase shadow-[0_0_12px_var(--accent-glow)]">
              #1 Trending Original
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#e1e1ef] text-[12px] font-semibold flex items-center gap-1.5 border border-white/10">
              <Star className="w-3.5 h-3.5 text-[var(--accent)] fill-amber-400" />
              <span>{heroShow.rating}</span>
            </span>
            <span className="text-[12px] text-[#e0c0af]/80 font-medium">
              {heroShow.year} • {heroShow.releaseSeason}
            </span>
            <span className="text-[11px] font-bold text-[var(--accent)] px-2 py-0.5 rounded bg-white/5 border border-[var(--accent)]/30">
              4K Ultra HD
            </span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight text-shadow-glow">
            {heroShow.title}
          </h1>
          <p className="text-[14px] text-[var(--accent)] font-medium tracking-wide mt-1">
            {heroShow.japaneseTitle}
          </p>

          {/* Synopsis */}
          <p className="text-[14px] sm:text-[15px] text-[#e0c0af] mt-4 line-clamp-3 leading-relaxed max-w-2xl">
            {heroShow.description}
          </p>

          {/* Genres Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {heroShow.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[12px] font-medium text-[#e0c0af]"
              >
                {g}
              </span>
            ))}
            {heroShow.tags?.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-md bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[12px] font-medium text-[var(--accent)]"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mt-7">
            <button
              onClick={() => onPlayEpisode(heroShow, heroShow.episodes[heroEpIndex])}
              className="px-7 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[15px] flex items-center gap-2.5 shadow-[0_0_20px_var(--accent-glow)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Watch Now • S1 E3</span>
            </button>

            <button
              onClick={() => onToggleMyList(heroShow.id)}
              className={`px-5 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all duration-200 border ${
                isInMyList
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              {isInMyList ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>My List</span>
                </>
              )}
            </button>

            <button
              onClick={() => onSelectShow(heroShow)}
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0c0af] hover:text-white font-bold text-[14px] flex items-center gap-2 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Episodes & Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Continue Watching Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-white tracking-tight">
              Continue Watching
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {continueWatchingEpisodes.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onPlayEpisode(item.show, item.episode)}
              className="group relative bg-[#191b24]/80 border border-white/10 rounded-2xl overflow-hidden p-3 hover:border-[var(--accent)]/50 transition-all cursor-pointer flex gap-4 items-center"
            >
              <div className="relative w-36 h-22 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                <img
                  src={item.episode.thumbnail}
                  alt={item.episode.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                  <div
                    className="h-full bg-[var(--accent)]"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider">
                  S1 E{item.episode.episodeNumber}
                </span>
                <h4 className="text-[14px] font-bold text-white truncate group-hover:text-[var(--accent)] transition-colors">
                  {item.episode.title}
                </h4>
                <p className="text-[12px] text-[#e0c0af]/70 truncate">{item.show.title}</p>
                <span className="text-[11px] text-[#e0c0af]/50 mt-1 block">{item.timeLeft}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Indian Anime Originals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-white tracking-tight">
              Trending Shows
            </h2>
          </div>
          <button
            onClick={onNavigateToDiscover}
            className="text-[13px] font-bold text-[var(--accent)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ANIME_SHOWS.slice(0, 5).map((show) => (
            <div
              key={show.id}
              onClick={() => onSelectShow(show)}
              className="group relative bg-[#191b24]/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--accent)]/60 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Poster Image Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
                <img
                  src={show.posterImage}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {show.isOriginal && (
                    <span className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-white text-[10px] font-extrabold uppercase shadow-sm">
                      Original
                    </span>
                  )}
                  {show.isPremium && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-extrabold uppercase shadow-sm">
                      VIP
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-[var(--accent)] fill-amber-400" />
                  <span>{show.rating}</span>
                </div>

                {/* Hover Quick Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-[0_0_15px_var(--accent)] transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline font-bold text-[14px] text-white truncate group-hover:text-[var(--accent)] transition-colors">
                    {show.title}
                  </h3>
                  <p className="text-[12px] text-[#e0c0af]/70 truncate mt-0.5">
                    {show.genres.slice(0, 2).join(' • ')}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#e0c0af]/50 mt-2.5 pt-2 border-t border-white/5">
                  <span>{show.year}</span>
                  <span>{show.totalViews || '1.2M'} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top 10 Indian Originals Row with big ordinal numerals */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-white tracking-tight">
            Top 10 in India Today
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-2">
          {ANIME_SHOWS.map((show, idx) => (
            <div
              key={show.id}
              onClick={() => onSelectShow(show)}
              className="flex-shrink-0 w-64 group relative bg-[#191b24]/70 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--accent)]/50 transition-all cursor-pointer p-2.5"
            >
              <div className="relative flex items-center">
                {/* Big Number */}
                <span className="font-headline font-black text-6xl text-[#191b24] select-none stroke-num -ml-1 text-stroke tracking-tighter"
                      style={{ WebkitTextStroke: '2px var(--accent-glow)', color: '#11131c' }}>
                  {idx + 1}
                </span>
                {/* Poster */}
                <div className="relative w-32 aspect-[2/3] rounded-xl overflow-hidden ml-auto shadow-xl">
                  <img
                    src={show.posterImage}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              </div>

              <div className="mt-2.5 px-1">
                <h4 className="font-bold text-[14px] text-white truncate group-hover:text-[var(--accent)] transition-colors">
                  {show.title}
                </h4>
                <p className="text-[12px] text-[#e0c0af]/60 truncate">
                  {show.genres.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Creator Studio Showcase Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#191b24] via-[#241c2c] to-[#191b24] border border-[var(--accent)]/30 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_0_30px_var(--accent-glow)]">
        <div className="space-y-2 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-[12px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Empowering Indian Animators</span>
          </div>
          <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-white">
            Publish Your Own Anime with AniGalnexo Studio
          </h3>
          <p className="text-[14px] text-[#e0c0af] leading-relaxed">
            Distribute to millions of passionate anime fans, keep 85% creator revenue share, and
            access industry-standard dubbing pipelines.
          </p>
        </div>

        <button
          onClick={onNavigateToStudio}
          className="px-6 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[14px] flex items-center gap-2 shadow-[0_0_20px_var(--accent-glow)] hover:scale-105 transition-transform flex-shrink-0"
        >
          <span>Open Creator Dashboard</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
