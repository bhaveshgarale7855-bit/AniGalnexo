import React from 'react';
import { Layers, Sparkles, Sword, Flame, Compass, Heart, Bot, Shield, ChevronRight } from 'lucide-react';
import { AnimeShow } from '../types';
import { ANIME_SHOWS } from '../data/animeData';

interface GenresViewProps {
  onSelectGenre: (genre: string) => void;
  onSelectShow: (show: AnimeShow) => void;
}

export const GenresView: React.FC<GenresViewProps> = ({ onSelectGenre, onSelectShow }) => {
  const genreCategories = [
    {
      name: 'Action',
      icon: Sword,
      color: 'from-amber-600/30 via-orange-600/20 to-transparent',
      count: 14,
      desc: 'High-octane martial arts, cyber swordplay, and adrenaline showdowns',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD40aH-TP8mguqoWvOi2kEISetQOcRdElKfCNCcAp1GxeJX4NiRtWjyofWGhm8_RPJrsXIw_Gh6lkYiluJ0Ot8f58xYY9sP5pvRHSGI-cUB6MNS9LCX2b10Ca7ZLTk9Xohw9Z47a24j3bPJsxFjpUTogAhMrZc2qEhRlSlpvWJYxydvIQeku_6LXcV3-tF2yw1vTxf1G_CYcTa7hROvQs_iVsG7ZG0GdhhBxZIryqF5e5J-nR8r3Od_Rg',
    },
    {
      name: 'Fantasy',
      icon: Sparkles,
      color: 'from-purple-600/30 via-pink-600/20 to-transparent',
      count: 9,
      desc: 'Ancient spirits, celestial deities, and mystical realms',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBLKAMJyFFNV-EwhEkE4SvfMkCzkue-3xaM7e0YxaUy0yOw6Bh7EyGE6iYMh0sl8-1CfoD3Go9BOdeTh0UNVe5dXbW_9mJFmIPttGxoKeFhlxGr6Wte86iKI7mrq2h1ZtN3b7ECVYUDq2Oqy3MPHaaPSIvZLs-Wpj9_VTwzQcRdrb9pEM-nXFesU3fs5YM4ae8UnYErkxVj2k_f1GvSt5Ycd477PMaNK4l_cXCDRCuN2KWMoYZsKSBTKQ',
    },
    {
      name: 'Sci-Fi',
      icon: Bot,
      color: 'from-cyan-600/30 via-blue-600/20 to-transparent',
      count: 11,
      desc: 'Deep space exploration, cyberpunk metropolises, and rogue AIs',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAkMdHmic0z5uxFiaaCbrkT_eV5fIsYQRnSXNT-Kk-oTA3u85M7brkBdfjQuLa9WRliZzbcjPXNmp2Gsq5PZjdyCibTqPhYCLI2TZXJ3LUnAfnO2UrGxy0gZVC43BkSxOKKMagb70MQ-awi-efoCY7T6ijXEhxkZyFemydfFxTZoyqDAKOGk5BSndma9aH3kiCzHMt87NzRonie0JBhNoP0ivJLbwyltKxrCDGC5mgqT6yx40nPy-vnww',
    },
    {
      name: 'Mecha',
      icon: Shield,
      color: 'from-emerald-600/30 via-teal-600/20 to-transparent',
      count: 6,
      desc: 'Giant armored combat units and catastrophic planetary warfare',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzjEgZ7EZmXu3FRGn5UiD-pTaUv7GRF7wgY3SVEiDwVDzfVCzBSZ_MDjo5GzfrDR3R8ghCHz2ieqJsHMR5X4tkCOvPmfGJAsFpSgkRG9yKPjCWbfrv6LIgRzXH8VYVA38w4LRHQn7ZpT7MLCZCISVJ-pSKJbVuYeNzkim7dCluCpwqNcXDBo2ff8hQtf1DsaLRM18VYzA5mbqz6kUKwKxVLh-GcfP8lHykRTas2cn14GGtqK19hHD6g',
    },
    {
      name: 'Slice of Life',
      icon: Heart,
      color: 'from-rose-600/30 via-amber-600/20 to-transparent',
      count: 8,
      desc: 'School romance, everyday dreams, and golden hour sunsets',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAEKApzo9bBgsdPmR5gcWreICut-ZZPkU8dNluAnKOdMLBByIFxR0Lrtxm9StniwAuXQk6lvlk3195EHjPX9U6v8Dy1XcvaNDGRaXzT92VJ-p-yVn4MMMyT6YBvgQXvizMvz_o0emPF9_dHce1haZPDZP-GHw1-s4-PQea4CzCux_O0YtGYWKHr76wmNxFiqFAUb5HSm90m-eEuxEWnMnty48C4ADypmps4STWMJC8F1Ci8BMv3qPZ2cg',
    },
    {
      name: 'Cyberpunk',
      icon: Flame,
      color: 'from-orange-600/30 via-purple-600/20 to-transparent',
      count: 7,
      desc: 'High tech, low life, neon-lit alleyways, and shadow corporations',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDUEwNfR46cIWp82kkSd7Wy-MUoAV-e-vpnN4XpbBDUaP-c4hezE9bw8SPz9FESgzTdoLQXX0eFtaL6HD3TNR-gzPyvrkW06uOLirtOYSsLXwcjJMSfUCb8LqymWc1mmMOZDdGWOY9VYUpAqk0mBVdcC_HbjNNy6VCi3NOpH0gGYBsT_qX_TJi7aMLiMYQ9wybB_TQylLhbRnwEjlQ6-ol5ze-m3dnZo5GwfjyA8XItsE6AaVE5qynKkg',
    },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-16 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-[var(--accent)]" />
          <span>Browse Anime by Genre</span>
        </h1>
        <p className="text-[14px] text-[#e0c0af]/80 mt-1">
          Explore curated anime worlds categorized by narrative theme and visual aesthetics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {genreCategories.map((genre) => {
          const Icon = genre.icon;
          return (
            <div
              key={genre.name}
              onClick={() => onSelectGenre(genre.name)}
              className="group relative h-48 rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-[var(--accent)]/60 transition-all duration-300 cursor-pointer p-6 flex flex-col justify-between"
            >
              {/* Background artwork */}
              <div className="absolute inset-0 z-0">
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-30"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/70 to-transparent" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[var(--accent)] border border-white/10 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10">
                  {genre.count} Series
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-xl text-white group-hover:text-[var(--accent)] transition-colors">
                    {genre.name}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-[#e0c0af]/60 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[12px] text-[#e0c0af]/80 mt-1 line-clamp-2">{genre.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Anime Highlights */}
      <section className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="font-headline text-2xl font-bold text-white tracking-tight">
          All-Time Genre Favorites
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ANIME_SHOWS.slice(0, 4).map((show) => (
            <div
              key={show.id}
              onClick={() => onSelectShow(show)}
              className="group relative rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-[var(--accent)]/50 transition-all cursor-pointer p-3"
            >
              <img
                src={show.posterImage}
                alt={show.title}
                className="w-full aspect-[2/3] object-cover rounded-xl group-hover:scale-105 transition-transform"
              />
              <h4 className="font-bold text-[14px] text-white mt-2 truncate group-hover:text-[var(--accent)] transition-colors">
                {show.title}
              </h4>
              <p className="text-[11px] text-[#e0c0af]/70">{show.genres.join(' • ')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
