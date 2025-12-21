// Data loading utilities
import { FeedsData, Transcript, SourcesConfig, FeedItem } from './types';
import feedsJson from '../../data/feeds.json';

// Load feeds data
export function getFeeds(): FeedsData {
  return feedsJson as FeedsData;
}

// Get a single feed item by ID
export function getFeedItem(id: string): FeedItem | undefined {
  const feeds = getFeeds();
  return feeds.items.find(item => item.id === id);
}

// Load transcript for a feed item
export async function getTranscript(id: string): Promise<Transcript | null> {
  try {
    const transcript = await import(`../../data/transcripts/${id}.json`);
    return transcript.default as Transcript;
  } catch {
    return null;
  }
}

// Get sources configuration
export async function getSources(): Promise<SourcesConfig> {
  // For now, we'll parse the YAML on the client side or use a pre-converted JSON
  // In production, this would be converted during build
  const yaml = await import('../../scripts/sources.yaml');
  return yaml.default as SourcesConfig;
}

// Format duration from seconds to HH:MM:SS or MM:SS
export function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// Format timestamp seconds to MM:SS
export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate video URL with timestamp
export function getVideoUrlWithTimestamp(item: FeedItem, seconds: number): string {
  if (item.platform === 'youtube') {
    return `${item.url}&t=${Math.floor(seconds)}s`;
  } else if (item.platform === 'bilibili') {
    return `${item.url}?t=${Math.floor(seconds)}`;
  }
  return item.url;
}

// LocalStorage keys
const SAVED_KEY = 'oasis_saved';
const WATCHED_KEY = 'oasis_watched';

// Get saved items from localStorage
export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(SAVED_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save an item
export function saveItem(id: string): void {
  const saved = getSavedIds();
  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }
}

// Unsave an item
export function unsaveItem(id: string): void {
  const saved = getSavedIds().filter(s => s !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}

// Check if item is saved
export function isItemSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

// Get watched items
export function getWatchedIds(): string[] {
  if (typeof window === 'undefined') return [];
  const watched = localStorage.getItem(WATCHED_KEY);
  return watched ? JSON.parse(watched) : [];
}

// Mark as watched
export function markWatched(id: string): void {
  const watched = getWatchedIds();
  if (!watched.includes(id)) {
    watched.push(id);
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
  }
}

// Mark as unwatched
export function markUnwatched(id: string): void {
  const watched = getWatchedIds().filter(w => w !== id);
  localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
}

// Check if item is watched
export function isItemWatched(id: string): boolean {
  return getWatchedIds().includes(id);
}

