'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import FilterBar from '@/components/FilterBar';
import { getFeeds } from '@/lib/data';
import { Domain, Platform, FeedItem } from '@/lib/types';

export default function Dashboard() {
  const feeds = getFeeds();
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items
  const filteredItems = useMemo(() => {
    let items = feeds.items;

    // Filter by domain
    if (selectedDomains.length > 0) {
      items = items.filter(item => 
        item.domains.some(d => selectedDomains.includes(d as Domain))
      );
    }

    // Filter by platform
    if (selectedPlatforms.length > 0) {
      items = items.filter(item => selectedPlatforms.includes(item.platform));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        (item.title?.toLowerCase().includes(query)) ||
        (item.content?.toLowerCase().includes(query)) ||
        (item.source.toLowerCase().includes(query)) ||
        (item.transcriptPreview?.toLowerCase().includes(query))
      );
    }

    return items;
  }, [feeds.items, selectedDomains, selectedPlatforms, searchQuery]);

  // Count new items (last 24 hours)
  const newCount = useMemo(() => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return feeds.items.filter(item => new Date(item.published) > dayAgo).length;
  }, [feeds.items]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning</h1>
          <p className="text-gray-500">{newCount} new updates from your sources</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Search titles, sources, or transcripts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white border border-[#e8e4de] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/20 focus:border-[#2d5a47] transition"
            />
            <svg className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          selectedDomains={selectedDomains}
          selectedPlatforms={selectedPlatforms}
          onDomainChange={setSelectedDomains}
          onPlatformChange={setSelectedPlatforms}
        />

        {/* Content Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#f5f3f0] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
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
