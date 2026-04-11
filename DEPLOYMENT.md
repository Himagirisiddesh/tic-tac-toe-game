# 🚀 Setup & Deployment Guide

## Quick Start (Local)

### Option 1: Direct File Access
1. Download `index.html`, `style.css`, and `script.js`
2. Create a folder: `tic-tac-toe`
3. Place all three files in the folder
4. Double-click `index.html` to open in browser
5. ✅ Game ready to play!

### Option 2: Using Python (Local Server)
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Option 3: Using Node.js (Live Server)
```bash
# Install globally (one time)
npm install -g live-server

# Run in your project directory
live-server
```

---

## Production Deployment

### Deploy on GitHub Pages (FREE)

#### Step 1: Create GitHub Repository
```bash
# Create a new repo (web GUI)
1. Go to github.com
2. Click "New Repository"
3. Name: "tic-tac-toe" (or your choice)
4. Click "Create Repository"
```

#### Step 2: Upload Files
```bash
# Via Git CLI
git clone https://github.com/YOUR_USERNAME/tic-tac-toe.git
cd tic-tac-toe

# Copy your three files here
cp index.html .
cp style.css .
cp script.js .

# Push to GitHub
git add .
git commit -m "Initial commit: Premium Tic-Tac-Toe"
git push origin main
```

#### Step 3: Enable Pages
```
1. Go to your repo Settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch
5. Click Save
6. Wait 1 minute for deployment
7. Your URL: https://YOUR_USERNAME.github.io/tic-tac-toe
```

#### Step 4: Verify
```
Open your URL in browser → Game loads ✅
```

---

### Deploy on Netlify (FREE, EASIEST)

#### Step 1: Simple Drag & Drop
```
1. Go to netlify.com
2. Sign up (free account)
3. Drag & drop your folder or files
4. Game is LIVE in seconds!
5. You get a URL instantly
```

#### Step 2: Connect Domain (Optional)
```
1. In Netlify, go to Domain Settings
2. Add custom domain
3. Follow DNS instructions
4. Your domain now hosts the game
```

---

### Deploy on Vercel (FREE)

#### Step 1: Push to GitHub
```bash
# Follow GitHub Pages setup above
```

#### Step 2: Connect to Vercel
```
1. Go to vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Click "Deploy"
5. Your game is live!
```

---

### Deploy on AWS S3 + CloudFront (PROFESSIONAL)

#### Step 1: Create S3 Bucket
```bash
# AWS Console
1. Go to S3
2. Create bucket: "my-tic-tac-toe"
3. Enable static website hosting
4. Upload index.html, style.css, script.js
```

#### Step 2: Create CloudFront Distribution
```
1. Go to CloudFront
2. Create distribution
3. Point to S3 bucket
4. Enable HTTPS
5. Your URL: https://d123xyz.cloudfront.net/
```

---

### Deploy on Traditional Hosting (cPanel, Bluehost, etc.)

#### Step 1: Access File Manager
```
1. Login to cPanel
2. Go to File Manager
3. Navigate to public_html
4. Upload all three files
```

#### Step 2: Configure (if needed)
```
1. Set index.html as default document
2. Ensure 755 permissions on folders
3. Ensure 644 permissions on files
```

#### Step 3: Access Game
```
Your game is at: https://yourdomainname.com
```

---

## Docker Deployment (Advanced)

### Dockerfile
```dockerfile
FROM nginx:latest

# Copy files to nginx web root
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]
```

### Build & Run
```bash
# Build image
docker build -t tic-tac-toe .

# Run container
docker run -p 80:80 tic-tac-toe

# Visit: http://localhost
```

---

## Performance Optimization

### Enable Compression (Server)
```
Add to .htaccess (Apache):
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
</IfModule>
```

### Caching Headers
```
Add to .htaccess:
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### CDN Integration (Optional)
```
1. Use Cloudflare (free)
2. Point domain to Cloudflare nameservers
3. Enable caching and minification
4. Instant global CDN performance
```

---

## SEO Optimization

### Add Meta Tags (in index.html head)
```html
<meta name="description" content="Premium Tic-Tac-Toe game with AI opponent">
<meta name="keywords" content="tic tac toe, game, ai, minimax">
<meta name="theme-color" content="#6366f1">
<meta property="og:title" content="Premium Tic-Tac-Toe">
<meta property="og:description" content="Play against AI with Minimax algorithm">
<meta property="og:image" content="https://yoursite.com/screenshot.png">
```

---

## PWA (Progressive Web App) - Optional

### Create manifest.json
```json
{
  "name": "Premium Tic-Tac-Toe",
  "short_name": "Tic-Tac-Toe",
  "description": "Professional Tic-Tac-Toe game with AI",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Add to index.html
```html
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
```

---

## Monitoring & Analytics (Optional)

### Google Analytics
```html
<!-- Add to index.html before closing </body> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Error Tracking (Sentry)
```html
<script src="https://browser.sentry-cdn.com/6.19.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
</script>
```

---

## Troubleshooting

### Problem: Styles not loading
**Solution**: Ensure CSS file is in same directory as HTML and named exactly `style.css`

### Problem: Game not responding
**Solution**: Open browser console (F12), check for JavaScript errors

### Problem: AI too slow
**Solution**: This is normal - Minimax takes time on hard mode. Already optimized!

### Problem: Data not saving
**Solution**: Check if localStorage is enabled. Private browsing disables it.

### Problem: Not responsive on mobile
**Solution**: Check viewport meta tag is in HTML head. Ensure CSS media queries load.

---

## Best Practices Checklist

- [ ] All files uploaded to same directory
- [ ] HTTPS enabled (automatic with GitHub Pages/Netlify)
- [ ] Tested on desktop browser (Chrome, Firefox, Safari)
- [ ] Tested on mobile (iPhone, Android)
- [ ] Tested in dark mode
- [ ] Tested AI difficulty levels
- [ ] Verified LocalStorage data persists
- [ ] Game history shows correctly
- [ ] Sound works (or gracefully fails)
- [ ] No console errors
- [ ] Links all work
- [ ] Page title is visible
- [ ] Favicon loaded (optional)
- [ ] SEO meta tags present (optional)

---

## Post-Deployment

### Update README
```bash
# Add deployment URL to your README
# Add "Live Demo" section
# Link to the live game
```

### Share Your Work
```
LinkedIn: "Just launched my Premium Tic-Tac-Toe game with Minimax AI!"
Twitter: "Built a professional Tic-Tac-Toe game with Minimax algorithm"
Portfolio: Add to your projects section with screenshot
GitHub: Add to your public repositories
```

### Get Feedback
```
1. Ask friends to play
2. Test on different devices
3. Collect feedback
4. Make improvements
```

---

## Monetization (Optional)

### Add Ads
```html
<!-- Google AdSense (after approval) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```

### Add Donations
```html
<!-- Ko-fi Button -->
<iframe id='kofiframe' src='https://ko-fi.com/...' height='712' width='500'></iframe>
```

---

## Certificate for Portfolio

When hosting on your domain with HTTPS, you can showcase:
- ✅ Live game at professional URL
- ✅ SSL/TLS certificate (security)
- ✅ Custom domain (credibility)
- ✅ Fast performance (CDN)
- ✅ Professional deployment

This impresses recruiters! 🎯

---

**Ready to deploy?** Pick your platform and follow the steps above.
**Need help?** Check the troubleshooting section or review the code comments.

Good luck! 🚀
