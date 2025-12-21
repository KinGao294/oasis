#!/usr/bin/env python3
"""
Transcript Fetcher
Fetches video transcripts/subtitles from YouTube and Bilibili
"""

import json
import re
from pathlib import Path
from datetime import datetime

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
FEEDS_FILE = DATA_DIR / "feeds.json"
TRANSCRIPTS_DIR = DATA_DIR / "transcripts"


def fetch_youtube_transcript(video_id):
    """
    Fetch transcript from YouTube video
    
    Args:
        video_id: YouTube video ID
    
    Returns:
        dict with transcript data or None if not available
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        print("  ! youtube-transcript-api not installed")
        return None
    
    try:
        # Create API instance (new API in v1.x)
        api = YouTubeTranscriptApi()
        
        # Try to get transcript in preferred languages
        transcript_list = api.list(video_id)
        
        # Prefer manual transcripts over auto-generated
        transcript = None
        language = None
        
        # Try to find manual transcript first
        try:
            transcript = transcript_list.find_manually_created_transcript(['en', 'zh-Hans', 'zh-Hant', 'zh'])
            language = transcript.language_code
        except:
            pass
        
        # Fall back to auto-generated
        if not transcript:
            try:
                transcript = transcript_list.find_generated_transcript(['en', 'zh-Hans', 'zh-Hant', 'zh'])
                language = transcript.language_code
            except:
                pass
        
        if not transcript:
            return None
        
        # Fetch the actual transcript
        transcript_data = transcript.fetch()
        
        # Build segments
        segments = []
        full_text_parts = []
        
        for item in transcript_data:
            segment = {
                "start": round(item.start, 2),
                "end": round(item.start + item.duration, 2),
                "text": item.text
            }
            segments.append(segment)
            full_text_parts.append(item.text)
        
        full_text = ' '.join(full_text_parts)
        
        return {
            "source": "youtube_caption",
            "language": language,
            "full_text": full_text,
            "segments": segments,
            "word_count": len(full_text.split()),
            "fetched_at": datetime.utcnow().isoformat() + "Z"
        }
        
    except Exception as e:
        print(f"  ! Error fetching YouTube transcript: {e}")
        return None


def fetch_bilibili_transcript(bvid):
    """
    Fetch transcript from Bilibili video (CC subtitles)
    
    Args:
        bvid: Bilibili BV ID
    
    Returns:
        dict with transcript data or None if not available
    """
    try:
        import requests
    except ImportError:
        return None
    
    try:
        # First, get video info to find subtitle URL
        # This is a simplified approach - bilibili-api-python provides more robust methods
        
        # Get cid from video page
        video_url = f"https://api.bilibili.com/x/web-interface/view?bvid={bvid}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        resp = requests.get(video_url, headers=headers, timeout=10)
        if resp.status_code != 200:
            return None
        
        data = resp.json()
        if data.get("code") != 0:
            return None
        
        cid = data.get("data", {}).get("cid")
        aid = data.get("data", {}).get("aid")
        
        if not cid or not aid:
            return None
        
        # Get subtitle list
        subtitle_url = f"https://api.bilibili.com/x/player/v2?cid={cid}&aid={aid}&bvid={bvid}"
        resp = requests.get(subtitle_url, headers=headers, timeout=10)
        
        if resp.status_code != 200:
            return None
        
        data = resp.json()
        subtitles = data.get("data", {}).get("subtitle", {}).get("subtitles", [])
        
        if not subtitles:
            return None
        
        # Get the first available subtitle
        subtitle_info = subtitles[0]
        subtitle_json_url = subtitle_info.get("subtitle_url")
        
        if not subtitle_json_url:
            return None
        
        # Fix URL protocol
        if subtitle_json_url.startswith("//"):
            subtitle_json_url = "https:" + subtitle_json_url
        
        # Fetch subtitle content
        resp = requests.get(subtitle_json_url, headers=headers, timeout=10)
        if resp.status_code != 200:
            return None
        
        subtitle_data = resp.json()
        body = subtitle_data.get("body", [])
        
        if not body:
            return None
        
        # Build segments
        segments = []
        full_text_parts = []
        
        for item in body:
            segment = {
                "start": round(item.get("from", 0), 2),
                "end": round(item.get("to", 0), 2),
                "text": item.get("content", "")
            }
            segments.append(segment)
            full_text_parts.append(item.get("content", ""))
        
        full_text = ' '.join(full_text_parts)
        
        return {
            "source": "bilibili_cc",
            "language": subtitle_info.get("lan", "zh"),
            "full_text": full_text,
            "segments": segments,
            "word_count": len(full_text),  # Chinese characters
            "fetched_at": datetime.utcnow().isoformat() + "Z"
        }
        
    except Exception as e:
        print(f"  ! Error fetching Bilibili transcript: {e}")
        return None


def save_transcript(item_id, transcript_data):
    """Save transcript to JSON file"""
    TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    
    filepath = TRANSCRIPTS_DIR / f"{item_id}.json"
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(transcript_data, f, ensure_ascii=False, indent=2)


def update_feed_with_transcript(feeds_data, item_id, transcript_data):
    """Update feed item with transcript info"""
    for item in feeds_data.get("items", []):
        if item["id"] == item_id:
            item["hasTranscript"] = True
            # Add preview (first 200 chars)
            full_text = transcript_data.get("full_text", "")
            item["transcriptPreview"] = full_text[:200] + "..." if len(full_text) > 200 else full_text
            break


def fetch_all_transcripts():
    """Fetch transcripts for all video items in feeds.json"""
    if not FEEDS_FILE.exists():
        print("No feeds.json found. Run fetch_all.py first.")
        return
    
    with open(FEEDS_FILE, "r", encoding="utf-8") as f:
        feeds_data = json.load(f)
    
    items = feeds_data.get("items", [])
    video_items = [i for i in items if i["platform"] in ("youtube", "bilibili")]
    
    print(f"Found {len(video_items)} video items to process")
    
    fetched = 0
    skipped = 0
    failed = 0
    
    for item in video_items:
        item_id = item["id"]
        
        # Skip if transcript already exists
        transcript_file = TRANSCRIPTS_DIR / f"{item_id}.json"
        if transcript_file.exists():
            skipped += 1
            continue
        
        print(f"  Fetching: {item.get('title', item_id)[:50]}...")
        
        transcript = None
        
        if item["platform"] == "youtube":
            # Extract video ID
            video_id = item_id.replace("yt_", "")
            transcript = fetch_youtube_transcript(video_id)
        
        elif item["platform"] == "bilibili":
            # Extract BV ID
            bvid = item_id.replace("bl_", "")
            transcript = fetch_bilibili_transcript(bvid)
        
        if transcript:
            save_transcript(item_id, transcript)
            update_feed_with_transcript(feeds_data, item_id, transcript)
            fetched += 1
            print(f"    ✓ Got {transcript['word_count']} words")
        else:
            failed += 1
            print(f"    ✗ No transcript available")
    
    # Save updated feeds
    with open(FEEDS_FILE, "w", encoding="utf-8") as f:
        json.dump(feeds_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nTranscript fetch complete:")
    print(f"  Fetched: {fetched}")
    print(f"  Skipped (existing): {skipped}")
    print(f"  Failed/unavailable: {failed}")


if __name__ == "__main__":
    print("=" * 50)
    print("Oasis Transcript Fetcher")
    print("=" * 50)
    fetch_all_transcripts()

