import React from 'react';
import { Bookmark, Play, Trash2, Plus, Star } from 'lucide-react';
import { AnimeShow } from '../types';
import { ANIME_SHOWS } from '../data/animeData';

interface MyListViewProps {
  myList: string[];
  onRemoveFromList: (id: string) => void;
  onSelectShow: (show: AnimeShow) => void;
  onNavigateToDiscover: () => void;
}

export const MyListView: React.FC<MyListViewProps> = ({
  myList,
  onRemoveFromList,
  onSelectShow,
  onNavigateToDiscover,
}) => {
  const savedShows = ANIME_SHOWS.filter((s) => myList.includes(s.id));

  return (
    <div className="space-y-8 pb-24 lg:pb-16 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Bookmark className="w-7 h-7 text-[var(--accent)]" />
          <span>My Anime Watchlist</span>
        </h1>
        <p className="text-[14px] text-[#e0c0af]/80 mt-1">
          {savedShows.length} titles saved for streaming
        </p>
      </div>

      {savedShows.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-[var(--accent)]">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-headline text-xl font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-[14px] text-[#e0c0af]/70 mt-1">
            Browse our catalogue and bookmark anime you wish to watch.
          </p>
          <button
            onClick={onNavigateToDiscover}
            className="mt-5 px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[13px] shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Discover Shows</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {savedShows.map((show) => (
            <div
              key={show.id}
              onClick={() => onSelectShow(show)}
              className="group relative bg-[#191b24]/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--accent)]/60 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
                <img
                  src={show.posterImage}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-[var(--accent)] fill-amber-400" />
                  <span>{show.rating}</span>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromList(show.id);
                  }}
                  className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors"
                  title="Remove from list"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3">
                <h4 className="font-bold text-[14px] text-white truncate group-hover:text-[var(--accent)] transition-colors">
                  {show.title}
                </h4>
                <p className="text-[11px] text-[#e0c0af]/60 truncate">{show.genres.join(' • ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
