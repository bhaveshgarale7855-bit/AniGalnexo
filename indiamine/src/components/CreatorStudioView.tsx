import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  Users,
  Wallet,
  UploadCloud,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  FileVideo,
  Image as ImageIcon,
  BookOpen,
} from 'lucide-react';
import { PublishedAnimeItem, CreatorStats } from '../types';
import {
  CREATOR_DASHBOARD_STATS,
  PUBLISHED_ANIME_LIST,
  DEFAULT_AVATARS,
} from '../data/animeData';
import { getMyVideos } from '../lib/videos';
import { supabase } from '../lib/supabase';

interface CreatorStudioViewProps {
  onToast: (msg: string) => void;
}

export const CreatorStudioView: React.FC<CreatorStudioViewProps> = ({ onToast }) => {
  const [stats] = useState<CreatorStats>(CREATOR_DASHBOARD_STATS);
  const [publishedList, setPublishedList] = useState<PublishedAnimeItem[]>(PUBLISHED_ANIME_LIST);
  const [searchTable, setSearchTable] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Cyberpunk, Action');
  const [newEpisodesCount, setNewEpisodesCount] = useState('1');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSavedVideos = async () => {
      try {
        const videos = await getMyVideos();

        if (cancelled) return;

        const savedItems: PublishedAnimeItem[] = videos.map((video) => ({
          id: video.id,
          title: video.title,
          thumbnail: '',
          episodesCount: video.episodesCount,
          status: video.status === 'Rejected' ? 'Pending' : video.status,
          views: '--',
          revenue: '--',
          uploadedDate: video.uploadedDate
            ? video.uploadedDate.slice(0, 10)
            : '',
          genre: video.genre || 'Uncategorized',
        }));

        setPublishedList((current) => {
          const savedIds = new Set(savedItems.map((item) => item.id));
          const demoItems = current.filter((item) => !savedIds.has(item.id));

          return [...savedItems, ...demoItems];
        });
      } catch (error) {
        if (!cancelled) {
          console.error('Loading saved anime failed:', error);

          onToast(
            error instanceof Error
              ? error.message
              : 'Could not load your saved videos.'
          );
        }
      }
    };

    void loadSavedVideos();

    return () => {
      cancelled = true;
    };
  }, [onToast]);

  const filteredList = publishedList.filter((item) =>
    item.title.toLowerCase().includes(searchTable.toLowerCase())
  );



  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      onToast('Please enter an anime title.');
      return;
    }

    if (!selectedFile || selectedFile.size === 0) {
      onToast('Please select a valid video file.');
      return;
    }

    if (!supabase) {
      onToast('Supabase is not configured.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let uploadedVideoPath: string | null = null;
    let uploadedThumbnailPath: string | null = null;

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error('Please sign in before uploading.');
      }

      const safeVideoName = selectedFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        '_'
      );

      uploadedVideoPath =
        `${user.id}/${crypto.randomUUID()}-${safeVideoName}`;

      const { error: videoUploadError } = await supabase.storage
        .from('anime-videos')
        .upload(uploadedVideoPath, selectedFile, {
          contentType: selectedFile.type || 'video/mp4',
          upsert: false,
        });

      if (videoUploadError) throw videoUploadError;

      setUploadProgress(70);

      if (selectedThumbnail) {
        const safeThumbnailName = selectedThumbnail.name.replace(
          /[^a-zA-Z0-9._-]/g,
          '_'
        );

        uploadedThumbnailPath =
          `${user.id}/${crypto.randomUUID()}-${safeThumbnailName}`;

        const { error: thumbnailUploadError } = await supabase.storage
          .from('anime-thumbnails')
          .upload(uploadedThumbnailPath, selectedThumbnail, {
            contentType: selectedThumbnail.type || 'image/jpeg',
            upsert: false,
          });

        if (thumbnailUploadError) throw thumbnailUploadError;
      }

      setUploadProgress(90);

      const { data: video, error: insertError } = await supabase
        .from('videos')
        .insert({
          title: newTitle.trim(),
          description: newSynopsis.trim(),
          genre: newGenre.trim() || 'Uncategorized',
          episodes_count: Math.max(1, Number(newEpisodesCount) || 1),
          video_path: uploadedVideoPath,
          thumbnail_path: uploadedThumbnailPath,
          status: 'Pending',
          created_by: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploadProgress(100);

      const newItem: PublishedAnimeItem = {
        id: video.id,
        title: video.title,
        thumbnail: thumbnailPreview || '',
        episodesCount: Number(video.episodes_count) || 1,
        status: 'Pending',
        views: '--',
        revenue: '--',
        uploadedDate: video.created_at
          ? video.created_at.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        genre: video.genre || 'Uncategorized',
      };

      setPublishedList((current) => [
        newItem,
        ...current.filter((item) => item.id !== newItem.id),
      ]);

      setNewTitle('');
      setNewGenre('Cyberpunk, Action');
      setNewEpisodesCount('1');
      setNewSynopsis('');
      setSelectedFile(null);
      setSelectedThumbnail(null);
      setThumbnailPreview('');

      if (fileInputRef.current) fileInputRef.current.value = '';
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';

      setIsUploadModalOpen(false);
      onToast(`"${video.title}" uploaded and submitted for review.`);
    } catch (error) {
      console.error('Supabase video upload failed:', error);

      // Remove partially uploaded files if a later step fails.
      if (supabase) {
        if (uploadedThumbnailPath) {
          await supabase.storage
            .from('anime-thumbnails')
            .remove([uploadedThumbnailPath])
            .catch(() => ({ data: [], error: null }));
        }

        if (uploadedVideoPath) {
          await supabase.storage
            .from('anime-videos')
            .remove([uploadedVideoPath])
            .catch(() => ({ data: [], error: null }));
        }
      }

      onToast(
        error instanceof Error ? error.message : 'Video upload failed.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-16 animate-in fade-in duration-300">
      {/* Top Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[var(--accent)]/30">
              <Sparkles className="w-3 h-3 text-[var(--accent)]" />
              Creator Portal
            </span>
            <span className="text-[12px] text-[#e0c0af]/60">Studio ID: IND-8924</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-[14px] text-[#e0c0af]/80 mt-0.5">
            Welcome back, <span className="text-white font-semibold">Aarya Sharma</span>. Here's
            your creative analytics and publishing hub.
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_0_20px_var(--accent-glow)] hover:scale-105 active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Anime</span>
        </button>
      </div>

      {/* 3 Bento Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Views */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-[var(--accent)]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#e0c0af]/70">Total Views</span>
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--accent)]">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-headline text-4xl font-black text-white">{stats.totalViews}</h2>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-400 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>+{stats.viewsGrowth}% vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Followers */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-[#00f4fe]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#e0c0af]/70">Studio Followers</span>
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#00f4fe]">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-headline text-4xl font-black text-white">
              {stats.followers.toLocaleString()}
            </h2>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-400 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>+{stats.followersGrowth}% vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Revenue Earned (with signature Saffron Glow) */}
        <div className="glass-card p-6 rounded-3xl border border-[var(--accent)]/50 shadow-[0_0_25px_var(--accent-glow)] relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--accent)]">Revenue Earned (INR)</span>
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-headline text-4xl font-black text-white">
              ₹{stats.revenueEarned.toLocaleString()}
            </h2>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-400 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>+{stats.revenueGrowth}% creator royalty share</span>
            </div>
          </div>
        </div>
      </div>

      {/* "My Published Anime" Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline text-xl font-bold text-white">My Published Anime</h3>
            <p className="text-[13px] text-[#e0c0af]/70">
              Manage your serial releases, check review statuses, and track episode streams.
            </p>
          </div>

          {/* Search bar in table */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#e0c0af]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              placeholder="Filter titles..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#11131c] border border-white/10 rounded-xl text-[13px] text-white placeholder-[#e0c0af]/40 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/10 text-[#e0c0af]/60 font-bold uppercase text-[11px] tracking-wider">
                <th className="pb-3">Anime Title</th>
                <th className="pb-3">Episodes</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Views</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Uploaded</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-16 rounded-xl object-cover flex-shrink-0 shadow-md border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-16 rounded-xl flex-shrink-0 border border-white/10 bg-white/5 flex items-center justify-center">
                          <FileVideo className="w-6 h-6 text-[#e0c0af]/60" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-[14px] text-white group-hover:text-[var(--accent)] transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[12px] text-[#e0c0af]/60">{item.genre}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 font-semibold text-[#e1e1ef]">
                    {item.episodesCount} Episodes
                  </td>

                  <td className="py-4">
                    {item.status === 'Live' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-bold text-[11px] inline-flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[var(--accent)]" />
                        Pending Review
                      </span>
                    )}
                  </td>

                  <td className="py-4 font-mono font-medium text-white">{item.views}</td>
                  <td className="py-4 font-mono font-bold text-[var(--accent)]">{item.revenue}</td>
                  <td className="py-4 text-[#e0c0af]/70">{item.uploadedDate}</td>


                  <td className="py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === item.id ? null : item.id
                          )
                        }
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === item.id && (
                        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-white/10 bg-[#18181b] shadow-xl z-50 p-1">
                          <button
                            type="button"
                            onClick={async () => {
                              setOpenMenuId(null);

                              const confirmed = window.confirm(
                                `Are you sure you want to delete "${item.title}"?`
                              );

                              if (!confirmed) return;

                              try {
                                const response = await fetch(
                                  `http://127.0.0.1:4000/api/videos/${encodeURIComponent(item.id)}`,
                                  { method: 'DELETE' }
                                );

                                if (response.status === 404) {
                                  // This is a demo item, not a saved backend video.
                                  setPublishedList((current) =>
                                    current.filter((anime) => anime.id !== item.id)
                                  );
                                  onToast(`Demo item "${item.title}" removed.`);
                                  return;
                                }

                                if (!response.ok) {
                                  throw new Error('Could not delete the saved video.');
                                }

                                setPublishedList((current) =>
                                  current.filter((anime) => anime.id !== item.id)
                                );

                                onToast(`"${item.title}" and its saved video were deleted.`);
                              } catch (error) {
                                onToast(
                                  error instanceof Error
                                    ? error.message
                                    : 'Delete failed. Check the local server.'
                                );
                              }
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creator Resources - Rights & Ownership Policy Widget */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[#00f4fe] font-bold text-[13px]">
            <ShieldCheck className="w-5 h-5" />
            <span>AniGalnexo Creator Protection Program</span>
          </div>
          <h3 className="font-headline text-xl font-bold text-white">
            Creator Rights & Intellectual Property Ownership
          </h3>
          <p className="text-[14px] text-[#e0c0af]/80 leading-relaxed">
            You retain 100% IP copyright of your original animation masters, characters, and storylines.
            AniGalnexo provides exclusive 85% revenue splits and handles AI-assisted regional audio
            dubbing across India.
          </p>
        </div>

        <button
          onClick={() => setIsPolicyModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-[13px] flex items-center gap-2 flex-shrink-0 transition-all hover:scale-105"
        >
          <BookOpen className="w-4 h-4 text-[var(--accent)]" />
          <span>Read Policy Guide</span>
        </button>
      </div>

      {/* Upload Anime Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#191b24] border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#e0c0af] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider">
                New Publication
              </span>
              <h2 className="font-headline text-2xl font-bold text-white mt-1">
                Upload New Anime Episode
              </h2>
              <p className="text-[13px] text-[#e0c0af]/70">
                Submit high-definition animation video files (MP4, MKV, ProRes) for streaming distribution.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag & Drop Dropzone */}
              <div className="border-2 border-dashed border-white/20 hover:border-[var(--accent)]/70 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <UploadCloud className="w-10 h-10 text-[var(--accent)] mx-auto group-hover:scale-110 transition-transform mb-3" />
                <p className="text-[14px] font-bold text-white">
                  Drag & Drop Master Video File Here
                </p>
                <p className="text-[12px] text-[#e0c0af]/60 mt-1">
                  Supports 4K UHD, 1080p, 60FPS • Up to 5GB per episode
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const allowedExtensions = /\.(mp4|webm|mov|mkv)$/i;

                    if (!allowedExtensions.test(file.name)) {
                      onToast('Please select an MP4, WebM, MOV, or MKV video.');
                      e.target.value = '';
                      return;
                    }

                    setSelectedFile(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold"
                >
                  Browse Files
                </button>

                {selectedFile && (
                  <p className="mt-3 text-sm text-emerald-300 break-all">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>


              {/* Anime Thumbnail Picker */}
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 space-y-3">
                <div>
                  <label className="text-sm font-bold text-white">
                    Anime Thumbnail / Poster
                  </label>
                  <p className="text-xs text-[#e0c0af]/60 mt-1">
                    Choose a JPG, PNG, or WebP image for your anime cover.
                  </p>
                </div>

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (file.size > 10 * 1024 * 1024) {
                      onToast('Thumbnail must be 10 MB or smaller.');
                      e.target.value = '';
                      return;
                    }

                    setSelectedThumbnail(file);

                    setThumbnailPreview((oldPreview) => {
                      if (oldPreview) URL.revokeObjectURL(oldPreview);
                      return URL.createObjectURL(file);
                    });
                  }}
                />

                <div className="flex flex-wrap items-center gap-4">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Selected anime thumbnail preview"
                      className="w-24 h-32 rounded-xl border border-white/15 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-32 rounded-xl border border-dashed border-white/20 bg-black/20 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#e0c0af]/40" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold transition-colors"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {selectedThumbnail ? 'Change Thumbnail' : 'Add Thumbnail'}
                      </span>
                    </button>

                    {selectedThumbnail && (
                      <>
                        <p className="text-xs text-emerald-300 break-all max-w-xs">
                          {selectedThumbnail.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedThumbnail(null);
                            setThumbnailPreview((oldPreview) => {
                              if (oldPreview) URL.revokeObjectURL(oldPreview);
                              return '';
                            });
                            if (thumbnailInputRef.current) {
                              thumbnailInputRef.current.value = '';
                            }
                          }}
                          className="block text-xs text-red-400 hover:text-red-300"
                        >
                          Remove thumbnail
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>


              {/* Title & Episodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#e0c0af]">Anime Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Chronicles of Garuda"
                    className="w-full px-3.5 py-2.5 bg-[#11131c] border border-white/15 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#e0c0af]">Episode Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newEpisodesCount}
                    onChange={(e) => setNewEpisodesCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#11131c] border border-white/15 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Genre Selector */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#e0c0af]">Primary Genres</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#11131c] border border-white/15 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="Cyberpunk, Action">Cyberpunk, Action</option>
                  <option value="Feudal, Supernatural">Feudal, Supernatural</option>
                  <option value="Mecha, Sci-Fi">Mecha, Sci-Fi</option>
                  <option value="Slice of Life, Romance">Slice of Life, Romance</option>
                  <option value="Fantasy, Adventure">Fantasy, Adventure</option>
                </select>
              </div>

              {/* Synopsis */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#e0c0af]">Synopsis / Storyline</label>
                <textarea
                  rows={3}
                  value={newSynopsis}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                  placeholder="Describe your anime storyline, lore, and lead characters..."
                  className="w-full px-3.5 py-2.5 bg-[#11131c] border border-white/15 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Progress bar when uploading */}
              {isUploading && (
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[12px] font-bold text-white">
                    <span>Encoding & Uploading Video Asset...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-[#e0c0af] hover:text-white font-bold text-[13px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold text-[13px] shadow-lg flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Submit for Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Policy Modal */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#191b24] border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setIsPolicyModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#e0c0af] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-white">
                  AniGalnexo Creator Charter
                </h3>
                <p className="text-[12px] text-[var(--accent)]">Fair terms for independent anime studios</p>
              </div>
            </div>

            <div className="space-y-3 text-[13px] text-[#e0c0af]/90 leading-relaxed max-h-72 overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white mb-1">1. Complete IP Retention</h4>
                <p>
                  Creators retain 100% master ownership of their original trademarks, storyline,
                  characters, and future adaptations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white mb-1">2. 85% Royalty Share</h4>
                <p>
                  Creators receive 85% of VIP subscriber revenue pools and pay-per-view tips directly
                  to their verified Indian bank accounts on the 1st of every month.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white mb-1">3. Dubbing Pipeline Support</h4>
                <p>
                  AniGalnexo assists with studio-grade Hindi, Tamil, Telugu, and Japanese dubbing
                  and subtitle localization at zero upfront cost.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-[13px]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
