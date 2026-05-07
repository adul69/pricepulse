# PricePulse

AI-powered electronics price comparison across global stores.

## 🚀 Live Demo
Coming soon...

## ✨ Features
- Compare prices across Amazon, eBay, Best Buy, Newegg
- AI-powered analysis via MiMo V2.5
- Smart recommendations based on price, shipping, stock, and ratings
- Demo mode — works without API keys
- Dark theme with glassmorphism UI

## 🏗️ Architecture
```
User (Form) → Next.js API Route → MiMo AI → Price Analysis → Results UI
```

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, TypeScript
- **AI/LLM:** MiMo V2.5 (Xiaomi)
- **Deploy:** Vercel

## 🚀 Getting Started

```bash
git clone https://github.com/adul69/pricepulse.git
cd pricepulse
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `MIMO_API_KEY` | MiMo API key from platform.xiaomimimo.com | No (demo mode if empty) |

## 📦 Deploy to Vercel

1. Push to GitHub
2. Connect repo at [vercel.com/new](https://vercel.com/new)
3. Set `MIMO_API_KEY` in Environment Variables
4. Deploy!

## 📄 License

MIT
