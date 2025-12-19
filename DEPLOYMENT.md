# 🚀 Deployment Guide

This guide covers deploying your POS system to production.

---

## 📋 Prerequisites

- Supabase account (free tier works)
- Vercel account (for frontend hosting)
- Railway/Render account (for backend hosting)

---

## 1️⃣ Database Deployment (Supabase)

### Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **"New Project"**
3. Fill in:
   - Project name: `pos-cashier`
   - Database password: (generate a strong password)
   - Region: **Singapore** (closest to Indonesia)
4. Wait for project to initialize (~2 minutes)

### Get Connection String

1. Go to **Settings → Database**
2. Scroll to **Connection string → URI**
3. Copy the connection string:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
   ```

### Run Migrations

```powershell
# In your local backend folder
cd backend

# Update .env with Supabase connection string
# DATABASE_URL="postgresql://postgres:..."

# Run migrations
npx prisma migrate deploy

# Verify tables created
npx prisma studio
```

---

## 2️⃣ Backend Deployment (Railway)

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account
5. Select `itzcaesar/retail-cashier` repository
6. Click **"Deploy Now"**

### Configure Environment Variables

1. Go to your project → **Variables** tab
2. Add these variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-pos-frontend.vercel.app
   ```

### Set Root Directory

1. Go to **Settings**
2. Under **Build**, set:
   - **Root Directory**: `backend`
   - **Install Command**: `npm install`
   - **Build Command**: `npx prisma generate`
   - **Start Command**: `node src/index.js`

3. **Redeploy**

### Get Backend URL

- Railway will give you a URL like: `https://pos-cashier-production.up.railway.app`
- Copy this URL for frontend configuration

---

## 3️⃣ Frontend Deployment (Vercel)

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..." → "Project"**
3. Import `itzcaesar/retail-cashier`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Environment Variables

Add this variable:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Deploy

1. Click **"Deploy"**
2. Wait for deployment (~2 minutes)
3. Get your URL: `https://pos-cashier.vercel.app`

---

## 4️⃣ Update CORS

Go back to **Railway** backend:

1. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://pos-cashier.vercel.app
   ```
2. Redeploy

---

## 5️⃣ Testing Production

1. Open your Vercel URL
2. Test scanning a barcode
3. Create a product
4. Complete a checkout
5. View reports

---

## 🔒 Security Checklist

- [ ] Use strong database password
- [ ] Enable Row Level Security in Supabase (optional)
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` files to git
- [ ] Set up HTTPS (automatic on Vercel/Railway)

---

## 📱 Mobile App (PWA)

Your POS automatically works as a Progressive Web App:

### Install on Android/iOS

1. Open the Vercel URL in Chrome/Safari
2. Tap **"Add to Home Screen"**
3. The app installs like a native app
4. Works offline for cached pages

### Enable Fullscreen Mode

On Android tablets:
1. Go to Settings → Apps → Your POS App
2. Enable **"Display over other apps"**
3. Use **App Pinning** for kiosk mode

---

## 🔧 Troubleshooting

### Backend won't connect to database

- Check `DATABASE_URL` is correct
- Verify Supabase project is active
- Check network firewall settings

### Frontend API errors

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Verify CORS settings

### Scanner not working

- Ensure scanner is in HID keyboard mode
- Test by typing in a text editor first
- Check scanner sends ENTER after scan

---

## 📊 Monitoring

### Railway Logs

```bash
# View real-time logs
railway logs --follow
```

### Vercel Analytics

- Go to your project → **Analytics**
- View page views, performance metrics

### Supabase Database

- Go to **Database → Table Editor**
- View all data in real-time

---

## 🔄 Updates & Maintenance

### Deploy Updates

```powershell
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main
```

Both Vercel and Railway will **auto-deploy** from GitHub!

### Database Migrations

```powershell
# Create new migration
cd backend
npx prisma migrate dev --name your_migration_name

# Deploy to production
git push  # Railway will run migrations automatically
```

---

## 💰 Cost Estimate

**Free Tier (Perfect for MVP):**
- Supabase: Free (500MB storage)
- Railway: $5/month credit (enough for small POS)
- Vercel: Free (unlimited deployments)

**Total: FREE** for small retail stores!

---

## 🆘 Support

If you encounter issues:

1. Check Railway/Vercel logs
2. Verify all environment variables
3. Test database connection
4. Check GitHub Issues

---

**You're all set! Your POS is now production-ready.** 🎉
