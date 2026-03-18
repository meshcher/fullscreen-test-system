# Managing Questions and Viewing Results

## Part 1: Loading Questions from a File

### How It Works Now

Instead of editing `server.js`, you can now edit **`questions.json`** to manage your test questions!

### Location
```
/Users/omeshcheriak/fullscreen-test-system/questions.json
```

### File Format

```json
{
  "title": "Your Test Title",
  "duration": 30,
  "randomizeQuestions": true,
  "randomizeOptions": true,
  "questions": [
    {
      "id": 1,
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1
    },
    {
      "id": 2,
      "question": "Another question?",
      "options": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
      "correct": 0
    }
  ]
}
```

### Important Notes

**ID Numbers:**
- Each question must have a unique ID
- Use sequential numbers: 1, 2, 3, 4, etc.

**Correct Answer:**
- `"correct": 0` means first option (A)
- `"correct": 1` means second option (B)
- `"correct": 2` means third option (C)
- `"correct": 3` means fourth option (D)

**Settings:**
- `duration`: Test time in minutes
- `randomizeQuestions`: true/false for question randomization
- `randomizeOptions`: true/false for answer randomization

### How to Edit Questions

1. **Open the file:**
   ```bash
   open /Users/omeshcheriak/fullscreen-test-system/questions.json
   ```
   Or use any text editor (VS Code, Sublime, etc.)

2. **Edit the questions**
   - Change question text
   - Update options
   - Set correct answer index (0-3)

3. **Restart the server** (if running locally):
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

4. **Or redeploy** (if on Vercel):
   ```bash
   vercel --prod
   ```

### Example: Adding a New Question

```json
{
  "id": 6,
  "question": "What is the capital of Germany?",
  "options": ["Munich", "Berlin", "Hamburg", "Frankfurt"],
  "correct": 1
}
```

Add this to the `questions` array in `questions.json`.

### Tips

✅ **DO:**
- Keep IDs unique and sequential
- Use clear, concise questions
- Make sure `correct` index matches the right option
- Test after changes

❌ **DON'T:**
- Skip ID numbers
- Duplicate IDs
- Use `correct` values outside 0-3 range
- Forget commas between questions

---

## Part 2: Where Test Results Are Stored

### Output Location

All test data is stored in:
```
/Users/omeshcheriak/fullscreen-test-system/data/
```

### Three Files Are Created:

#### 1. `users.json`
**Contains:** Student information
```json
[
  {
    "id": "1710417600000",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-03-16T10:00:00.000Z"
  }
]
```

#### 2. `sessions.json`
**Contains:** Test sessions and violations
```json
[
  {
    "id": "1710417600001",
    "userId": "1710417600000",
    "startTime": "2026-03-16T10:05:00.000Z",
    "endTime": "2026-03-16T10:15:00.000Z",
    "active": false,
    "answerKey": {
      "1": 2,
      "2": 0
    },
    "violations": [
      {
        "type": "Switched away from test",
        "duration": 5234,
        "timestamp": "2026-03-16T10:08:00.000Z"
      }
    ]
  }
]
```

#### 3. `results.json` ⭐ MOST IMPORTANT
**Contains:** Test results, scores, and answers
```json
[
  {
    "id": "1710417600002",
    "sessionId": "1710417600001",
    "score": 80,
    "correctAnswers": 4,
    "totalQuestions": 5,
    "violations": [
      {
        "type": "Switched away from test",
        "duration": 5234,
        "timestamp": "2026-03-16T10:08:00.000Z"
      }
    ],
    "timeSpent": 420,
    "detailedResults": [
      {
        "questionId": 1,
        "question": "What is 2 + 2?",
        "userAnswer": 1,
        "correctAnswer": 1,
        "isCorrect": true
      }
    ],
    "submittedAt": "2026-03-16T10:15:00.000Z"
  }
]
```

### How to View Results

#### Option 1: Admin Dashboard (RECOMMENDED)
1. Open: http://localhost:3000/admin.html
2. Password: `admin123`
3. See all results in a nice interface
4. Click "Export to CSV" for spreadsheet

#### Option 2: Open Files Directly
```bash
# Open all data files
open /Users/omeshcheriak/fullscreen-test-system/data/

# View results in terminal
cat /Users/omeshcheriak/fullscreen-test-system/data/results.json

# Pretty print (easier to read)
cat /Users/omeshcheriak/fullscreen-test-system/data/results.json | python3 -m json.tool
```

#### Option 3: CSV Export
1. Go to admin dashboard
2. Click "Export to CSV"
3. Opens in Excel/Google Sheets
4. Contains:
   - Student names and emails
   - Scores and correct answers
   - Violation counts and time
   - Time spent on test
   - Submission timestamps

### What Each Field Means

**In results.json:**

| Field | Meaning | Example |
|-------|---------|---------|
| `score` | Percentage score | `80` = 80% |
| `correctAnswers` | Number correct | `4` |
| `totalQuestions` | Total questions | `5` |
| `timeSpent` | Seconds on test | `420` = 7 minutes |
| `violations` | Array of violations | See violations section |
| `detailedResults` | Question-by-question breakdown | See below |

**Violation Data:**
- `type`: What happened ("Switched away", "Exited fullscreen")
- `duration`: How long in milliseconds (5234 = 5.2 seconds)
- `timestamp`: When it happened

**Detailed Results:**
- `questionId`: Which question
- `userAnswer`: Index of answer they chose (0-3)
- `correctAnswer`: Index of correct answer (0-3)
- `isCorrect`: true/false

### Backing Up Results

**Before your seminar ends, backup the data:**

```bash
# Create a backup
cp -r /Users/omeshcheriak/fullscreen-test-system/data /Users/omeshcheriak/seminar-backup-2026-03-16

# Or create a zip
cd /Users/omeshcheriak/fullscreen-test-system
zip -r seminar-results-2026-03-16.zip data/
```

### Clearing Old Data

**To start fresh for a new seminar:**

```bash
cd /Users/omeshcheriak/fullscreen-test-system
rm -rf data/
# Data folder will be recreated when server starts
```

Or manually delete the files:
```bash
rm data/users.json
rm data/sessions.json
rm data/results.json
```

The server will create new empty files automatically.

---

## Quick Reference

### Edit Questions
```bash
open /Users/omeshcheriak/fullscreen-test-system/questions.json
```

### View Results
```bash
open /Users/omeshcheriak/fullscreen-test-system/data/results.json
```

### Admin Dashboard
```
http://localhost:3000/admin.html
Password: admin123
```

### Backup Data
```bash
zip -r backup.zip data/
```

### After Seminar
1. Open admin dashboard
2. Export to CSV
3. Backup data folder
4. Optionally clear data for next time

---

## Important Notes

### Data Persistence

**Local Development:**
- ✅ Data persists between server restarts
- ✅ Safe as long as you don't delete the folder

**Vercel Deployment:**
- ⚠️ Data resets when you redeploy!
- Solution: Export CSV before redeploying
- Or use Render/Railway instead (data persists)

### Security

- Results are stored in plain text JSON
- Keep the `data/` folder secure
- Don't commit it to public GitHub
- Already in `.gitignore` for protection

### File Size

- Each test result is ~1-2 KB
- 100 students ≈ 100-200 KB
- Not a problem unless you have thousands of tests

---

## Troubleshooting

### "Questions not loading"
- Check `questions.json` exists
- Verify JSON format is valid (use JSONLint.com)
- Check server console for errors

### "Results not showing in admin"
- Make sure tests were submitted (not just started)
- Check `data/results.json` exists and has content
- Verify admin password is correct

### "Data disappeared after deploy"
- This happens on Vercel (ephemeral storage)
- Always export CSV before redeploying
- Consider using Render for persistent storage

### "Can't open data files"
```bash
# Give yourself permission
chmod 644 /Users/omeshcheriak/fullscreen-test-system/data/*.json
```

---

**Files Location Summary:**
- 📝 Questions: `questions.json` (root folder)
- 💾 Results: `data/results.json`
- 👥 Students: `data/users.json`
- 📊 Sessions: `data/sessions.json`
