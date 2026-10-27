import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Lock,
  Heart,
  Share2,
  ShieldAlert,
  UserCheck,
  UserPlus,
  ChevronDown,
  Sparkles,
  Crown,
} from 'lucide-react';
import { AnimeShow, Episode } from '../types';
import { ANIME_SHOWS } from '../data/animeData';

interface ShowDetailsViewProps {
  show: AnimeShow;
  onBack: () => void;
  onPlayEpisode: (show: AnimeShow, episode?: Episode) => void;
  myList: string[];
  onToggleMyList: (showId: string) => void;
  onSelectShow: (show: AnimeShow) => void;
  onOpenPremium: () => void;
  onToast: (msg: string) => void;
}

export const ShowDetailsView: React.FC<ShowDetailsViewProps> = ({
  show,
  onBack,
  onPlayEpisode,
  myList,
  onToggleMyList,
  onSelectShow,
  onOpenPremium,
  onToast,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [isFollowingCreator, setIsFollowingCreator] = useState<boolean>(
    show.creator?.isFollowing ?? true
  );
  const [showAllEpisodes, setShowAllEpisodes] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const isInMyList = myList.includes(show.id);
  const moreLikeThis = ANIME_SHOWS.filter((s) => s.id !== show.id).slice(0, 5);

  const displayedEpisodes = showAllEpisodes
    ? show.episodes
    : show.episodes.slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onToast(`Link to ${show.title} copied to clipboard!`);
  };

  const handleToggleFollow = () => {
    setIsFollowingCreator(!isFollowingCreator);
    onToast(
      !isFollowingCreator
        ? `You are now following ${show.creator?.name}`
        : `Unfollowed ${show.creator?.name}`
    );
  };

  return (
    <div className="space-y-10 pb-24 lg:pb-16 animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0c0af] hover:text-white transition-all font-semibold text-[13px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              onToast(!isLiked ? 'Added to your favorites' : 'Removed from favorites');
            }}
            className={`p-2.5 rounded-xl border transition-all ${
              isLiked
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-white/5 border-white/10 text-[#e0c0af] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0c0af] hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Showcase Container */}
      <div className="relative w-full rounded-3xl overflow-hidden glass-card border border-white/10">
        {/* Backdrop Banner */}
        <div className="relative h-72 sm:h-96 lg:h-[440px] w-full overflow-hidden">
          <img
            src={show.bannerImage}
            alt={show.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/70 to-black/30" />
        </div>

        {/* Content Floating inside Banner */}
        <div className="relative px-6 sm:px-10 pb-8 -mt-36 sm:-mt-44 z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Left Poster Card */}
          <div className="w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 flex-shrink-0 relative group bg-black/60">
            <img
              src={show.posterImage}
              alt={show.title}
              className="w-full h-full object-cover"
            />
            {show.isPremium && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[var(--accent)] text-black text-[11px] font-extrabold uppercase shadow-lg flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                VIP Original
              </div>
            )}
            {/* 45% completion indicator on poster */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-2.5 border-t border-white/10">
              <div className="flex justify-between text-[11px] font-bold text-[var(--accent)] mb-1">
                <span>Progress</span>
                <span>45% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-[var(--accent)]" />
              </div>
            </div>
          </div>

          {/* Right Show Title & Meta */}
          <div className="flex-1 pt-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {show.isOriginal && (
                <span className="px-3 py-1 rounded-full bg-[var(--accent)] text-white font-extrabold text-[11px] uppercase shadow-[0_0_12px_var(--accent-glow)]">
                  AniGalnexo Original
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[12px] font-semibold flex items-center gap-1 border border-white/10">
                <Star className="w-3.5 h-3.5 text-[var(--accent)] fill-amber-400" />
                <span>{show.rating} Rating</span>
              </span>
              <span className="text-[13px] text-[#e0c0af]/80 font-medium">
                {show.year} • {show.releaseSeason || 'Original Season'}
              </span>
            </div>

            <h1 className="font-headline text-3xl sm:text-5xl font-black text-white tracking-tight">
              {show.title}
            </h1>
            {show.japaneseTitle && (
              <p className="text-[15px] text-[var(--accent)] font-medium tracking-wide">
                {show.japaneseTitle}
              </p>
            )}

            <p className="text-[14px] sm:text-[15px] text-[#e0c0af] leading-relaxed max-w-3xl">
              {show.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onPlayEpisode(show, show.episodes[2] || show.episodes[0])}
                className="px-8 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[15px] flex items-center gap-2.5 shadow-[0_0_20px_var(--accent-glow)] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Continue Watching S1 E3</span>
              </button>

              <button
                onClick={() => onToggleMyList(show.id)}
                className={`px-6 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all border ${
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
                    <span>Add to My List</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Episodes on Left + Bento Info on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Episode List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-headline text-2xl font-bold text-white tracking-tight">
                Episodes
              </h2>
              {/* Season Selector */}
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-[#191b24] border border-white/15 text-white text-[13px] font-bold rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value={1}>Season 1 (5 Episodes)</option>
                  <option value={2}>Season 2 (Upcoming)</option>
                </select>
              </div>
            </div>

            <span className="text-[13px] text-[#e0c0af]/70">
              {show.episodes.length} Available
            </span>
          </div>

          {/* Episode Cards */}
          <div className="space-y-3.5">
            {displayedEpisodes.map((ep) => {
              const isLocked = ep.isPremium && !ep.isWatched && ep.episodeNumber > 3;

              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    if (isLocked) {
                      onOpenPremium();
                    } else {
                      onPlayEpisode(show, ep);
                    }
                  }}
                  className={`group relative p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                    ep.isWatching
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 shadow-[0_0_15px_var(--accent-glow)]'
                      : 'bg-[#191b24]/60 border-white/10 hover:bg-[#191b24] hover:border-white/20'
                  }`}
                >
                  {/* Thumbnail with overlay status */}
                  <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Play/Lock overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      {isLocked ? (
                        <div className="w-10 h-10 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-lg">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                            ep.isWatching ? 'bg-[var(--accent)] text-white' : 'bg-white/90 text-black'
                          }`}
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white">
                      {ep.duration}
                    </div>

                    {/* Watched Progress bar */}
                    {ep.watchedPercentage !== undefined && ep.watchedPercentage > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                        <div
                          className="h-full bg-[var(--accent)]"
                          style={{ width: `${ep.watchedPercentage}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Episode Meta */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-extrabold text-[var(--accent)] uppercase tracking-wider">
                        Episode {ep.episodeNumber}
                      </span>
                      {ep.isWatching && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-bold">
                          Now Watching
                        </span>
                      )}
                      {ep.isWatched && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Watched
                        </span>
                      )}
                      {isLocked && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3" /> VIP Only
                        </span>
                      )}
                    </div>

                    <h4 className="font-headline font-bold text-[16px] text-white group-hover:text-[var(--accent)] transition-colors truncate">
                      {ep.title}
                    </h4>

                    <p className="text-[13px] text-[#e0c0af]/80 line-clamp-2 leading-relaxed">
                      {ep.synopsis}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load Remaining Episodes Button */}
          {show.episodes.length > 4 && !showAllEpisodes && (
            <button
              onClick={() => setShowAllEpisodes(true)}
              className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0c0af] hover:text-white font-bold text-[13px] transition-colors flex items-center justify-center gap-2"
            >
              <span>Load Remaining Episodes (5-{show.episodes.length})</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right 4 Cols: Bento Details, Creator Profile, Community Score */}
        <div className="lg:col-span-4 space-y-6">
          {/* About this Anime */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-headline font-bold text-lg text-white">About this Anime</h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <span className="text-[#e0c0af]/60 block text-[11px] uppercase font-bold tracking-wider">
                  Studio
                </span>
                <span className="text-white font-medium">{show.studio}</span>
              </div>

              <div>
                <span className="text-[#e0c0af]/60 block text-[11px] uppercase font-bold tracking-wider">
                  Director
                </span>
                <span className="text-white font-medium">{show.director}</span>
              </div>

              <div>
                <span className="text-[#e0c0af]/60 block text-[11px] uppercase font-bold tracking-wider">
                  Main Cast / Voice
                </span>
                <span className="text-white font-medium">{show.cast.join(', ')}</span>
              </div>

              <div>
                <span className="text-[#e0c0af]/60 block text-[11px] uppercase font-bold tracking-wider">
                  Licence Status
                </span>
                <span className="text-[#00f4fe] font-semibold">
                  Original License (Expires in {show.licenseExpiresDays} days)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => onToast('Report received. Our moderation team will review.')}
                className="flex items-center gap-2 text-[12px] text-[#e0c0af]/60 hover:text-rose-400 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report Content or Audio Issue</span>
              </button>
            </div>
          </div>

          {/* Creator Profile Bento Card */}
          {show.creator && (
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider">
                  Featured Creator
                </span>
                {show.creator.verified && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00f4fe]/20 text-[#00f4fe] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Verified Artist
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={show.creator.avatar}
                  alt={show.creator.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[var(--accent)]/50"
                />
                <div>
                  <h4 className="font-headline font-bold text-[16px] text-white">
                    {show.creator.name}
                  </h4>
                  <p className="text-[12px] text-[#e0c0af]/70">{show.creator.role}</p>
                  <p className="text-[11px] text-[var(--accent)] font-medium mt-0.5">
                    {show.creator.followersCount.toLocaleString()} Followers • {show.creator.worksCount} Works
                  </p>
                </div>
              </div>

              <blockquote className="text-[12px] italic text-[#e0c0af]/90 border-l-2 border-[var(--accent)] pl-3 py-1">
                {show.creator.quote}
              </blockquote>

              <button
                onClick={handleToggleFollow}
                className={`w-full py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all ${
                  isFollowingCreator
                    ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                    : 'bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white shadow-[0_0_15px_var(--accent-glow)]'
                }`}
              >
                {isFollowingCreator ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>+ Follow Creator</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Community Score Bento Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#e0c0af]/60 uppercase tracking-wider block">
                Community Sentiment
              </span>
              <h4 className="font-headline text-2xl font-black text-white mt-1">
                {show.communityScore}% Loved it
              </h4>
              <p className="text-[12px] text-[#e0c0af]/70 mt-0.5">
                Based on 14,800+ viewer ratings
              </p>
            </div>

            {/* Circular Progress Meter */}
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--accent)]"
                  strokeDasharray={`${show.communityScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Heart className="w-5 h-5 text-[var(--accent)] fill-current absolute" />
            </div>
          </div>
        </div>
      </div>

      {/* "More Like This" Carousel */}
      <section className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="font-headline text-2xl font-bold text-white tracking-tight">
          More Like This
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {moreLikeThis.map((otherShow) => (
            <div
              key={otherShow.id}
              onClick={() => {
                onSelectShow(otherShow);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative bg-[#191b24]/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--accent)]/60 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
                <img
                  src={otherShow.posterImage}
                  alt={otherShow.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-[var(--accent)] fill-amber-400" />
                  <span>{otherShow.rating}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h4 className="font-headline font-bold text-[14px] text-white truncate group-hover:text-[var(--accent)] transition-colors">
                  {otherShow.title}
                </h4>
                <p className="text-[11px] text-[#e0c0af]/60 truncate mt-0.5">
                  {otherShow.genres.slice(0, 2).join(' • ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
