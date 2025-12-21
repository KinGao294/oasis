// Oasis Type Definitions

export type Platform = 'youtube' | 'bilibili' | 'x' | 'podcast';

export type Domain = 'AI' | 'Business' | 'Global' | 'Creator' | 'Dev' | 'Design' | 'Tech' | 'Growth';

export interface FeedItem {
  id: string;
  source: string;
  sourceId: string;
  sourceAvatar?: string;
  platform: Platform;
  domains: Domain[];
  title?: string | null;
  content?: string;
  url: string;
  thumbnail?: string;
  images?: string[];
  duration?: number;
  published: string;
  hasTranscript: boolean;
  transcriptPreview?: string | null;
  hasSummary?: boolean;
}

export interface FeedsData {
  last_updated: string;
  count: number;
  items: FeedItem[];
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface Transcript {
  source: string;
  language: string;
  full_text: string;
  segments: TranscriptSegment[];
  word_count: number;
  fetched_at: string;
}

export interface SummaryKeyPoint {
  timestamp: number;
  title: string;
  content: string;
}

export interface Summary {
  video_id: string;
  title: string;
  summary: string;
  key_points: SummaryKeyPoint[];
  tags: string[];
  generated_at: string;
}

export interface Source {
  id: string;
  name: string;
  platform: Platform;
  channel_id?: string;
  uid?: string;
  username?: string;
  feed_url?: string;
  avatar?: string;
  domains: Domain[];
}

export interface SourcesConfig {
  sources: Source[];
  domains: {
    id: Domain;
    label: string;
    color: string;
  }[];
}

// Domain colors and labels
export const DOMAIN_CONFIG: Record<Domain, { label: string; color: string; bgClass: string; textClass: string }> = {
  AI: { label: 'AI & Tech', color: '#3B82F6', bgClass: 'bg-blue-50', textClass: 'text-blue-700' },
  Business: { label: 'Business', color: '#10B981', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700' },
  Global: { label: 'Global', color: '#F59E0B', bgClass: 'bg-amber-50', textClass: 'text-amber-700' },
  Creator: { label: 'Creator', color: '#EC4899', bgClass: 'bg-pink-50', textClass: 'text-pink-700' },
  Dev: { label: 'Dev', color: '#6366F1', bgClass: 'bg-indigo-50', textClass: 'text-indigo-700' },
  Design: { label: 'Design', color: '#06B6D4', bgClass: 'bg-cyan-50', textClass: 'text-cyan-700' },
  Tech: { label: 'Tech', color: '#8B5CF6', bgClass: 'bg-violet-50', textClass: 'text-violet-700' },
  Growth: { label: 'Growth', color: '#F43F5E', bgClass: 'bg-rose-50', textClass: 'text-rose-700' },
};

// Platform colors
export const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bgClass: string }> = {
  youtube: { label: 'YouTube', color: '#FF0000', bgClass: 'bg-red-600' },
  bilibili: { label: 'Bilibili', color: '#00A1D6', bgClass: 'bg-[#00a1d6]' },
  x: { label: 'X', color: '#000000', bgClass: 'bg-gray-900' },
  podcast: { label: 'Podcast', color: '#9333EA', bgClass: 'bg-purple-600' },
};

