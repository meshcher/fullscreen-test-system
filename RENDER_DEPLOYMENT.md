# Deploying to Render (Persistent Storage)

Render provides persistent storage - your data won't reset when you redeploy!

## Why Render for This App?

✅ Persistent disk storage
✅ Data survives all redeploys
✅ Free tier available
✅ No data reset worries

## Deployment Steps

### 1. Push Code to GitHub

```bash
cd /Users/omeshcheriak/fullscreen-test-system

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
gh repo create fullscreen-test --public --source=. --push
```

### 2. Sign Up for Render

Go to: https://render.com
- Click "Get Started"
- Sign up with GitHub

### 3. Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Select `fullscreen-test` repository
4. Configure:
   - **Name:** fullscreen-test
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 4. Add Environment Variables

In Render dashboard:
1. Go to **"Environment"** tab
2. Add variable:
   - **Key:** `ACTIVE_TEST`
   - **Value:** `seminar-1-march`

### 5. Deploy!

Click **"Create Web Service"**

Wait 2-3 minutes...

You'll get a URL like: `https://fullscreen-test.onrender.com`

### 6. Enable Persistent Disk (Important!)

1. In Render dashboard, go to your service
2. Click **"Disks"** in left sidebar
3. Click **"Add Disk"**
4. Configure:
   - **Name:** data
   - **Mount Path:** `/opt/render/project/src/data`
   - **Size:** 1 GB (free tier)
5. Click **"Save"**

**This makes your data persistent!**

## Using Your Deployed App

**Student URL:**
```
https://fullscreen-test.onrender.com
```

**Admin Dashboard:**
```
https://fullscreen-test.onrender.com/admin.html
Password: admin123
```

## Changing Tests on Render

### Method 1: Update Environment Variable (No Code Change)

If switching between existing tests:

1. Go to Render dashboard
2. Click your service
3. Go to **"Environment"** tab
4. Update `ACTIVE_TEST` value
5. Click **"Save Changes"**
6. Service auto-restarts with new test

**Data is NOT lost!** ✅

### Method 2: Add New Test File

If adding new test:

1. Create test file locally
2. Push to GitHub:
   ```bash
   git add tests/new-test.json
   git commit -m "Add new test"
   git push
   ```
3. Render auto-deploys
4. Update `ACTIVE_TEST` env variable

**Data is NOT lost!** ✅

## Key Differences: Vercel vs Render

| Feature | Vercel | Render |
|---------|--------|--------|
| **Data Persistence** | ❌ Resets on deploy | ✅ Persists forever |
| **Speed** | Very fast | Slightly slower |
| **Free Tier** | ✅ Yes | ✅ Yes |
| **Auto-deploy from Git** | ✅ Yes | ✅ Yes |
| **Cold starts** | Minimal | ~30 sec if inactive |
| **Best for** | Static sites | Apps with data |

## Cold Start Note

Render free tier "sleeps" after 15 minutes of inactivity.

**What this means:**
- First visitor after sleep: 30-second wait
- Then normal speed
- Not a problem for scheduled seminars

**Solution if needed:**
- Upgrade to paid plan ($7/month)
- Or use UptimeRobot to ping every 10 minutes (free)

## Vercel vs Render: Which to Use?

### Use Vercel if:
- You can remember to export CSV before deploy
- You want fastest performance
- You redeploy rarely

### Use Render if:
- You want data to persist automatically
- You update tests frequently
- You don't want to worry about exports

## Migration: Moving from Vercel to Render

Already deployed on Vercel? Here's how to switch:

1. **Export current data:**
   - Admin dashboard → Export CSV
   - Save the file!

2. **Deploy to Render** (follow steps above)

3. **Update student URL:**
   - Give students new Render URL
   - Old Vercel URL still works until you delete it

4. **Done!** Now you have persistent storage

## Troubleshooting Render

### "App is slow to load"

**Cause:** Free tier sleeps after inactivity

**Solutions:**
1. Just wait 30 seconds on first load
2. Visit the site before seminar starts
3. Upgrade to paid tier ($7/mo, no sleep)

### "Data still disappeared"

**Check:**
- Did you add the persistent disk?
- Mount path: `/opt/render/project/src/data`

### "Wrong test showing"

**Update environment variable:**
1. Render dashboard → Environment
2. Change `ACTIVE_TEST`
3. Save

## Quick Start Commands

**Deploy to Render:**
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create fullscreen-test --public --source=. --push

# 2. Go to render.com
# 3. Connect GitHub repo
# 4. Add persistent disk
# 5. Done!
```

**Update test:**
```bash
# 1. Create new test file
nano tests/new-test.json

# 2. Push to GitHub
git add tests/new-test.json
git commit -m "Add new test"
git push

# 3. Update ACTIVE_TEST env var in Render dashboard
```

---

## Summary

✅ Deploy to Render for persistent storage
✅ Data survives all redeploys
✅ No need to export before deploy
✅ Still export as backup
✅ Free tier available
✅ Perfect for test system

**Current Location:**
- Vercel: Good for static sites
- Render: Good for apps with data ← **Use this!**
