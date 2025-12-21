'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import { getFeeds, getSavedIds, getWatchedIds, markWatched, markUnwatched, unsaveItem } from '@/lib/data';
import { FeedItem } from '@/lib/types';

type FilterType = 'all' | 'unwatched' | 'watched';

export default function SavedPage() {
  const feeds = getFeeds();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setSavedIds(getSavedIds());
    setWatchedIds(getWatchedIds());
  }, [refreshKey]);

  // Get saved items
  const savedItems = useMemo(() => {
    return feeds.items.filter(item => savedIds.includes(item.id));
  }, [feeds.items, savedIds]);

  // Filter by watched status
  const filteredItems = useMemo(() => {
    if (filter === 'unwatched') {
      return savedItems.filter(item => !watchedIds.includes(item.id));
    } else if (filter === 'watched') {
      return savedItems.filter(item => watchedIds.includes(item.id));
    }
    return savedItems;
  }, [savedItems, watchedIds, filter]);

  const unwatchedCount = savedItems.filter(item => !watchedIds.includes(item.id)).length;

  const handleToggleWatched = (id: string) => {
    if (watchedIds.includes(id)) {
      markUnwatched(id);
    } else {
      markWatched(id);
    }
    setRefreshKey(k => k + 1);
  };

  const handleRemove = (id: string) => {
    unsaveItem(id);
    setRefreshKey(k => k + 1);
  };

  const handleSaveChange = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved</h1>
            <p className="text-gray-500">Content you want to revisit</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === 'all' 
                  ? 'bg-[#2d5a47] text-white shadow-sm' 
                  : 'bg-white/70 text-gray-600 border border-[#e8e4de]'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unwatched')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === 'unwatched' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'bg-white/70 text-gray-600 border border-[#e8e4de]'
              }`}
            >
              Unwatched ({unwatchedCount})
            </button>
            <button 
              onClick={() => setFilter('watched')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === 'watched' 
                  ? 'bg-[#2d5a47] text-white shadow-sm' 
                  : 'bg-white/70 text-gray-600 border border-[#e8e4de]'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => (
              <div key={item.id} className={`relative ${watchedIds.includes(item.id) ? 'opacity-60' : ''}`}>
                {/* Status Badge */}
                <div className="absolute top-3 left-14 z-10">
                  {watchedIds.includes(item.id) ? (
                    <span className="px-2 py-1 bg-[#2d5a47] text-white text-xs font-medium rounded-md flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      Done
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md">
                      Unwatched
                    </span>
                  )}
                </div>
                
                <ContentCard item={item} onSaveChange={handleSaveChange} />
                
                {/* Action Buttons */}
                <div className="px-4 pb-4 -mt-2 bg-white rounded-b-2xl border-x border-b border-[#e8e4de]/60 flex items-center justify-between">
                  <button 
                    onClick={() => handleToggleWatched(item.id)}
                    className="text-xs text-gray-500 hover:text-[#2d5a47] transition"
                  >
                    {watchedIds.includes(item.id) ? 'Mark unwatched' : 'Mark as done'}
                  </button>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="text-xs text-red-500 hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#f5f3f0] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No saved content yet' : `No ${filter} content`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Click the bookmark icon on any content to save it for later' 
                : 'Try changing your filter'}
            </p>
            {filter === 'all' && (
              <a href="/" className="px-4 py-2 bg-[#2d5a47] text-white rounded-xl text-sm font-medium hover:bg-[#234839] transition inline-flex items-center gap-2">
                Browse Feed
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-[#e8e4de] mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">Oasis — Find your oasis in the desert of information</p>
        </div>
      </footer>
    </div>
  );
}

