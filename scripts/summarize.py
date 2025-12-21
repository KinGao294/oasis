#!/usr/bin/env python3
"""
AI Summary Generator
Generates timeline-based summaries for video transcripts using Zhipu GLM API
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime
import requests

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
FEEDS_FILE = DATA_DIR / "feeds.json"
TRANSCRIPTS_DIR = DATA_DIR / "transcripts"
SUMMARIES_DIR = DATA_DIR / "summaries"

# Zhipu GLM API Configuration
ZHIPU_API_KEY = os.environ.get("ZHIPU_API_KEY", "ac89591d75d3416da6fbf22bb4a510ca.s7Uw6LgQpqffES9N")
ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"


def format_timestamp(seconds):
    """Convert seconds to MM:SS format"""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes}:{secs:02d}"


def call_zhipu_api(prompt, max_tokens=8000):
    """
    Call Zhipu GLM API
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {ZHIPU_API_KEY}"
    }
    
    data = {
        "model": "glm-4-flash",  # 使用免费模型
        "messages": [
            {
                "role": "system",
                "content": "你是一个专业的视频内容分析助手。你的任务是分析视频字幕，生成带时间轴的内容摘要。请用中文回复。"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": max_tokens
    }
    
    try:
        response = requests.post(ZHIPU_API_URL, headers=headers, json=data, timeout=120)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"  ! API Error: {e}")
        return None


def generate_summary(transcript_data, title):
    """
    Generate timeline summary from transcript
    """
    full_text = transcript_data.get("full_text", "")
    segments = transcript_data.get("segments", [])
    
    # 如果文本太长，截取前15000字符
    if len(full_text) > 15000:
        full_text = full_text[:15000] + "..."
    
    # 获取一些时间戳信息
    timestamps_info = ""
    if segments:
        # 每隔一定时间取一个时间点
        total_duration = segments[-1]["end"] if segments else 0
        sample_points = []
        for i in range(0, len(segments), max(1, len(segments) // 10)):
            seg = segments[i]
            sample_points.append(f"[{format_timestamp(seg['start'])}] {seg['text'][:50]}...")
        timestamps_info = "\n".join(sample_points[:10])
    
    prompt = f"""请分析以下视频内容，生成一个带时间轴的内容摘要。

视频标题: {title}

字幕内容:
{full_text}

时间参考点:
{timestamps_info}

请按以下JSON格式返回（只返回JSON，不要其他内容）:
{{
  "summary": "整体内容摘要，200-300字，5-6句话，全面概括视频主题",
  "key_points": [
    {{
      "timestamp": 0,
      "title": "要点标题",
      "content": "这里需要写150-200字的详细内容。必须包含5-6句话。第一句概括要点。第二三句展开具体内容。第四五句补充案例、数据或深入分析。第六句总结意义。"
    }}
  ],
  "tags": ["标签1", "标签2", "标签3"]
}}

【重要要求】：
1. 提取5-8个关键要点，覆盖视频主要内容
2. 时间戳根据内容位置估算
3. summary必须200字以上，5-6句话
4. 【最重要】每个key_point的content必须写150-200字、5-6句完整的话！不能只写一两句！要详细展开讲解该时间段的核心观点、论据、案例和意义
5. tags提取3-5个主题标签
6. 全部使用中文"""

    response = call_zhipu_api(prompt)
    
    if not response:
        return None
    
    # 尝试解析JSON
    try:
        # 提取JSON部分
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            summary_data = json.loads(json_match.group())
            return summary_data
    except json.JSONDecodeError as e:
        print(f"  ! JSON Parse Error: {e}")
        print(f"  Response: {response[:200]}...")
    
    return None


def save_summary(item_id, summary_data, title):
    """Save summary to JSON file"""
    SUMMARIES_DIR.mkdir(parents=True, exist_ok=True)
    
    output = {
        "video_id": item_id,
        "title": title,
        **summary_data,
        "generated_at": datetime.utcnow().isoformat() + "Z"
    }
    
    filepath = SUMMARIES_DIR / f"{item_id}.json"
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)


def update_feed_with_summary(feeds_data, item_id):
    """Update feed item to mark it has summary"""
    for item in feeds_data.get("items", []):
        if item["id"] == item_id:
            item["hasSummary"] = True
            break


def generate_all_summaries():
    """Generate summaries for all transcripts"""
    if not FEEDS_FILE.exists():
        print("No feeds.json found.")
        return
    
    with open(FEEDS_FILE, "r", encoding="utf-8") as f:
        feeds_data = json.load(f)
    
    # 获取所有有字幕的视频
    items_with_transcript = [
        item for item in feeds_data.get("items", [])
        if item.get("hasTranscript", False)
    ]
    
    print(f"Found {len(items_with_transcript)} items with transcripts")
    
    generated = 0
    skipped = 0
    failed = 0
    
    for item in items_with_transcript:
        item_id = item["id"]
        title = item.get("title", item_id)
        
        # 检查是否已有摘要
        summary_file = SUMMARIES_DIR / f"{item_id}.json"
        if summary_file.exists():
            skipped += 1
            continue
        
        # 检查是否有字幕文件
        transcript_file = TRANSCRIPTS_DIR / f"{item_id}.json"
        if not transcript_file.exists():
            continue
        
        print(f"  Generating summary: {title[:50]}...")
        
        # 读取字幕
        with open(transcript_file, "r", encoding="utf-8") as f:
            transcript_data = json.load(f)
        
        # 生成摘要
        summary_data = generate_summary(transcript_data, title)
        
        if summary_data:
            save_summary(item_id, summary_data, title)
            update_feed_with_summary(feeds_data, item_id)
            generated += 1
            print(f"    ✓ Generated {len(summary_data.get('key_points', []))} key points")
        else:
            failed += 1
            print(f"    ✗ Failed to generate summary")
    
    # 保存更新后的 feeds
    with open(FEEDS_FILE, "w", encoding="utf-8") as f:
        json.dump(feeds_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nSummary generation complete:")
    print(f"  Generated: {generated}")
    print(f"  Skipped (existing): {skipped}")
    print(f"  Failed: {failed}")


if __name__ == "__main__":
    import sys
    # 禁用输出缓冲
    sys.stdout.reconfigure(line_buffering=True)
    
    print("=" * 50)
    print("Oasis AI Summary Generator")
    print("=" * 50)
    generate_all_summaries()
