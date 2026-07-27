<div align="center">
<img width="1200" height="475" alt="R U Monkey Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🐒 r u monkey.? — Prank Website

A fun interactive prank website with a dodging **NO** button that asks *"r u monkey.?"* and plays a hilarious laughing screen when **YES** is clicked.

## Features

- 🎯 Dodging "NO" button that actively avoids your cursor
- 🔊 Sound effects via Web Audio API (no external files needed)
- 🎊 Confetti celebration on the success screen
- 📋 Customizable victim name and question via URL params
- 🔗 Shareable prank links
- 🌓 Dark mode support

---

## 🚀 Deploy Now (Free Options)

### Option 1: Netlify (Easiest — 1 click)

1. Push this code to a GitHub repository
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect your GitHub repo
4. Netlify auto-detects Vite — the defaults work:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy**

### Option 2: Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repository
4. Vercel auto-detects Vite — click **Deploy**

### Option 3: GitHub Pages (via GitHub Actions)

This repo includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push to GitHub (main branch)
2. Go to repo **Settings** → **Pages** → Under **Source**, select **GitHub Actions**
3. Push a commit to `main` — the workflow auto-deploys to GitHub Pages

---

## 🖥️ Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/) (v18 or newer)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 📋 How to Use

### Customizing the Prank

Click the **Customize** button on the card to:
- Set the **victim's name** (optional)
- Change the **question** (default: "r u monkey.?")

### Sharing a Prank Link

After customizing, click **Copy Prank Link** — the link includes the `?name=` and `?q=` parameters so your victim sees a personalized experience.

### URL Parameters

You can manually add these to the URL:
- `?name=Alex` — Pre-fills the victim's name
- `?q=are%20you%20a%20monkey` — Custom question

Example: `https://your-site.com/?name=Alex&q=r%20u%20monkey.%3F`

---

## 🛠️ Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy on any static hosting.

---

## 📄 License

MIT

