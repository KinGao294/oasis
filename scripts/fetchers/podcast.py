"""
Podcast RSS Fetcher
Fetches episodes from podcast RSS feeds
"""

import re
import feedparser
from datetime import datetime
from dateutil import parser as date_parser


def parse_duration(duration_str):
    """Parse duration from various formats to seconds"""
    if not duration_str:
        return None
    
    # Try HH:MM:SS or MM:SS format
    parts = str(duration_str).split(':')
    try:
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
        elif len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        else:
            # Might be just seconds
            return int(duration_str)
    except:
        pass
    
    return None


def fetch_podcast(source):
    """
    Fetch episodes from a podcast RSS feed
    
    Args:
        source: dict with keys: id, name, feed_url, domains
    
    Returns:
        list of feed items
    """
    feed_url = source.get("feed_url")
    if not feed_url:
        raise ValueError(f"No feed_url for {source['name']}")
    
    feed = feedparser.parse(feed_url)
    
    if feed.bozo and not feed.entries:
        raise Exception(f"Failed to parse RSS: {feed.bozo_exception}")
    
    # Try to get podcast artwork
    podcast_image = None
    if hasattr(feed.feed, 'image') and feed.feed.image:
        podcast_image = feed.feed.image.get('href')
    if not podcast_image and hasattr(feed.feed, 'itunes_image'):
        podcast_image = feed.feed.itunes_image.get('href')
    
    items = []
    
    for entry in feed.entries[:10]:  # Limit to 10 most recent
        # Generate unique ID
        guid = entry.get("id", "") or entry.get("link", "")
        episode_id = re.sub(r'[^a-zA-Z0-9]', '_', guid)[:50]
        
        # Parse published date
        published = entry.get("published", "")
        try:
            published_dt = date_parser.parse(published)
            published = published_dt.isoformat()
        except:
            published = datetime.utcnow().isoformat()
        
        # Get episode artwork or fall back to podcast artwork
        thumbnail = None
        if hasattr(entry, 'itunes_image'):
            thumbnail = entry.itunes_image.get('href')
        if not thumbnail:
            thumbnail = podcast_image
        
        # Get duration
        duration = None
        if hasattr(entry, 'itunes_duration'):
            duration = parse_duration(entry.itunes_duration)
        
        # Get audio URL
        audio_url = entry.get("link", "")
        if entry.get("enclosures"):
            for enc in entry.enclosures:
                if enc.get("type", "").startswith("audio/"):
                    audio_url = enc.get("href", audio_url)
                    break
        
        # Get description/summary
        description = ""
        if hasattr(entry, 'summary'):
            description = entry.summary
        elif hasattr(entry, 'description'):
            description = entry.description
        
        # Clean HTML from description
        clean_desc = re.sub(r'<[^>]+>', '', description)
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()
        
        item = {
            "id": f"pod_{source['id']}_{episode_id}",
            "source": source["name"],
            "sourceId": source["id"],
            "sourceAvatar": podcast_image,
            "platform": "podcast",
            "domains": source.get("domains", []),
            "title": entry.get("title", ""),
            "url": audio_url,
            "thumbnail": thumbnail,
            "duration": duration,
            "published": published,
            "hasTranscript": False,
            "transcriptPreview": clean_desc[:200] if clean_desc else None,
        }
        
        items.append(item)
    
    return items

