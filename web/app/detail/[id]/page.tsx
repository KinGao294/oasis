'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { getFeedItem, formatDuration, formatRelativeTime, formatTimestamp, getVideoUrlWithTimestamp, isItemSaved, saveItem, unsaveItem } from '@/lib/data';
import { PLATFORM_CONFIG, DOMAIN_CONFIG, Domain, Transcript, TranscriptSegment } from '@/lib/types';

// Import transcript data statically
import transcriptData from '@/data/transcripts/yt_zjkBMFhNj_g.json';

const transcripts: Record<string, Transcript> = {
  'yt_zjkBMFhNj_g': transcriptData as Transcript,
};

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = getFeedItem(id);
  const [saved, setSaved] = useState(false);
  const [transcript, setTranscript] = useState<Transcript | null>(null);

  useEffect(() => {
    if (item) {
      setSaved(isItemSaved(item.id));
      // Load transcript if available
      if (transcripts[item.id]) {
        setTranscript(transcripts[item.id]);
      }
    }
  }, [item]);

  const handleSaveClick = () => {
    if (!item) return;
    
    if (saved) {
      unsaveItem(item.id);
      setSaved(false);
    } else {
      saveItem(item.id);
      setSaved(true);
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Content not found</h1>
            <Link href="/" className="text-[#2d5a47] hover:underline">← Back to Feed</Link>
          </div>
        </main>
      </div>
    );
  }

  const platform = PLATFORM_CONFIG[item.platform];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Feed
        </Link>

        {/* Video/Content Preview */}
        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-8 group">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title || ''} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              item.platform === 'podcast' 
                ? 'bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500' 
                : 'bg-gradient-to-br from-cyan-400 to-blue-600'
            }`} />
          )}
          
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:scale-110 transition"
            >
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </a>
          </div>
          
          {item.duration && (
            <span className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm font-medium rounded-lg backdrop-blur">
              {formatDuration(item.duration)}
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 ${platform.bgClass} text-white text-xs font-medium rounded-md`}>
              {platform.label}
            </span>
            {item.domains.map(domain => {
              const config = DOMAIN_CONFIG[domain as Domain];
              return (
                <span key={domain} className={`px-3 py-1 ${config?.bgClass || 'bg-gray-50'} ${config?.textClass || 'text-gray-700'} text-xs font-medium rounded-full`}>
                  {config?.label || domain}
                </span>
              );
            })}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {item.title || item.content}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {item.sourceAvatar ? (
                <img src={item.sourceAvatar} alt={item.source} className="w-10 h-10 rounded-full ring-2 ring-[#f5f3f0]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a47] to-[#1a3629] ring-2 ring-[#f5f3f0] flex items-center justify-center text-white font-bold">
                  {item.source.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900">{item.source}</div>
                <div className="text-sm text-gray-400">{formatRelativeTime(item.published)}</div>
              </div>
            </div>
            
            <div className="flex-1" />
            
            <button 
              onClick={handleSaveClick}
              className={`px-4 py-2 bg-white border rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                saved 
                  ? 'border-amber-300 text-amber-600 hover:bg-amber-50' 
                  : 'border-[#e8e4de] text-gray-700 hover:border-[#2d5a47] hover:text-[#2d5a47]'
              }`}
            >
              <svg className={`w-4 h-4 ${saved ? 'text-amber-500' : ''}`} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>
            
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#2d5a47] text-white rounded-xl text-sm font-medium hover:bg-[#234839] transition flex items-center gap-2"
            >
              Open Original
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-white rounded-2xl border border-[#e8e4de]/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f5f3f0] flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Transcript</h2>
              <span className="text-sm text-gray-400">{transcript.word_count.toLocaleString()} words</span>
            </div>
            
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {transcript.segments.map((segment, index) => (
                <div key={index} className="flex gap-3 group">
                  <a 
                    href={getVideoUrlWithTimestamp(item, segment.start)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="timestamp flex-shrink-0 px-2 py-1 bg-[#f5f3f0] text-gray-500 text-xs font-mono rounded-md hover:bg-[#2d5a47] hover:text-white transition"
                  >
                    {formatTimestamp(segment.start)}
                  </a>
                  <p className="text-gray-700 leading-relaxed">{segment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No transcript available */}
        {!transcript && item.hasTranscript === false && (
          <div className="bg-white rounded-2xl border border-[#e8e4de]/60 p-8 text-center">
            <div className="w-12 h-12 bg-[#f5f3f0] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No transcript available</h3>
            <p className="text-sm text-gray-500">This content doesn&apos;t have a transcript yet.</p>
          </div>
        )}

        {/* Transcript Preview (if has transcript but not loaded) */}
        {item.transcriptPreview && !transcript && (
          <div className="bg-white rounded-2xl border border-[#e8e4de]/60 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Preview</h2>
            <p className="text-gray-600 leading-relaxed">{item.transcriptPreview}</p>
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

