# Oasis Web（Next.js）

本目录为 Oasis 的前端，使用 **Next.js 16**（App Router）与 **React 19**。

## 数据

应用从 **`web/data/`** 读取 `feeds.json`、`transcripts/`、`summaries/` 等。Python 抓取脚本写入仓库根目录的 **`data/`**。若你刚运行过抓取或只更新了根目录 `data/`，请在仓库根目录同步后再启动前端：

```bash
rm -rf web/data
cp -R data web/data
```

完整说明（Vercel、GitHub Actions、环境变量）见仓库根目录 [README.md](../README.md)。

## 本地开发

```bash
cd web
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 构建与生产启动

```bash
npm run build
npm run start
```

## 其他

- 页面入口：`app/page.tsx` 等。
- 外链图片域名在 `next.config.ts` 的 `images.remotePatterns` 中配置。
