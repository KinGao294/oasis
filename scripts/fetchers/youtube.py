"""
YouTube RSS Fetcher
Fetches videos from YouTube channels via RSS
"""

import re
import feedparser
from datetime import datetime
from dateutil import parser as date_parser


def parse_duration(duration_str):
    """Parse ISO 8601 duration to seconds"""
    if not duration_str:
        return None
    
    # Try to parse PT1H30M45S format
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if match:
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        return hours * 3600 + minutes * 60 + seconds
    
    return None


def fetch_youtube(source):
    """
    Fetch videos from a YouTube channel
    
    Args:
        source: dict with keys: id, name, channel_id, domains, avatar (optional)
    
    Returns:
        list of feed items
    """
    channel_id = source.get("channel_id")
    if not channel_id:
        raise ValueError(f"No channel_id for {source['name']}")
    
    rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    
    feed = feedparser.parse(rss_url)
    
    if feed.bozo and not feed.entries:
        raise Exception(f"Failed to parse RSS: {feed.bozo_exception}")
    
    items = []
    
    for entry in feed.entries[:10]:  # Limit to 10 most recent
        video_id = entry.get("yt_videoid", "")
        
        # Extract video ID from link if not available directly
        if not video_id and entry.get("link"):
            match = re.search(r'v=([a-zA-Z0-9_-]+)', entry.link)
            if match:
                video_id = match.group(1)
        
        if not video_id:
            continue
        
        # Parse published date
        published = entry.get("published", "")
        try:
            published_dt = date_parser.parse(published)
            published = published_dt.isoformat()
        except:
            published = datetime.utcnow().isoformat()
        
        # Get thumbnail (high quality)
        thumbnail = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        
        item = {
            "id": f"yt_{video_id}",
            "source": source["name"],
            "sourceId": source["id"],
            "sourceAvatar": source.get("avatar"),
            "platform": "youtube",
            "domains": source.get("domains", []),
            "title": entry.get("title", ""),
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "thumbnail": thumbnail,
            "published": published,
            "hasTranscript": False,
            "transcriptPreview": None,
        }
        
        # Try to get duration from media content
        if hasattr(entry, 'media_content'):
            for media in entry.media_content:
                if media.get('duration'):
                    item['duration'] = int(media['duration'])
                    break
        
        items.append(item)
    
    return items

