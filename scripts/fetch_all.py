#!/usr/bin/env python3
"""
Oasis Feed Fetcher - Main Entry Point
Fetches content from all configured sources and saves to feeds.json
"""

import json
import os
import yaml
from datetime import datetime
from pathlib import Path

from fetchers import fetch_youtube, fetch_bilibili, fetch_twitter, fetch_podcast

# Paths
SCRIPT_DIR = Path(__file__).parent
SOURCES_FILE = SCRIPT_DIR / "sources.yaml"
DATA_DIR = SCRIPT_DIR.parent / "data"
FEEDS_FILE = DATA_DIR / "feeds.json"
TRANSCRIPTS_DIR = DATA_DIR / "transcripts"


def load_sources():
    """Load sources configuration from YAML"""
    with open(SOURCES_FILE, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def save_feeds(items):
    """Save feed items to JSON file"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Sort by published date (newest first)
    items.sort(key=lambda x: x.get("published", ""), reverse=True)
    
    data = {
        "last_updated": datetime.utcnow().isoformat() + "Z",
        "count": len(items),
        "items": items
    }
    
    with open(FEEDS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(items)} items to {FEEDS_FILE}")


def fetch_all():
    """Fetch content from all sources"""
    config = load_sources()
    sources = config.get("sources", [])
    all_items = []
    
    # Group sources by platform
    youtube_sources = [s for s in sources if s["platform"] == "youtube"]
    bilibili_sources = [s for s in sources if s["platform"] == "bilibili"]
    twitter_sources = [s for s in sources if s["platform"] == "x"]
    podcast_sources = [s for s in sources if s["platform"] == "podcast"]
    
    print(f"Fetching from {len(sources)} sources...")
    
    # Fetch YouTube
    if youtube_sources:
        print(f"\n[YouTube] Fetching {len(youtube_sources)} channels...")
        for source in youtube_sources:
            try:
                items = fetch_youtube(source)
                all_items.extend(items)
                print(f"  ✓ {source['name']}: {len(items)} items")
            except Exception as e:
                print(f"  ✗ {source['name']}: {e}")
    
    # Fetch Bilibili
    if bilibili_sources:
        print(f"\n[Bilibili] Fetching {len(bilibili_sources)} users...")
        for source in bilibili_sources:
            try:
                items = fetch_bilibili(source)
                all_items.extend(items)
                print(f"  ✓ {source['name']}: {len(items)} items")
            except Exception as e:
                print(f"  ✗ {source['name']}: {e}")
    
    # Fetch Twitter/X
    if twitter_sources:
        print(f"\n[X/Twitter] Fetching {len(twitter_sources)} accounts...")
        for source in twitter_sources:
            try:
                items = fetch_twitter(source)
                all_items.extend(items)
                print(f"  ✓ {source['name']}: {len(items)} items")
            except Exception as e:
                print(f"  ✗ {source['name']}: {e}")
    
    # Fetch Podcasts
    if podcast_sources:
        print(f"\n[Podcast] Fetching {len(podcast_sources)} feeds...")
        for source in podcast_sources:
            try:
                items = fetch_podcast(source)
                all_items.extend(items)
                print(f"  ✓ {source['name']}: {len(items)} items")
            except Exception as e:
                print(f"  ✗ {source['name']}: {e}")
    
    print(f"\n{'='*50}")
    print(f"Total items fetched: {len(all_items)}")
    
    return all_items


def main():
    """Main entry point"""
    print("=" * 50)
    print("Oasis Feed Fetcher")
    print(f"Started at: {datetime.now().isoformat()}")
    print("=" * 50)
    
    # Ensure directories exist
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Fetch all content
    items = fetch_all()
    
    # Save to JSON
    save_feeds(items)
    
    print(f"\nCompleted at: {datetime.now().isoformat()}")


if __name__ == "__main__":
    main()

