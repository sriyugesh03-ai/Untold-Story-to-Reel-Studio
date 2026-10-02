# 🚀 BeWithYugace Studio — Deployment & Creator Runbook

Welcome to **BeWithYugace Studio**! This guide details how to run, deploy, and maintain your studio application.

---

## ⚡ 1. Local Development
```bash
# Clone the repository
git clone https://github.com/sriyugesh03-ai/Untold-Story-to-Reel-Studio.git
cd Untold-Story-to-Reel-Studio

# Install packages
npm install

# Start development server with live HMR
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 2. Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"New Project"**.
3. Import `sriyugesh03-ai/Untold-Story-to-Reel-Studio`.
4. The build settings will automatically be detected from `vercel.json` (`npm run build`, output: `dist`).
5. Click **Deploy**.

---

## 🐳 3. Docker Deployment
```bash
# Build and start container
docker-compose up --build -d
```
Your application will be live at `http://localhost:3000`.

---

## ⌨️ 4. Keyboard Shortcuts for Creators
- `Cmd + K` or `Ctrl + K`: Open Studio Command Palette.
- `N`: Instantly open the Instagram DM Intake Modal.
- `Esc`: Close any open dialog or modal.

---

## 🛡️ 5. House Rules for Content
1. **Never Invent Facts**: All claims must map to verbatim proof quotes from the follower's DM.
2. **Strict 90–110 Words**: Target 30–40 second pacing for maximum retention on Instagram Reels and YouTube Shorts.
3. **Automatic PII Protection**: Phone numbers, emails, and addresses are automatically redacted before reaching the AI script engine.
