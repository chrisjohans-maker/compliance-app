# Compliance Review Tool

AI-powered marketing compliance review for FINRA 2210 / NFA 2-29.
Users need no API key — the key lives securely on the server.

---

## Project structure

```
compliance-app/
├── public/
│   └── index.html                  ← the app
├── netlify/
│   └── edge-functions/
│       └── anthropic-proxy.js      ← serverless proxy (keeps API key secret)
├── netlify.toml                    ← build + routing config
└── README.md
```

---

## Deploy in 4 steps

### Step 1 — Push to GitHub

1. Go to github.com → New repository → name it `compliance-app` → Create
2. On your Mac, open Terminal and run:

```bash
cd /path/to/compliance-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/compliance-app.git
git push -u origin main
```

### Step 2 — Connect to Netlify

1. Go to app.netlify.com
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** → authorize → select `compliance-app`
4. Build settings:
   - Build command: *(leave blank)*
   - Publish directory: `public`
5. Click **Deploy site**

### Step 3 — Add your Anthropic API key

1. In Netlify: **Site configuration → Environment variables → Add a variable**
2. Key: `ANTHROPIC_API_KEY`
3. Value: your `sk-ant-…` key from console.anthropic.com
4. Click **Save**

### Step 4 — Redeploy

1. Go to **Deploys → Trigger deploy → Deploy site**
2. Done — your team can now use the tool at your Netlify URL with no API key prompt

---

## How the proxy works

Every analysis request goes:

```
Browser → /api/analyze (Netlify Edge Function) → api.anthropic.com
```

The Edge Function adds your API key server-side before forwarding to Anthropic.
The key never touches the browser. Users see no key prompt.

---

## Updating the tool

Any push to `main` on GitHub auto-deploys to Netlify.

```bash
# Make changes, then:
git add .
git commit -m "describe change"
git push
```

Netlify deploys in ~10 seconds.

---

## Optional: restrict access

To limit the tool to your team only, enable **Netlify Identity** or set a
**Password protection** under Site configuration → Access control.
This requires no code changes.
