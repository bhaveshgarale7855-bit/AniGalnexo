import React, { useState, useMemo, useEffect } from 'react';
import { getLiveVideos, getVideoPlaybackUrl, getThumbnailUrl } from '../lib/videos';
import {
  Search,
  Filter,
  Star,
  Play,
  Plus,
  Check,
  Crown,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { AnimeShow } from '../types';
import { ANIME_SHOWS } from '../data/animeData';


interface UploadedVideo {
  id: string;
  title: string;
  genre?: string;
  synopsis?: string;
  videoPath: string;
  thumbnailPath: string | null;
  status: 'Pending' | 'Live' | 'Rejected';
  uploadedDate?: string;
  episodesCount?: number;
}

const getVideoGenres = (genre?: string): string[] =>
  (genre || 'Other')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const uploadedVideoToShow = (
  video: UploadedVideo,
  streamUrl: string,
  thumbnailUrl?: string
): AnimeShow => ({
  id: `upload-${video.id}`,
  title: video.title,
  japaneseTitle: undefined,
  bannerImage: thumbnailUrl || ANIME_SHOWS[0].bannerImage,
  posterImage: thumbnailUrl || ANIME_SHOWS[0].posterImage,
  rating: 0,
  year: video.uploadedDate
    ? new Date(video.uploadedDate).getFullYear()
    : new Date().getFullYear(),
  releaseSeason: 'Community Upload',
  genres: getVideoGenres(video.genre),
  tags: ['Community'],
  description: video.synopsis || 'Community-uploaded anime.',
  studio: 'Community Creator',
  director: 'Community Creator',
  cast: [],
  licenseExpiresDays: 0,
  communityScore: 0,
  creator: ANIME_SHOWS[0].creator,
  episodes: [
    {
      id: `episode-${video.id}`,
      episodeNumber: 1,
      title: video.title,
      duration: 'Full video',
      durationSeconds: 0,
      thumbnail: thumbnailUrl || ANIME_SHOWS[0].posterImage,
      synopsis: video.synopsis || video.title,
      videoSrc: streamUrl,
    },
  ],
  isOriginal: false,
  isPremium: false,
  totalViews: '0',
});

interface DiscoverViewProps {
  onSelectShow: (show: AnimeShow) => void;
  myList: string[];
  onToggleMyList: (showId: string) => void;
  initialGenre?: string;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onSelectShow,
  myList,
  onToggleMyList,
  initialGenre = 'All',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<'Popular' | 'Newest' | 'A-Z'>('Popular');
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [uploadedShowsData, setUploadedShowsData] = useState<AnimeShow[]>([]);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadVideos = async () => {
      try {
        const videos = await getLiveVideos();

        const mappedVideos = await Promise.all(
          videos.map(async (video) => {
            const [streamUrl, thumbnailUrl] = await Promise.all([
              getVideoPlaybackUrl(video.videoPath),
              video.thumbnailPath
                ? getThumbnailUrl(video.thumbnailPath).catch(() => undefined)
                : Promise.resolve(undefined),
            ]);

            return {
              video: {
                id: video.id,
                title: video.title,
                genre: video.genre,
                synopsis: video.description,
                videoPath: video.videoPath,
                thumbnailPath: video.thumbnailPath,
                status: video.status,
                uploadedDate: video.uploadedDate,
                episodesCount: video.episodesCount,
              } satisfies UploadedVideo,
              show: null as AnimeShow | null,
              streamUrl,
              thumbnailUrl,
            };
          })
        );

        if (!cancelled) {
          setUploadedVideos(mappedVideos.map((item) => item.video));
          setUploadError('');
          setUploadedShowsData(
            mappedVideos.map((item) =>
              uploadedVideoToShow(item.video, item.streamUrl, item.thumbnailUrl)
            )
          );
        }
      } catch (error) {
        console.error('Could not load uploaded videos:', error);

        if (!cancelled) {
          setUploadError('Uploaded videos could not be loaded.');
        }
      }
    };

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, []);

const uploadedShows = uploadedShowsData;

  const allShows = useMemo(
    () => [...ANIME_SHOWS, ...uploadedShows],
    [uploadedShows]
  );


  const genresList = [
    'All',
    ...new Set([
      'Action',
      'Fantasy',
      'Sci-Fi',
      'Mecha',
      'Cyberpunk',
      'Drama',
      'Slice of Life',
      'Romance',
      ...uploadedShows.flatMap((show) => show.genres),
    ]),
  ];
  const yearList = ['All', '2024', '2023', '2022'];
  const ratingList = ['All', '4.8+', '4.5+'];

  const filteredShows = useMemo(() => {
    return allShows.filter((show) => {
      // Search
      if (
        searchQuery.trim() &&
        !show.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !show.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !show.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      // Genre
      if (
        selectedGenre !== 'All' &&
        !show.genres.some(
          (genre) => genre.toLowerCase() === selectedGenre.toLowerCase()
        )
      ) {
        return false;
      }
      // Year
      if (selectedYear !== 'All' && show.year.toString() !== selectedYear) {
        return false;
      }
      // Rating
      if (selectedRating === '4.8+' && show.rating < 4.8) {
        return false;
      }
      if (selectedRating === '4.5+' && show.rating < 4.5) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'Newest') return b.year - a.year;
      if (selectedSort === 'A-Z') return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });
  }, [allShows, searchQuery, selectedGenre, selectedYear, selectedRating, selectedSort]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 450);
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Discover Anime</span>
            <span className="text-[13px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
              {filteredShows.length} titles
            </span>
          </h1>
          <p className="text-[14px] text-[#e0c0af]/80 mt-1">
            Explore original Indian animations, regional dubs, and masterworks.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#e0c0af]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, genre, creator..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#191b24] border border-white/10 rounded-xl text-[13px] text-white placeholder-[#e0c0af]/50 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-4">
        {/* Genres Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[12px] font-bold text-[#e0c0af]/60 uppercase tracking-wider flex items-center gap-1.5 mr-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-[var(--accent)]" />
            Genre:
          </span>
          {genresList.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${selectedGenre === g
                ? 'bg-[var(--accent)] text-white shadow-[0_0_12px_var(--accent-glow)] font-bold'
                : 'bg-white/5 hover:bg-white/10 text-[#e0c0af] border border-white/5'
                }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Dropdown Filters & Sorters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Year selector */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#e0c0af]/70 font-medium">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#11131c] border border-white/10 text-[13px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--accent)]"
              >
                {yearList.map((y) => (
                  <option key={y} value={y} className="bg-[#191b24] text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating selector */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#e0c0af]/70 font-medium">Rating:</span>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="bg-[#11131c] border border-white/10 text-[13px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--accent)]"
              >
                {ratingList.map((r) => (
                  <option key={r} value={r} className="bg-[#191b24] text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-[12px] text-[#e0c0af]/70 font-medium">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-[#11131c] border border-white/10 text-[13px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="Popular" className="bg-[#191b24] text-white">
                Most Popular
              </option>
              <option value="Newest" className="bg-[#191b24] text-white">
                Newest Releases
              </option>
              <option value="A-Z" className="bg-[#191b24] text-white">
                Alphabetical (A-Z)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Anime Grid */}
      {filteredShows.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-[var(--accent)]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-headline text-xl font-bold text-white">No Anime Found</h3>
          <p className="text-[14px] text-[#e0c0af]/70 mt-1">
            Try adjusting your genre filters or search query to find more titles.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
              setSelectedYear('All');
              setSelectedRating('All');
            }}
            className="mt-5 px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-[13px] font-bold shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredShows.slice(0, visibleCount).map((show) => {
            const inList = myList.includes(show.id);
            return (
              <div
                key={show.id}
                onClick={() => onSelectShow(show)}
                className="group relative bg-[#191b24]/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--accent)]/70 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_25px_var(--accent-glow)]"
              >
                {/* Poster container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
                  <img
                    src={show.posterImage}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-black/40" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {show.isOriginal && (
                      <span className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-white text-[10px] font-extrabold uppercase shadow-sm">
                        Original
                      </span>
                    )}
                    {show.isPremium && (
                      <span className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-black text-[10px] font-extrabold uppercase flex items-center gap-1 shadow-sm">
                        <Crown className="w-3 h-3" />
                        VIP
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-1 z-10">
                    <Star className="w-3 h-3 text-[var(--accent)] fill-amber-400" />
                    <span>{show.rating}</span>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 z-20">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-[0_0_20px_var(--accent)] transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMyList(show.id);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all ${inList
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-[var(--accent)]/30 hover:bg-[var(--accent)] text-white border border-[var(--accent)]/50'
                        }`}
                    >
                      {inList ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>In List</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to List</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-[15px] text-white truncate group-hover:text-[var(--accent)] transition-colors">
                      {show.title}
                    </h3>
                    <p className="text-[12px] text-[#e0c0af]/70 truncate mt-0.5">
                      {show.genres.join(' • ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#e0c0af]/50 mt-3 pt-2 border-t border-white/5">
                    <span>{show.year}</span>
                    <span>{show.studio}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredShows.length && (
        <div className="text-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-[14px] transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <Sparkles className="w-4 h-4 text-[var(--accent)] animate-spin" />
                <span>Loading titles...</span>
              </>
            ) : (
              <span>Load More Anime ({filteredShows.length - visibleCount} remaining)</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
