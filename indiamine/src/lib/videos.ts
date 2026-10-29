
import { supabase } from './supabase';

export interface AnimeVideo {
  id: string;
  title: string;
  description: string;
  genre: string;
  episodesCount: number;
  status: 'Pending' | 'Live' | 'Rejected';
  uploadedDate: string;
  videoPath: string;
  thumbnailPath: string | null;
  createdBy: string | null;
}

function getClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  return supabase;
}

function mapVideo(row: any): AnimeVideo {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    genre: row.genre ?? 'Uncategorized',
    episodesCount: Number(row.episodes_count) || 1,
    status: row.status,
    uploadedDate: row.created_at,
    videoPath: row.video_path,
    thumbnailPath: row.thumbnail_path ?? null,
    createdBy: row.created_by ?? null,
  };
}

export async function getLiveVideos(): Promise<AnimeVideo[]> {
  const { data, error } = await getClient()
    .from('videos')
    .select('*')
    .eq('status', 'Live')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapVideo);
}

export async function getMyVideos(): Promise<AnimeVideo[]> {
  const client = getClient();
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error('Please sign in first.');

  const { data, error } = await client
    .from('videos')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapVideo);
}

export async function getVideoPlaybackUrl(
  videoPath: string
): Promise<string> {
  const { data, error } = await getClient()
    .storage
    .from('anime-videos')
    .createSignedUrl(videoPath, 3600);

  if (error) throw error;

  return data.signedUrl;
}

export async function getThumbnailUrl(
  thumbnailPath: string
): Promise<string> {
  const { data, error } = await getClient()
    .storage
    .from('anime-thumbnails')
    .createSignedUrl(thumbnailPath, 3600);

  if (error) throw error;

  return data.signedUrl;
}
