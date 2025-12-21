"""
Bilibili RSS Fetcher
Fetches videos from Bilibili users via RSSHub
"""

import re
import feedparser
from datetime import datetime
from dateutil import parser as date_parser


def parse_duration_text(text):
    """Parse duration from text like '12:34' or '1:23:45' to seconds"""
    if not text:
        return None
    
    parts = text.split(':')
    try:
        if len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        elif len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    except:
        pass
    return None


def extract_bvid(url):
    """Extract BV ID from Bilibili URL"""
    match = re.search(r'BV[\w]+', url)
    if match:
        return match.group(0)
    return None


def fetch_bilibili(source):
    """
    Fetch videos from a Bilibili user via RSSHub
    
    Args:
        source: dict with keys: id, name, uid, domains
    
    Returns:
        list of feed items
    """
    uid = source.get("uid")
    if not uid:
        raise ValueError(f"No uid for {source['name']}")
    
    # Use RSSHub to fetch Bilibili user videos
    rss_url = f"https://rsshub.app/bilibili/user/video/{uid}"
    
    feed = feedparser.parse(rss_url)
    
    if feed.bozo and not feed.entries:
        raise Exception(f"Failed to parse RSS: {feed.bozo_exception}")
    
    items = []
    
    for entry in feed.entries[:10]:  # Limit to 10 most recent
        link = entry.get("link", "")
        bvid = extract_bvid(link)
        
        if not bvid:
            continue
        
        # Parse published date
        published = entry.get("published", "")
        try:
            published_dt = date_parser.parse(published)
            published = published_dt.isoformat()
        except:
            published = datetime.utcnow().isoformat()
        
        # Try to extract thumbnail from description
        thumbnail = None
        description = entry.get("description", "")
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', description)
        if img_match:
            thumbnail = img_match.group(1)
            # Fix protocol-relative URLs
            if thumbnail.startswith('//'):
                thumbnail = 'https:' + thumbnail
        
        # Clean title
        title = entry.get("title", "")
        
        item = {
            "id": f"bl_{bvid}",
            "source": source["name"],
            "sourceId": source["id"],
            "sourceAvatar": source.get("avatar"),
            "platform": "bilibili",
            "domains": source.get("domains", []),
            "title": title,
            "url": f"https://www.bilibili.com/video/{bvid}",
            "thumbnail": thumbnail,
            "published": published,
            "hasTranscript": False,
            "transcriptPreview": None,
        }
        
        items.append(item)
    
    return items

