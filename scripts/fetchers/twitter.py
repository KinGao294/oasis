"""
Twitter/X RSS Fetcher
Fetches tweets via Nitter RSS (note: may be unstable)
"""

import re
import feedparser
from datetime import datetime
from dateutil import parser as date_parser


def extract_images(content):
    """Extract image URLs from HTML content"""
    if not content:
        return []
    
    images = []
    # Find all img tags
    for match in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', content):
        url = match.group(1)
        # Filter to only include actual tweet images
        if 'pbs.twimg.com' in url or 'pic.twitter.com' in url:
            images.append(url)
    
    return images


def clean_content(html):
    """Remove HTML tags and clean up content"""
    if not html:
        return ""
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', html)
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Decode HTML entities
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')
    text = text.replace('&#39;', "'")
    
    return text


def fetch_twitter(source):
    """
    Fetch tweets from a Twitter/X user via Nitter
    
    Args:
        source: dict with keys: id, name, username, domains
    
    Returns:
        list of feed items
    """
    username = source.get("username")
    if not username:
        raise ValueError(f"No username for {source['name']}")
    
    # Try multiple Nitter instances (they can be unstable)
    nitter_instances = [
        "nitter.poast.org",
        "nitter.privacydev.net",
        "nitter.net",
    ]
    
    feed = None
    for instance in nitter_instances:
        try:
            rss_url = f"https://{instance}/{username}/rss"
            feed = feedparser.parse(rss_url)
            if feed.entries:
                break
        except:
            continue
    
    if not feed or not feed.entries:
        # Return empty list instead of raising error (X is often unstable)
        return []
    
    items = []
    
    for entry in feed.entries[:10]:  # Limit to 10 most recent
        # Extract tweet ID from link
        link = entry.get("link", "")
        tweet_id_match = re.search(r'/status/(\d+)', link)
        if not tweet_id_match:
            continue
        
        tweet_id = tweet_id_match.group(1)
        
        # Parse published date
        published = entry.get("published", "")
        try:
            published_dt = date_parser.parse(published)
            published = published_dt.isoformat()
        except:
            published = datetime.utcnow().isoformat()
        
        # Get content and images
        description = entry.get("description", "")
        content = clean_content(description)
        images = extract_images(description)
        
        # Convert Nitter link to Twitter link
        twitter_url = f"https://x.com/{username}/status/{tweet_id}"
        
        item = {
            "id": f"x_{tweet_id}",
            "source": source["name"],
            "sourceId": source["id"],
            "sourceAvatar": source.get("avatar"),
            "platform": "x",
            "domains": source.get("domains", []),
            "title": None,  # Tweets don't have titles
            "content": content,
            "url": twitter_url,
            "images": images if images else None,
            "published": published,
            "hasTranscript": False,
        }
        
        items.append(item)
    
    return items

