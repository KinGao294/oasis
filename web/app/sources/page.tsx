'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { sources, getSourceStats } from '@/lib/sources-data';
import { Platform, PLATFORM_CONFIG, DOMAIN_CONFIG, Domain } from '@/lib/types';

export default function SourcesPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const stats = getSourceStats();

  // Filter sources
  const filteredSources = useMemo(() => {
    if (selectedPlatform === 'all') return sources;
    return sources.filter(s => s.platform === selectedPlatform);
  }, [selectedPlatform]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sources</h1>
            <p className="text-gray-500">Curate your information diet</p>
          </div>
          <button className="px-5 py-2.5 bg-[#2d5a47] text-white rounded-xl font-medium hover:bg-[#234839] transition flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add Source
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-[#e8e4de]/60">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Sources</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#e8e4de]/60">
            <div className="text-3xl font-bold text-red-500 mb-1">{stats.youtube}</div>
            <div className="text-sm text-gray-500">YouTube</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#e8e4de]/60">
            <div className="text-3xl font-bold text-[#00a1d6] mb-1">{stats.bilibili}</div>
            <div className="text-sm text-gray-500">Bilibili</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#e8e4de]/60">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.x}</div>
            <div className="text-sm text-gray-500">X</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#e8e4de]/60">
            <div className="text-3xl font-bold text-purple-500 mb-1">{stats.podcast}</div>
            <div className="text-sm text-gray-500">Podcast</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => setSelectedPlatform('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedPlatform === 'all' 
                ? 'bg-[#2d5a47] text-white shadow-sm' 
                : 'bg-white/70 text-gray-600 border border-[#e8e4de] hover:border-[#2d5a47]'
            }`}
          >
            All
          </button>
          {(['youtube', 'bilibili', 'x', 'podcast'] as Platform[]).map(platform => {
            const config = PLATFORM_CONFIG[platform];
            return (
              <button 
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedPlatform === platform 
                    ? `${config.bgClass} text-white shadow-sm` 
                    : 'bg-white/70 text-gray-600 border border-[#e8e4de] hover:border-gray-400'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map(source => {
            const platform = PLATFORM_CONFIG[source.platform];
            
            return (
              <div key={source.id} className="card-hover bg-white rounded-xl p-5 border border-[#e8e4de]/60 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {source.avatar ? (
                      <img src={source.avatar} alt={source.name} className="w-12 h-12 rounded-full ring-2 ring-[#f5f3f0]" />
                    ) : (
                      <div className={`w-12 h-12 rounded-full ring-2 ring-[#f5f3f0] flex items-center justify-center text-white font-bold ${
                        source.platform === 'youtube' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                        source.platform === 'bilibili' ? 'bg-gradient-to-br from-cyan-400 to-blue-600' :
                        source.platform === 'x' ? 'bg-gradient-to-br from-gray-700 to-gray-900' :
                        'bg-gradient-to-br from-purple-500 to-fuchsia-500'
                      }`}>
                        {source.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{source.name}</h3>
                      <p className="text-sm text-gray-400">
                        {source.username ? `@${source.username}` : 
                         source.uid ? `UID: ${source.uid}` : 
                         source.channel_id ? 'Channel' : 'Feed'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 ${
                    source.platform === 'youtube' ? 'bg-red-50 text-red-600' :
                    source.platform === 'bilibili' ? 'bg-[#00a1d6]/10 text-[#00a1d6]' :
                    source.platform === 'x' ? 'bg-gray-900 text-white' :
                    'bg-purple-50 text-purple-600'
                  } text-xs font-medium rounded-md`}>
                    {platform.label}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {source.domains.map(domain => {
                    const config = DOMAIN_CONFIG[domain as Domain];
                    return (
                      <span key={domain} className={`px-2.5 py-1 ${config?.bgClass || 'bg-gray-50'} ${config?.textClass || 'text-gray-700'} text-xs font-medium rounded-full`}>
                        {config?.label || domain}
                      </span>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#f5f3f0]">
                  <span className="text-xs text-gray-400">Active</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-[#f5f3f0] rounded-lg transition" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Remove">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Source Card */}
          <div className="border-2 border-dashed border-[#d4cdc3] rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px] hover:border-[#2d5a47] hover:bg-[#2d5a47]/5 transition cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-[#f5f3f0] group-hover:bg-[#2d5a47]/10 flex items-center justify-center mb-3 transition">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#2d5a47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <span className="text-sm text-gray-500 group-hover:text-[#2d5a47] font-medium">Add New Source</span>
            <span className="text-xs text-gray-400 mt-1">YouTube, Bilibili, X, Podcast</span>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Managing Sources</h4>
              <p className="text-sm text-amber-700">
                To add or remove sources, edit the <code className="px-1.5 py-0.5 bg-amber-100 rounded text-xs">sources.yaml</code> file in the project repository. 
                Changes will take effect after the next data refresh.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#e8e4de] mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">Oasis — Find your oasis in the desert of information</p>
        </div>
      </footer>
    </div>
  );
}

