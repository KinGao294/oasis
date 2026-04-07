# Oasis 🏝️

> Find your oasis in the desert of information.

Oasis 是一个个人信息聚合平台，帮助你从海量信息中解脱出来，专注于高质量的学习内容。

## 功能特性

- 📺 **多平台支持**: YouTube、Bilibili、X/Twitter、Podcast
- 🏷️ **领域标签**: AI、商业、全球化、创作者、开发、设计等
- 📝 **视频字幕**: 自动获取 YouTube 和 Bilibili 视频的字幕/文案
- 🔍 **全文搜索**: 搜索标题、作者和字幕内容
- ⭐ **收藏管理**: 保存想看的内容，标记已完成
- 🔄 **自动更新**: GitHub Actions 每日自动抓取最新内容

## 项目结构

```
oasis/
├── scripts/           # Python 数据抓取脚本
│   ├── sources.yaml   # 博主配置
│   ├── fetch_all.py   # 主入口
│   ├── transcript.py  # 字幕抓取
│   └── fetchers/      # 各平台抓取器
├── data/              # 数据存储
│   ├── feeds.json     # 内容索引
│   └── transcripts/   # 字幕文件
├── web/               # Next.js 前端
│   ├── app/           # 页面
│   ├── components/    # 组件
│   └── lib/           # 工具函数
└── .github/workflows/ # 自动化
```

## 快速开始

### 本地开发

1. **安装 Python 依赖**
```bash
cd scripts
pip install -r requirements.txt
```

2. **抓取数据**
```bash
python fetch_all.py
python transcript.py
```

   可选：运行 `python summarize.py` 生成视频摘要时，需设置环境变量 `ZHIPU_API_KEY`（见仓库根目录 `.env.example`）。

3. **启动前端**
```bash
cd web
npm install
npm run dev
```

4. 访问 http://localhost:3000

### 部署

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 自动部署完成！

## 添加新博主

编辑 `scripts/sources.yaml`:

```yaml
sources:
  - id: your_blogger
    name: 博主名称
    platform: youtube  # youtube/bilibili/x/podcast
    channel_id: UCxxxxxx  # YouTube channel ID
    domains: [AI, Business]
```

## 技术栈

- **前端**: Next.js 14, Tailwind CSS, TypeScript
- **后端**: Python, feedparser, youtube-transcript-api
- **部署**: Vercel (前端), GitHub Actions (数据抓取)
- **数据**: 纯静态 JSON，无需数据库

## License

MIT

