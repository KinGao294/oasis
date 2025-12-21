'use client';

import { Domain, Platform, DOMAIN_CONFIG, PLATFORM_CONFIG } from '@/lib/types';

interface FilterBarProps {
  selectedDomains: Domain[];
  selectedPlatforms: Platform[];
  onDomainChange: (domains: Domain[]) => void;
  onPlatformChange: (platforms: Platform[]) => void;
}

export default function FilterBar({
  selectedDomains,
  selectedPlatforms,
  onDomainChange,
  onPlatformChange,
}: FilterBarProps) {
  const domains: Domain[] = ['AI', 'Business', 'Global', 'Creator', 'Dev', 'Design', 'Tech', 'Growth'];
  const platforms: Platform[] = ['youtube', 'bilibili', 'x', 'podcast'];

  const toggleDomain = (domain: Domain) => {
    if (selectedDomains.includes(domain)) {
      onDomainChange(selectedDomains.filter(d => d !== domain));
    } else {
      onDomainChange([...selectedDomains, domain]);
    }
  };

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Domain Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onDomainChange([])}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedDomains.length === 0
              ? 'bg-[#2d5a47] text-white shadow-sm'
              : 'bg-white/70 text-gray-600 border border-[#e8e4de] hover:border-[#2d5a47] hover:text-[#2d5a47]'
          }`}
        >
          All
        </button>
        
        {domains.map(domain => {
          const config = DOMAIN_CONFIG[domain];
          const isSelected = selectedDomains.includes(domain);
          
          return (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                isSelected
                  ? 'bg-[#2d5a47] text-white shadow-sm'
                  : 'bg-white/70 text-gray-600 border border-[#e8e4de] hover:border-[#2d5a47] hover:text-[#2d5a47]'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Platform Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 mr-2">Platform:</span>
        
        {platforms.map(platform => {
          const config = PLATFORM_CONFIG[platform];
          const isSelected = selectedPlatforms.includes(platform);
          
          return (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                isSelected
                  ? `${config.bgClass} text-white shadow-sm`
                  : 'bg-white/70 text-gray-600 border border-[#e8e4de] hover:border-gray-400'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

