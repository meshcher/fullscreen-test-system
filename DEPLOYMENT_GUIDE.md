# How to Deploy Your Test System for Seminar Participants

This guide will help you deploy your fullscreen test system so your seminar participants can access it online.

---

## Quick Start: Deploy in 5 Minutes with Vercel (RECOMMENDED)

Vercel is free, fast, and perfect for this app.

### Step 1: Install Vercel

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd /Users/omeshcheriak/fullscreen-test-system
vercel
```

### Step 3: Answer the Prompts

- **"Set up and deploy?"** → Type `y` and press Enter
- **"Which scope?"** → Just press Enter (uses your account)
- **"Link to existing project?"** → Type `n` and press Enter
- **"What's your project's name?"** → Type `fullscreen-test` (or any name) and press Enter
- **"In which directory is your code?"** → Just press Enter (uses current directory)
- **"Want to override settings?"** → Type `n` and press Enter

### Step 4: Get Your URL

After 30 seconds, you'll see something like:

```
✅ Deployed to production: https://fullscreen-test-abc123.vercel.app
```

### Step 5: Share with Your Participants

**For Students:**
- URL: `https://your-url.vercel.app`
- They enter their name and email to start

**For You (Admin):**
- URL: `https://your-url.vercel.app/admin.html`
- Password: `admin123` (change this before deploying - see below!)

---

## Before Your Seminar: Customize Your Test

### 1. Change the Questions

Open `server.js` and find this section (around line 36):

```javascript
const TEST_CONFIG = {
    title: "Sample Test",
    duration: 10, // minutes
    questions: [
        {
            id: 1,
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correct: 1  // Index: 0=first option, 1=second, 2=third, 3=fourth
        },
        // Add your questions here...
    ]
};
```

**Example of adding a question:**

```javascript
{
    id: 6,
    question: "What is the capital of Germany?",
    options: ["Munich", "Berlin", "Hamburg", "Frankfurt"],
    correct: 1  // Berlin is the second option (index 1)
}
```

### 2. Change Test Duration

In the same `TEST_CONFIG` section:

```javascript
duration: 30,  // Change to your desired minutes
```

### 3. Change Admin Password (IMPORTANT!)

Find line 72 in `server.js`:

```javascript
const ADMIN_PASSWORD = "admin123";
```

Change to something secure:

```javascript
const ADMIN_PASSWORD = "YourSecurePassword123";
```

### 4. Redeploy with Your Changes

After making changes:

```bash
vercel --prod
```

This updates your live site with the new questions/settings. The URL stays the same!

---

## Alternative Deployment Options

### Option 2: Render (If Vercel doesn't work)

1. **Go to:** https://render.com
2. **Sign up** for a free account
3. **Push your code to GitHub first:**
   ```bash
   cd /Users/omeshcheriak/fullscreen-test-system
   git init
   git add .
   git commit -m "Initial commit"

   # Create GitHub repo (requires GitHub CLI)
   gh repo create fullscreen-test --public --source=. --push
   ```

4. **In Render:**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account
   - Select the `fullscreen-test` repository
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Click **"Create Web Service"**

5. **Wait 2-3 minutes** for deployment

6. **Your URL:** `https://fullscreen-test.onrender.com`

### Option 3: Railway

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repo** (need GitHub setup from Option 2)
5. Railway auto-detects Node.js and deploys
6. **Get your URL** from the Railway dashboard

---

## During Your Seminar

### For Students:

1. **Share the URL:** Give everyone the main URL (without `/admin.html`)
   - Example: `https://fullscreen-test-abc123.vercel.app`

2. **Students will:**
   - Enter their name and email
   - Read the instructions
   - Click "Enter Fullscreen Mode"
   - Take the test
   - See their results immediately

3. **Important Reminders for Students:**
   - Must use a desktop/laptop (not phone)
   - Best browsers: Chrome, Firefox, or Edge
   - Don't press ESC during the test
   - Don't switch to other apps/desktops
   - All violations are tracked!

### For You (Admin):

1. **Open admin dashboard:**
   - URL: `https://your-url.vercel.app/admin.html`
   - Enter your admin password

2. **Monitor results:**
   - Dashboard auto-refreshes every 30 seconds
   - See all students' scores, violations, and time
   - Click "View Details" for individual breakdown

3. **Export results:**
   - Click **"Export to CSV"** button
   - Opens in Excel/Google Sheets
   - Includes all data: scores, violations, time violated, etc.

---

## Test Before Your Seminar

### Do This the Day Before:

1. **Take the test yourself:**
   - Go through the full student experience
   - Intentionally violate fullscreen (switch apps)
   - Check if violations are recorded

2. **Check admin dashboard:**
   - Log in as admin
   - Verify you can see your test results
   - Test the CSV export

3. **Test with a friend:**
   - Have someone take the test remotely
   - Make sure their results appear in your dashboard

---

## Common Issues & Solutions

### "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org

### "vercel: command not found"
**Solution:** Run `npm install -g vercel`

### Students can't access the site
**Solutions:**
- Verify the URL is correct
- Check deployment completed (look for ✅ in terminal)
- Open the URL yourself first to test

### Want to update questions after deploying?
**Solution:**
1. Edit `server.js`
2. Run `vercel --prod` again
3. Same URL, updated content!

### Forgot admin password?
**Solution:**
1. Check `server.js` line 72
2. Or change it and redeploy with `vercel --prod`

### Results not showing in admin dashboard?
**Solutions:**
- Make sure you deployed with the latest code
- Check that admin password is correct
- Try refreshing the page

### Students stuck on login screen?
**Solution:**
- Make sure they entered both name AND email
- Check browser console for errors (F12)

---

## Important Notes

### Data Storage

- All test results are stored in the `data/` folder on the server
- **Vercel limitation:** Data resets when you redeploy
- **For permanent storage:** Consider using Option 2 (Render) or add a database

### Security Notes

- Change the default admin password before deploying
- The current system stores data in JSON files (simple, not enterprise-grade)
- For high-stakes exams, consider adding proper database + encryption

### Browser Compatibility

**Best Support:**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (macOS)

**Limited Support:**
- ⚠️ Mobile browsers (fullscreen API limited)

---

## Quick Reference Commands

### Deploy for first time:
```bash
vercel
```

### Update after making changes:
```bash
vercel --prod
```

### Run locally for testing:
```bash
npm start
# Then open: http://localhost:3000
```

### Stop local server:
```bash
# Press Ctrl+C in the terminal
```

---

## Checklist for Seminar Day

- [ ] Questions are customized in `server.js`
- [ ] Test duration is set correctly
- [ ] Admin password is changed and secure
- [ ] Deployed to Vercel/Render/Railway
- [ ] Tested the system yourself
- [ ] Had someone else test it remotely
- [ ] Admin dashboard works
- [ ] CSV export works
- [ ] URL is bookmarked and ready to share
- [ ] Backup plan ready (paper test?) if tech fails

---

## Getting Help

### If something breaks:

1. **Check server logs:**
   - Vercel: https://vercel.com/dashboard → Your Project → Logs
   - Render: Dashboard → Your Service → Logs

2. **Run locally to debug:**
   ```bash
   npm start
   ```
   Then check http://localhost:3000

3. **Common fixes:**
   - Redeploy: `vercel --prod`
   - Check `server.js` for typos
   - Verify all questions have correct format

---

## Contact & Support

- Project folder: `/Users/omeshcheriak/fullscreen-test-system/`
- Main files:
  - `server.js` - Backend + test questions
  - `public/index.html` - Student test interface
  - `public/admin.html` - Admin dashboard
  - `README.md` - Full technical documentation

---

## After Your Seminar

### Save Your Results:

1. Export to CSV from admin dashboard
2. Download the `data/` folder:
   ```bash
   zip -r seminar-results.zip data/
   ```

### Keep the System Running:

- Vercel: Free tier keeps it running
- Render: Free tier may sleep after 15 min of inactivity
- Railway: Check their free tier limits

### Shut Down (Optional):

If you want to take the site offline:

**Vercel:**
```bash
vercel rm fullscreen-test
```

**Render/Railway:**
- Go to dashboard and delete the project

---

Good luck with your seminar! 🎉
