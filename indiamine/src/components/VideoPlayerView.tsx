import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  Subtitles,
  ThumbsUp,
  Share2,
  Plus,
  Check,
  Crown,
  Download,
  Lock,
  Sparkles,
} from 'lucide-react';
import { AnimeShow, Episode } from '../types';
import { ANIME_SHOWS } from '../data/animeData';

interface VideoPlayerViewProps {
  show: AnimeShow;
  initialEpisode?: Episode;
  onBack: () => void;
  onSelectShow: (show: AnimeShow) => void;
  myList: string[];
  onToggleMyList: (showId: string) => void;
  onOpenPremium: () => void;
  onToast: (msg: string) => void;
  onRequireLogin: () => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  show,
  initialEpisode,
  onBack,
  onSelectShow,
  myList,
  onToggleMyList,
  onOpenPremium,
  onToast,
  onRequireLogin,
}) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(
    initialEpisode || show.episodes[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [totalTimeSec, setTotalTimeSec] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [quality, setQuality] = useState<string>('1080p FHD');
  const [subtitleLang, setSubtitleLang] = useState<string>('English');
  const [audioLang, setAudioLang] = useState<string>('Hindi (Dub)');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(14250);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);

  const isInMyList = myList.includes(show.id);
  const handlePlayPause = async () => {
    const video = videoRef.current;

    if (!video || !videoSrc) {
      onToast('Actual video source is not available.');
      return;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error('Video playback failed:', error);
        onToast('Video could not play. Please try again.');
      }
    } else {
      video.pause();
    }
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    video.currentTime = Math.max(
      0,
      Math.min(video.duration, video.currentTime + seconds)
    );
  };
  // Playback timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => (prev >= totalTimeSec ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalTimeSec]);

  // Hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkipIntro = () => {
    setCurrentTimeSec((prev) => Math.min(prev + 90, totalTimeSec));
    onToast('Skipped intro (+90s)');
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (!Number.isFinite(time)) return;

    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }

    setCurrentTimeSec(time);
  };

  const handleToggleLike = () => {
    if (!isLiked) {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
      onToast('Liked this episode!');
    } else {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onToast(`Link to ${show.title} Episode ${currentEpisode.episodeNumber} copied!`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Up Next episodes / recommendations
  const upNextList = [
    {
      title: 'Echoes of the Past',
      showTitle: 'Shadow of Sakura',
      episodeNum: 2,
      duration: '23:45',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCOAxczq_5lyKDKxU6AQp1oCgEntsRn2c-gcFntZDDhrCvFjjxWr_lex31GbPP1-QsnsXw92VFYx6kcyh2-0FpaKAXxY6vU07bmYZS-pJNNivYMca-0an6yypv5x_gCdaRHeaxh0pU-lPZ74UR7782Ch5zxl-tUtHTMLKe07q-IHojNMLYScGPrvR4WF-QFReJUbXnCELiRnAJM5xLkm1d2_dLTF2m6kXT0_tf-TKbdgc-KqLt7HTS1uA',
      show: ANIME_SHOWS[0],
      ep: ANIME_SHOWS[0].episodes[1],
    },
    {
      title: 'Neon Genesis Reborn',
      showTitle: 'Neon Genesis Reborn',
      episodeNum: 1,
      duration: '24:00',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzjEgZ7EZmXu3FRGn5UiD-pTaUv7GRF7wgY3SVEiDwVDzfVCzBSZ_MDjo5GzfrDR3R8ghCHz2ieqJsHMR5X4tkCOvPmfGJAsFpSgkRG9yKPjCWbfrv6LIgRzXH8VYVA38w4LRHQn7ZpT7MLCZCISVJ-pSKJbVuYeNzkim7dCluCpwqNcXDBo2ff8hQtf1DsaLRM18VYzA5mbqz6kUKwKxVLh-GcfP8lHykRTas2cn14GGtqK19hHD6g',
      show: ANIME_SHOWS[5] || ANIME_SHOWS[0],
      ep: undefined,
    },
    {
      title: 'Golden Hour High',
      showTitle: 'Golden Hour High',
      episodeNum: 1,
      duration: '22:15',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAEKApzo9bBgsdPmR5gcWreICut-ZZPkU8dNluAnKOdMLBByIFxR0Lrtxm9StniwAuXQk6lvlk3195EHjPX9U6v8Dy1XcvaNDGRaXzT92VJ-p-yVn4MMMyT6YBvgQXvizMvz_o0emPF9_dHce1haZPDZP-GHw1-s4-PQea4CzCux_O0YtGYWKHr76wmNxFiqFAUb5HSm90m-eEuxEWnMnty48C4ADypmps4STWMJC8F1Ci8BMv3qPZ2cg',
      show: ANIME_SHOWS[6] || ANIME_SHOWS[0],
      ep: undefined,
    },
    {
      title: 'Fist of the Azure',
      showTitle: 'Fist of the Azure',
      episodeNum: 1,
      duration: '23:50',
      thumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDgEraYl3q0bPLDXh8b5XAXZSVKwnQDo1CKk0BXDqmbZJ2_ISlsRyNngQr7Lst5wPJjOoV4K5JV3g867dGaZYdcgL8z8WqKooP_x0oWPaxZ9CEoVsg_0lg-o-5P2cSJpok__cxBBuEN3Nlglb5KAoXKL-FtL_3avAlmkONdu174jF2SjAPpzmdSIaClGxk-Rfcl5-NhJmq6Upf94Jn7Tj_7TjZbzrU3swrJ8XvQk_nLZXt9SJqrdYSf5A',
      show: ANIME_SHOWS[7] || ANIME_SHOWS[0],
      ep: undefined,
    },
  ];


  const videoSrc = currentEpisode?.videoSrc || show.videoSrc;
  const backdropScene =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsK9mOFe5UUyycxys9xopKEs2rmBYILfwOCiPns6uIH7ON5QGQPaFHQPvd_ady9Hg0FSC57CI_h90wxHEr4VTysoIOOV9dEUuSKxFicTkC9pz8QnVUdJaujcy7Xv2bpUBbXZ7r5l3t4Rz5mHRmAU5CHdkCbWHN8GYxMu9XBUqmFVVi9l4HdMSxF7oIEGn0soFQ2Y8BeMEamLkAzBL335u5TcPkzfKgEI7xrs75DTvHaKUJXWh4YkVqDA';

  return (
    <div className="space-y-8 pb-24 lg:pb-16 animate-in fade-in duration-300">
      {/* Top Back Nav Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0c0af] hover:text-white transition-all font-semibold text-[13px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Show Page</span>
      </button>

      {/* Main Cinematic Video Player Container */}
      <div
        ref={playerContainerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full aspect-video max-h-[75vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/15 select-none group"
      >
        {/* Active Scene Backdrop */}
        {/* Actual Video Player */}
        <div className="absolute inset-0 bg-black">
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              className="absolute inset-0 h-full w-full object-contain"
              playsInline
              preload="metadata"
              onLoadedMetadata={(event) => {
                const duration = event.currentTarget.duration;
                if (Number.isFinite(duration)) {
                  setTotalTimeSec(duration);
                }
              }}
              onTimeUpdate={(event) => {
                setCurrentTimeSec(event.currentTarget.currentTime);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(event) => {
                console.error(
                  'Video element error:',
                  event.currentTarget.error
                );
                onToast('Video failed to load. Check its source or format.');
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/70">
              Video source is missing.
            </div>
          )}
        </div>
        {/* Top Floating Info & Back */}
        <div
          className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-white text-shadow-glow">
                {show.title}
              </h2>
              <p className="text-[12px] text-[var(--accent)] font-medium">
                Season 1 • Episode {currentEpisode.episodeNumber}: {currentEpisode.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[var(--accent)]/90 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-lg">
              {quality}
            </span>
          </div>
        </div>

        {/* Center Play/Pause Large Action (Click anywhere or center icon) */}
        <div
          onClick={(event) => {
            event.stopPropagation();
            void handlePlayPause();
          }}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        >
          {(!isPlaying || showControls) && (
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[var(--accent)]/90 text-white flex items-center justify-center shadow-[0_0_30px_var(--accent)] hover:scale-110 active:scale-95 transition-all">
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </div>
          )}
        </div>

        {/* Skip Intro Button */}
        {currentTimeSec < 120 && (
          <button
            onClick={handleSkipIntro}
            className="absolute bottom-20 right-6 z-30 px-4 py-2 rounded-xl bg-black/80 hover:bg-[var(--accent)] border border-white/20 text-white font-bold text-[13px] backdrop-blur-md transition-all shadow-xl hover:scale-105"
          >
            Skip Intro &gt;&gt;
          </button>
        )}

        {/* Bottom Video Controls Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-20 space-y-3 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          {/* Progress Slider with Orange Scrubbing Bar */}
          <div className="relative w-full flex items-center group/scrubber">
            <input
              type="range"
              min={0}
              max={totalTimeSec}
              value={currentTimeSec}
              onChange={handleSeek}
              className="w-full h-1.5 hover:h-2.5 bg-white/25 rounded-lg appearance-none cursor-pointer progress-slider transition-all"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                onClick={() => void handlePlayPause()}
                className="p-1 text-white hover:text-[var(--accent)] transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => setCurrentTimeSec((prev) => Math.max(0, prev - 10))}
                className="p-1 text-[#e0c0af] hover:text-white transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentTimeSec((prev) => Math.min(totalTimeSec, prev + 10))}
                className="p-1 text-[#e0c0af] hover:text-white transition-colors"
                title="Forward 10s"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-[#e0c0af] hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 sm:w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer progress-slider hidden sm:block"
                />
              </div>

              {/* Time Indicator */}
              <span className="text-[12px] sm:text-[13px] text-[#e0c0af] font-medium font-mono">
                {formatTime(currentTimeSec)} / {formatTime(totalTimeSec)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4 relative">
              {/* Subtitles Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                  className={`p-1.5 rounded-lg transition-colors ${showSubtitleMenu
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[#e0c0af] hover:text-white'
                    }`}
                  title="Subtitles & Audio"
                >
                  <Subtitles className="w-5 h-5" />
                </button>

                {showSubtitleMenu && (
                  <div className="absolute bottom-full right-0 mb-3 w-56 bg-[#191b24] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 text-[13px] space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[var(--accent)] block mb-1.5">
                        Audio Track
                      </span>
                      {['Hindi (Dub)', 'Japanese (Original)', 'English (Dub)', 'Tamil'].map(
                        (aud) => (
                          <button
                            key={aud}
                            onClick={() => {
                              setAudioLang(aud);
                              setShowSubtitleMenu(false);
                              onToast(`Audio switched to ${aud}`);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${audioLang === aud
                              ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-bold'
                              : 'text-[#e0c0af] hover:bg-white/10'
                              }`}
                          >
                            {aud}
                          </button>
                        )
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[11px] font-bold uppercase text-[var(--accent)] block mb-1.5">
                        Subtitles
                      </span>
                      {['Off', 'English', 'Hindi', 'Japanese'].map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setSubtitleLang(sub);
                            setShowSubtitleMenu(false);
                            onToast(`Subtitles: ${sub}`);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${subtitleLang === sub
                            ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-bold'
                            : 'text-[#e0c0af] hover:bg-white/10'
                            }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-lg transition-colors ${showSettings ? 'bg-[var(--accent)] text-white' : 'text-[#e0c0af] hover:text-white'
                    }`}
                  title="Playback Quality"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-3 w-48 bg-[#191b24] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 text-[13px]">
                    <span className="text-[11px] font-bold uppercase text-[var(--accent)] px-2 py-1 block">
                      Video Quality
                    </span>
                    {['4K Ultra HD (VIP)', '1080p FHD', '720p HD', 'Auto (Adaptive)'].map(
                      (q) => (
                        <button
                          key={q}
                          onClick={() => {
                            if (q.includes('VIP')) {
                              onOpenPremium();
                            } else {
                              setQuality(q);
                              setShowSettings(false);
                              onToast(`Quality set to ${q}`);
                            }
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${quality === q
                            ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-bold'
                            : 'text-[#e0c0af] hover:bg-white/10'
                            }`}
                        >
                          {q}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="p-1 text-[#e0c0af] hover:text-white transition-colors"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout Under Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Episode Info, Tags, Actions, Ad Promo, Up Next */}
        <div className="lg:col-span-8 space-y-6">
          {/* Metadata & Actions Header */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider">
                  Episode {currentEpisode.episodeNumber} • {currentEpisode.duration}
                </span>
                <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                  {currentEpisode.title}
                </h1>
                <p className="text-[13px] text-[var(--accent)] font-medium mt-0.5">
                  {show.title} • {show.studio}
                </p>
              </div>

              {/* Action Buttons: Like, Share, Download, Add to list */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleToggleLike}
                  className={`px-4 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all border ${isLiked
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_12px_var(--accent)]'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                    }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0c0af] hover:text-white transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleMyList(show.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all border ${isInMyList
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    }`}
                >
                  {isInMyList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                  <span>{isInMyList ? 'Saved' : 'Add to List'}</span>
                </button>

                <button
                  onClick={() => {
                    onToast('Downloading episode for offline viewing (AniGalnexo VIP)');
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0c0af] hover:text-white transition-colors"
                  title="Download Offline"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Badges / Tech Specs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[11px] font-bold">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                1080p FHD
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                CC English / Hindi
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                Dolby 5.1
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                Audio: {audioLang}
              </span>
            </div>

            <p className="text-[14px] text-[#e0c0af] leading-relaxed pt-1">
              {currentEpisode.synopsis}
            </p>
          </div>

          {/* Ad / VIP Promotional Banner */}
          <div
            onClick={onOpenPremium}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#191b24] via-[#2a1a2e] to-[#191b24] border border-[var(--accent-border)] p-5 flex items-center justify-between cursor-pointer hover:border-[var(--accent)] transition-all shadow-[0_0_20px_var(--accent-glow)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-black flex items-center justify-center flex-shrink-0 font-extrabold shadow-lg">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-amber-300">
                    AD • VIP Upgrade
                  </span>
                </div>
                <h4 className="font-headline font-bold text-[16px] text-white mt-0.5">
                  Stream Without Ads in 4K HDR
                </h4>
                <p className="text-[12px] text-[#e0c0af]/80">
                  Unlock all simulcast episodes and support creator revenue directly.
                </p>
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-amber-300 text-black font-extrabold text-[13px] shadow-lg flex-shrink-0">
              Upgrade Now
            </button>
          </div>

          {/* Up Next / Recommendations Grid */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-xl text-white">Up Next</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upNextList.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.ep) {
                      setCurrentEpisode(item.ep);
                      setCurrentTimeSec(0);
                    } else if (item.show) {
                      onSelectShow(item.show);
                    }
                  }}
                  className="group flex gap-3.5 p-3 rounded-2xl bg-[#191b24]/60 border border-white/10 hover:border-[var(--accent)]/50 transition-all cursor-pointer"
                >
                  <div className="relative w-36 aspect-video rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                      {item.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider">
                      Episode {item.episodeNum}
                    </span>
                    <h4 className="font-bold text-[14px] text-white truncate group-hover:text-[var(--accent)] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-[#e0c0af]/70 truncate">{item.showTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Season Episode Switcher */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-headline font-bold text-lg text-white">
                Season 1 Episodes
              </h3>
              <span className="text-[12px] text-[#e0c0af]/70 font-semibold">
                {show.episodes.length} Episodes
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto no-scrollbar">
              {show.episodes.map((ep) => {
                const isActive = ep.id === currentEpisode.id;
                const isLocked = ep.isPremium && !ep.isWatched && ep.episodeNumber > 3;

                return (
                  <div
                    key={ep.id}
                    onClick={() => {
                      if (isLocked) {
                        onOpenPremium();
                      } else {
                        setCurrentEpisode(ep);
                        setCurrentTimeSec(0);
                        setIsPlaying(true);
                      }
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${isActive
                      ? 'bg-[var(--accent)]/15 border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                  >
                    <div className="relative w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                      <img
                        src={ep.thumbnail}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[var(--accent)]/40 flex items-center justify-center">
                          <Play className="w-4 h-4 fill-white text-white" />
                        </div>
                      )}
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[var(--accent)]">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-bold ${isActive ? 'text-[var(--accent)]' : 'text-[#e0c0af]/70'
                            }`}
                        >
                          EP {ep.episodeNumber}
                        </span>
                        <span className="text-[11px] text-[#e0c0af]/50 font-mono">
                          {ep.duration}
                        </span>
                      </div>
                      <h5
                        className={`text-[13px] font-bold truncate ${isActive ? 'text-white' : 'text-[#e1e1ef]'
                          }`}
                      >
                        {ep.title}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
