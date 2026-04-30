# 🍩 甜甜翻译 — 中越智能互译

> 中文 ⇄ 越南语 · 智能互译 · 随身翻译助手

## ✨ 功能

- 🔤 **智能翻译** — 中文 ↔ 越南语双向翻译，基于 DeepSeek AI
- 📷 **图片 OCR** — 拍照/上传图片，自动识别文字并翻译（通义千问 VL）
- 💬 **双语对话** — 模拟中越对话场景，实时双语显示
- 🏠 **实时聊天房** — WebSocket 多人实时聊天，自动翻译消息
- 🎨 **精美 UI** — 玻璃拟态 + 渐变，暗色主题，移动端优先

## 🛠 技术栈

| 层 | 技术 |
|---|---|
| 前端 | HTML5 + CSS3 + Vanilla JS（单页应用） |
| 后端 | Node.js + WebSocket (`ws`) |
| 翻译 | DeepSeek Chat API |
| OCR | 阿里云通义千问 Qwen-VL |
| Serverless | Vercel Functions (`api/`) |
| 托管 | GitHub Pages + 自定义域名 |

## 📁 项目结构

```
chogt-website/
├── index.html          # 主页面（SPA）
├── server.js           # Node.js 后端（WebSocket + API 代理）
├── api/
│   ├── translate.js    # Vercel Serverless 翻译接口
│   └── ocr.js          # Vercel Serverless OCR 接口
├── vercel.json         # Vercel 部署配置
├── manifest.json       # PWA Manifest
├── favicon.svg         # 网站图标
├── apple-touch-icon.png # iOS 主屏图标
└── CNAME               # 自定义域名绑定
```

## 🚀 部署

- **前端静态文件** → GitHub Pages，通过 `CNAME` 绑定 `www.chogt.com`
- **API** → Vercel Serverless Functions (`api/` 目录)
- **WebSocket 服务** → 独立服务器运行 `server.js`

## 👤 作者

鹏哥 · 微信号：D399HV

## 📄 License

MIT
