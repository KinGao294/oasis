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
│   ├── fetch_all.py      # 主入口
│   ├── transcript.py     # 字幕抓取
│   └── fetchers/         # 各平台抓取器
├── data/                 # 唯一数据源（脚本写入；Next 通过路径别名直接读取）
│   ├── feeds.json        # 内容索引
│   ├── transcripts/      # 字幕文件
│   └── summaries/        # 摘要等（若流程生成）
├── web/                  # Next.js 应用（App Router）
│   ├── app/              # 页面与路由
│   ├── components/       # 组件
│   ├── lib/              # 工具与数据加载（`@/data/*` → `../data/*`）
│   └── package.json
├── vercel.json           # Vercel：在 web 子目录安装/构建
└── .github/workflows/    # 自动化
```

**数据流**：Python 与 GitHub Actions 只更新根目录 `data/`。Next 在 `web/tsconfig.json` 将 `@/data/*` 映射到 `../data/*`，`web/next.config.ts` 启用 `experimental.externalDir`；`npm run dev` / `npm run build` 使用 **`--webpack`**（Turbopack 当前无法解析指向仓库外部的数据别名）。无需维护 `web/data/` 副本；`web/.gitignore` 忽略误放的 `web/data/`。

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

3. **启动前端**

```bash
cd web
npm install
npm run dev
```

4. 访问 http://localhost:3000

### 部署（Vercel）

1. Fork 本仓库（或连接你的 Git 仓库）
2. 在 Vercel 导入项目；根目录的 `vercel.json` 指定在 `web/` 下执行 `npm install` 与 `npm run build`
3. 使用默认 **Next.js** 构建产物（非 `output: 'export'` 的 `out/` 目录）；勿在 Vercel 中将 Output Directory 指到 `web/out`，除非你在 `next.config` 中启用了静态导出

部署上的数据来自仓库根目录的 `data/`：Vercel clone 全仓库后在 `web/` 下执行 `npm run build`，Next 从 `../data/` 读取并打进产物。

## GitHub Actions（数据抓取）

工作流：`.github/workflows/fetch-feeds.yml`。

- **触发**：每天 UTC 0:00（北京时间 8:00），以及手动 `workflow_dispatch`（可选是否抓取字幕）。
- **步骤概要**：检出仓库 → Python 3.11 安装依赖 → `python fetch_all.py`（可选 `YOUTUBE_API_KEY` 等 Secrets）→ `python transcript.py`（手动运行时可通过输入关闭；失败不阻断）→ 若根目录 `data/` 有变更则提交并推送（不再复制到 `web/data/`）。

首次启用前需在仓库 **Secrets** 中配置抓取所需密钥（如 `YOUTUBE_API_KEY`）；Twitter 等见工作流内注释。

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
- **后端/数据脚本**: Python、feedparser、youtube-transcript-api 等（见 `scripts/requirements.txt`）
- **部署**: Vercel（前端）、GitHub Actions（定时抓取并提交 `data/`）
- **数据**: 静态 JSON 文件，无独立数据库服务

## License

MIT
