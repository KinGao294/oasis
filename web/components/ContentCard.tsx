'use client';

import Link from 'next/link';
import { FeedItem, PLATFORM_CONFIG, DOMAIN_CONFIG, Domain } from '@/lib/types';
import { formatDuration, formatRelativeTime, isItemSaved, saveItem, unsaveItem } from '@/lib/data';
import { useState, useEffect } from 'react';

interface ContentCardProps {
  item: FeedItem;
  onSaveChange?: () => void;
}

export default function ContentCard({ item, onSaveChange }: ContentCardProps) {
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    setSaved(isItemSaved(item.id));
  }, [item.id]);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (saved) {
      unsaveItem(item.id);
      setSaved(false);
    } else {
      saveItem(item.id);
      setSaved(true);
    }
    onSaveChange?.();
  };

  const platform = PLATFORM_CONFIG[item.platform];
  
  // Twitter/X posts are inline, not clickable to detail
  if (item.platform === 'x') {
    return (
      <article className="card-hover bg-white rounded-2xl overflow-hidden border border-[#e8e4de]/60 group relative">
        <button 
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition shadow-sm hover:scale-110 ${
            saved ? '' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <svg className={`w-4 h-4 ${saved ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </button>
        
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 ring-2 ring-[#f5f3f0] flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
              {item.source.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{item.source}</span>
                <span className={`px-2 py-0.5 ${platform.bgClass} text-white text-xs font-medium rounded-md ml-auto`}>X</span>
              </div>
              <p className="text-gray-700 text-[15px] leading-relaxed mb-4">{item.content}</p>
              
              {item.images && item.images.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-[#e8e4de] mb-4">
                  <img src={item.images[0]} alt="" className="w-full aspect-video object-cover" />
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {item.domains.slice(0, 2).map(domain => {
                  const config = DOMAIN_CONFIG[domain as Domain];
                  return (
                    <span key={domain} className={`px-2.5 py-1 ${config?.bgClass || 'bg-gray-50'} ${config?.textClass || 'text-gray-700'} text-xs font-medium rounded-full`}>
                      {config?.label || domain}
                    </span>
                  );
                })}
                <span className="text-xs text-gray-400">{formatRelativeTime(item.published)}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Video/Podcast cards
  return (
    <article className="card-hover bg-white rounded-2xl overflow-hidden border border-[#e8e4de]/60 group relative">
      <button 
        onClick={handleSaveClick}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition shadow-sm hover:scale-110 ${
          saved ? '' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <svg className={`w-4 h-4 ${saved ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
      </button>
      
      <Link href={`/detail/${item.id}`} className="block">
        <div className="relative aspect-video bg-gray-100">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title || ''} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              item.platform === 'podcast' 
                ? 'bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500' 
                : 'bg-gradient-to-br from-cyan-400 to-blue-600'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                {item.platform === 'podcast' ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {item.duration && (
            <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur">
              {formatDuration(item.duration)}
            </span>
          )}
          
          <span className={`absolute top-3 left-3 px-2.5 py-1 ${platform.bgClass} text-white text-xs font-medium rounded-md`}>
            {platform.label}
          </span>
        </div>
        
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 leading-snug">
            {item.title}
          </h3>
          
          <div className="flex items-center gap-2.5 mb-3">
            {item.sourceAvatar ? (
              <img src={item.sourceAvatar} alt={item.source} className="w-7 h-7 rounded-full ring-2 ring-[#f5f3f0]" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2d5a47] to-[#1a3629] ring-2 ring-[#f5f3f0] flex items-center justify-center text-white text-xs font-bold">
                {item.source.charAt(0)}
              </div>
            )}
            <span className="text-sm text-gray-600">{item.source}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {item.domains.slice(0, 2).map(domain => {
              const config = DOMAIN_CONFIG[domain as Domain];
              return (
                <span key={domain} className={`px-2.5 py-1 ${config?.bgClass || 'bg-gray-50'} ${config?.textClass || 'text-gray-700'} text-xs font-medium rounded-full`}>
                  {config?.label || domain}
                </span>
              );
            })}
            <span className="text-xs text-gray-400">{formatRelativeTime(item.published)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

