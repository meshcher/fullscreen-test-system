# Post-Deployment Management Guide

## Adding/Changing Tests After Deployment

### Quick Method: Switch Between Existing Tests

**1. Edit .env file:**
```bash
cd /Users/omeshcheriak/fullscreen-test-system
nano .env
```

Change:
```bash
ACTIVE_TEST=seminar-1-march
```

To:
```bash
ACTIVE_TEST=seminar-2-april
```

**2. Redeploy:**
```bash
vercel --prod
```

**3. Done!** New test is now active at your URL.

### Adding a Brand New Test

**1. Create test file locally:**
```bash
cd /Users/omeshcheriak/fullscreen-test-system/tests
nano my-new-test.json
```

Add questions:
```json
{
  "testId": "my-new-test",
  "title": "My New Test",
  "duration": 30,
  "randomizeQuestions": true,
  "randomizeOptions": true,
  "questions": [...]
}
```

**2. Activate it:**
```bash
cd ..
echo "ACTIVE_TEST=my-new-test" > .env
```

**3. Redeploy:**
```bash
vercel --prod
```

**4. Test it:**
- Go to your URL
- Verify correct test title appears
- Take a practice test

### Important Notes

**⚠️ Vercel Storage Limitation:**
- Data (results) resets when you redeploy!
- **Always export CSV before redeploying**

**Solution:**
1. Open admin dashboard
2. Export CSV
3. Save somewhere safe
4. Then redeploy

---

## Downloading Results (CSV Export)

### Method 1: Admin Dashboard (Recommended)

**Step-by-Step:**

1. **Open admin dashboard:**
   - Local: `http://localhost:3000/admin.html`
   - Deployed: `https://your-app.vercel.app/admin.html`

2. **Login:**
   - Password: `admin123` (or your custom password)

3. **Filter (optional):**
   - Use dropdown: "Filter by test"
   - Select specific test OR "All Tests"

4. **Export:**
   - Click **"📥 Export to CSV"** button
   - File downloads automatically

5. **Open:**
   - File goes to your Downloads folder
   - Opens in Excel, Numbers, or Google Sheets

### CSV Contains:

| Column | Description |
|--------|-------------|
| Name | Student name |
| Email | Student email |
| Test | Which test they took |
| Score | Percentage (0-100) |
| Correct | Number correct |
| Total | Total questions |
| Violations | Number of violations |
| Time Violated | Total time away from test |
| Time Spent | Time spent on test |
| Submitted At | Timestamp |

### Method 2: Backup Script (All Data)

**Run the backup script:**
```bash
cd /Users/omeshcheriak/fullscreen-test-system
./backup-results.sh
```

**What it does:**
- Creates ZIP file with all data
- Saves to: `~/Desktop/test-backups/`
- Includes: users.json, sessions.json, results.json
- Filename includes timestamp

**Output:**
```
✅ Backup created: /Users/username/Desktop/test-backups/test-results-2026-03-16-143022.zip
```

### Method 3: Manual File Copy

**Copy results file:**
```bash
cp /Users/omeshcheriak/fullscreen-test-system/data/results.json ~/Desktop/
```

**View in terminal:**
```bash
cat data/results.json | python3 -m json.tool | less
```

---

## Complete Workflow: Before and After Seminar

### Before Seminar

**1. Choose which test to run:**
```bash
echo "ACTIVE_TEST=seminar-1-march" > .env
```

**2. Deploy (if using Vercel):**
```bash
vercel --prod
```

**3. Test yourself:**
- Go to the URL
- Take the test
- Verify questions are correct

**4. Share URL with students**

### During Seminar

**1. Monitor (optional):**
- Open admin dashboard
- Refresh to see new results
- Auto-refreshes every 30 seconds

### After Seminar

**1. Export results immediately:**
- Admin dashboard → Export to CSV
- Save to safe location

**2. Backup raw data (optional):**
```bash
./backup-results.sh
```

**3. For next seminar:**
- Switch test in .env
- Redeploy

---

## Best Practices

### Export Strategy

**Option A: Export after each session**
```bash
Session 1 (Week 1):
- Run test → Export CSV → Save as "week1-results.csv"

Session 2 (Week 2):
- Run test → Export CSV → Save as "week2-results.csv"
```

**Option B: Export all at end**
```bash
After all sessions:
- Filter to "All Tests"
- Export CSV
- Contains all sessions with test names
```

### Backup Before Redeploy

**ALWAYS do this before `vercel --prod`:**

```bash
# Quick backup
cp -r data ~/Desktop/backup-$(date +%Y%m%d)

# Or use script
./backup-results.sh

# Then deploy
vercel --prod
```

### Organizing Exports

Create a folder structure:
```
~/Desktop/seminar-results/
├── 2026-03-16-week1-results.csv
├── 2026-03-23-week2-results.csv
├── 2026-03-30-week3-results.csv
└── backups/
    ├── backup-2026-03-16.zip
    └── backup-2026-03-30.zip
```

---

## Troubleshooting

### "Export button doesn't work"

**Solutions:**
1. Refresh the page
2. Make sure students have submitted tests
3. Check browser console (F12) for errors

### "Results disappeared after deploy"

**Cause:** Vercel resets storage on redeploy

**Prevention:**
- Always export CSV before redeploying
- Or use Render/Railway (persistent storage)

### "Wrong test is showing"

**Check:**
```bash
# View current active test
cat .env

# Should show:
ACTIVE_TEST=your-test-name
```

**Fix:**
1. Update .env
2. Redeploy
3. Clear browser cache

### "Can't find CSV file"

**Default location:**
- Mac: `~/Downloads/`
- Windows: `C:\Users\YourName\Downloads\`

**Search for:**
- Filename: `test-results-*.csv`

---

## Alternative: Persistent Storage Solutions

If you don't want to lose data on redeploy:

### Option 1: Render (Free, Persistent)

Deploy on Render instead of Vercel:
- Data persists between deploys
- No need to export before redeploy
- Still export for backup

### Option 2: Database (Advanced)

Add MongoDB or PostgreSQL:
- Permanent storage
- Survives all redeploys
- Requires setup

---

## Quick Reference

### Export CSV
```
Admin Dashboard → 📥 Export to CSV
```

### Backup Data
```bash
./backup-results.sh
```

### Change Test
```bash
echo "ACTIVE_TEST=new-test" > .env
vercel --prod
```

### View Results File
```bash
cat data/results.json | python3 -m json.tool
```

### Admin Dashboard URLs
- Local: http://localhost:3000/admin.html
- Deployed: https://your-app.vercel.app/admin.html

---

## Important Reminders

✅ **DO:**
- Export CSV after each seminar
- Backup before redeploying
- Test yourself before students

❌ **DON'T:**
- Redeploy without exporting first (on Vercel)
- Share admin password with students
- Forget to switch test in .env

---

**Scripts Available:**
- `backup-results.sh` - Backup all data to Desktop

**Admin Dashboard:**
- URL: /admin.html
- Password: admin123
- Features: View, Filter, Export

**Data Location:**
- Local: `/Users/omeshcheriak/fullscreen-test-system/data/`
- Vercel: Ephemeral (resets on deploy)
