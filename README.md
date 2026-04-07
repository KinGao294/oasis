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
├── scripts/              # Python 数据抓取脚本
│   ├── sources.yaml      # 博主配置
│   ├── fetch_all.py      # 主入口（写入仓库根目录 data/）
│   ├── transcript.py     # 字幕抓取
│   ├── summarize.py      # 可选：生成摘要（需 API Key，见脚本说明）
│   └── fetchers/         # 各平台抓取器
├── data/                 # Python 写入的抓取结果（与 web/data 需保持一致）
│   ├── feeds.json
│   ├── transcripts/
│   └── summaries/
├── web/                  # Next.js 应用（App Router）
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── data/             # 前端读取的 JSON 副本（与根目录 data/ 同步）
│   └── package.json
├── vercel.json           # Vercel：在 web 子目录安装与构建（标准 Next 输出，非静态 out/）
└── .github/workflows/    # 自动化
```

**数据目录**：脚本将结果写到仓库根目录 `data/`。Next 在 `web/data/` 下加载 JSON。抓取或更新根目录 `data/` 后请执行 **`rm -rf web/data && cp -R data web/data`**，使两处一致。GitHub Actions 在提交前会执行该同步。

## 快速开始

### 本地开发

1. **安装 Python 依赖**

```bash
cd scripts
pip install -r requirements.txt
```

2. **抓取数据**（按需配置环境变量，例如 YouTube API；见工作流与脚本注释）

```bash
python fetch_all.py
python transcript.py
```

可选：运行 `python summarize.py` 时需按 `scripts/summarize.py` 说明配置 API 相关环境变量。

3. **同步到前端数据目录**

```bash
# 在仓库根目录
rm -rf web/data
cp -R data web/data
```

4. **启动前端**

```bash
cd web
npm install
npm run dev
```

5. 访问 http://localhost:3000

### 部署（Vercel）

1. Fork 本仓库或连接 Git 仓库
2. 在 Vercel 导入项目；根目录 `vercel.json` 会在 `web/` 下执行 `npm install` 与 `npm run build`
3. 使用默认 **Next.js** 构建（非 `output: 'export'` 的 `out/`）。请勿将 Output Directory 设为 `web/out`，除非在 `next.config` 中启用了静态导出

线上数据来自仓库中的 `web/data/`（由 Actions 同步后一并提交）。

## GitHub Actions（数据抓取）

工作流：`.github/workflows/fetch-feeds.yml`。

- **触发**：每日 UTC 0:00（北京时间 8:00），以及手动 `workflow_dispatch`（可选是否抓取字幕）。
- **流程**：检出 → Python 3.11 安装依赖 → `python fetch_all.py`（如 `YOUTUBE_API_KEY` 等 Secrets）→ `python transcript.py`（手动运行时可关闭；失败不阻断）→ **`rm -rf web/data && cp -R data web/data`** → 若 `data/` 或 `web/data/` 有变更则 `git add data/ web/data/` 并推送。

首次启用前在仓库 **Secrets** 中配置所需密钥；Twitter 等见工作流内注释。

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

- **前端**: Next.js 16（App Router）、React 19、Tailwind CSS v4、TypeScript
- **数据脚本**: Python（见 `scripts/requirements.txt`）
- **部署**: Vercel（前端）、GitHub Actions（定时抓取与同步）
- **数据**: 静态 JSON 文件，无独立数据库服务

## License

MIT
