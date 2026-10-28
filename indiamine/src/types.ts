
export type ViewMode =
  | 'home'
  | 'discover'
  | 'genres'
  | 'community'
  | 'mylist'
  | 'profile'
  | 'settings'
  | 'details'
  | 'player'
  | 'creator-studio'
  | 'admin';

export interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  verified: boolean;
  followersCount: number;
  worksCount: number;
  isFollowing?: boolean;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  synopsis: string;
  isWatched?: boolean;
  watchedPercentage?: number;
  isPremium?: boolean;
  isWatching?: boolean;
  videoSrc?: string;
}

export interface AnimeShow {
  id: string;
  title: string;
  japaneseTitle?: string;
  bannerImage: string;
  posterImage: string;
  rating: number;
  year: number;
  releaseSeason?: string;
  genres: string[];
  tags?: string[];
  description: string;
  studio: string;
  director: string;
  cast: string[];
  licenseExpiresDays: number;
  communityScore: number;
  creator: Creator;
  episodes: Episode[];
  isPremium?: boolean;
  isOriginal?: boolean;
  featured?: boolean;
  totalViews?: string;
}

export interface PublishedAnimeItem {
  id: string;
  title: string;
  thumbnail: string;
  episodesCount: number;
  status: 'Live' | 'Pending' | 'Draft';
  views: string;
  revenue: string;
  uploadedDate: string;
  genre: string;
}

export interface CreatorStats {
  totalViews: string;
  viewsGrowth: number;
  followers: number;
  followersGrowth: number;
  revenueEarned: number;
  revenueGrowth: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'viewer' | 'creator' | 'admin';
  isPremium: boolean;
  joinedDate: string;
}

export interface FilterState {
  genre: string;
  year: string;
  rating: string;
  status: string;
  sort: 'Popular' | 'Newest' | 'A-Z';
  query: string;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  timestamp: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  tags: string[];
}


export interface UploadedVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  status: 'Pending' | 'Live' | 'Rejected';
  uploadedAt?: string;
  genre?: string;
  duration?: string;
  creatorName?: string;
}
