# Managing Multiple Tests/Seminars

Your test system now supports running multiple different tests without mixing results!

## Quick Start

### Folder Structure

```
/Users/omeshcheriak/fullscreen-test-system/
├── .env                    ← Switch active test here
├── tests/                  ← All your test files
│   ├── seminar-1-march.json
│   ├── seminar-2-april.json
│   └── final-exam.json
└── data/
    └── results.json        ← All results (tagged by test)
```

## Creating a New Test

### Step 1: Create Test File

Create a new file in the `tests/` folder:

```bash
touch /Users/omeshcheriak/fullscreen-test-system/tests/my-test.json
```

### Step 2: Add Questions

Edit the file with this format:

```json
{
  "testId": "my-test",
  "title": "My Test Title",
  "duration": 30,
  "randomizeQuestions": true,
  "randomizeOptions": true,
  "questions": [
    {
      "id": 1,
      "question": "Your question here?",
      "options": ["A", "B", "C", "D"],
      "correct": 1
    }
  ]
}
```

**Important:** The `testId` should match your filename (without .json)

## Switching Between Tests

### Edit `.env` File

Open:
```bash
open /Users/omeshcheriak/fullscreen-test-system/.env
```

Change the active test:
```bash
ACTIVE_TEST=seminar-1-march
```

To:
```bash
ACTIVE_TEST=seminar-2-april
```

### Restart Server

```bash
# Stop server (Ctrl+C)
npm start
```

Or if deployed:
```bash
vercel --prod
```

The new test is now active!

## Example: Running 3 Different Seminars

### Test Files Created:

**File:** `tests/week1-basics.json`
```json
{
  "testId": "week1-basics",
  "title": "Week 1: Basics",
  "duration": 15,
  "randomizeQuestions": true,
  "randomizeOptions": true,
  "questions": [...]
}
```

**File:** `tests/week2-advanced.json`
```json
{
  "testId": "week2-advanced",
  "title": "Week 2: Advanced",
  "duration": 20,
  "randomizeQuestions": true,
  "randomizeOptions": true,
  "questions": [...]
}
```

**File:** `tests/final-exam.json`
```json
{
  "testId": "final-exam",
  "title": "Final Exam",
  "duration": 60,
  "randomizeQuestions": true,
  "randomizeOptions": false,
  "questions": [...]
}
```

### Running Week 1 Test

1. Edit `.env`:
   ```bash
   ACTIVE_TEST=week1-basics
   ```

2. Restart server

3. Share URL with students

4. Results are tagged as "week1-basics"

### Running Week 2 Test

1. Edit `.env`:
   ```bash
   ACTIVE_TEST=week2-advanced
   ```

2. Restart server

3. Share URL with students

4. Results are tagged as "week2-advanced"

## Viewing Results by Test

### Admin Dashboard

1. Go to: http://localhost:3000/admin.html
2. Password: `admin123`
3. Use the **"Filter by test"** dropdown at the top
4. Select which test to view

### Filter Options:
- **All Tests** - See all results from all tests
- **Week 1: Basics** - Only Week 1 results
- **Week 2: Advanced** - Only Week 2 results
- **Final Exam** - Only final exam results

### Export by Test

When you click "Export to CSV", it exports only the currently filtered results.

Example:
- Filter to "Week 1: Basics"
- Click "Export to CSV"
- Filename: `test-results-week1-basics-2026-03-16.csv`

## Results Storage

All results are in one file: `data/results.json`

Each result includes `testId` and `testTitle`:

```json
{
  "id": "...",
  "testId": "week1-basics",
  "testTitle": "Week 1: Basics",
  "score": 85,
  "studentName": "John Doe",
  ...
}
```

### Viewing Results Directly

```bash
# View all results
cat data/results.json | python3 -m json.tool

# Filter specific test
cat data/results.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
for r in data:
    if r.get('testId') == 'week1-basics':
        print(f\"{r['user']['name']}: {r['score']}%\")
"
```

## Best Practices

### Naming Convention

Use clear, descriptive test IDs:

✅ **Good:**
- `seminar-1-intro`
- `midterm-exam`
- `quiz-chapter-3`
- `final-practical`

❌ **Bad:**
- `test1`
- `a`
- `new`

### File Organization

Keep test files organized:

```
tests/
├── 2026-spring/
│   ├── week1.json
│   ├── week2.json
│   └── final.json
└── 2026-fall/
    ├── week1.json
    └── week2.json
```

Then use paths in `.env`:
```bash
ACTIVE_TEST=2026-spring/week1
```

### Before Each Seminar

1. **Check active test:**
   ```bash
   cat .env
   ```

2. **Verify questions loaded:**
   ```bash
   npm start
   # Look for: "Loading test from: tests/your-test.json"
   ```

3. **Test yourself first!**

### After Each Seminar

1. **Export results:**
   - Open admin dashboard
   - Filter to that test
   - Export to CSV
   - Save the CSV somewhere safe!

2. **Backup (optional):**
   ```bash
   cp data/results.json backups/results-week1-2026-03-16.json
   ```

## Frequently Asked Questions

### Can I run two tests simultaneously?

No - only one test can be active at a time. However, you can:
- Deploy two instances (e.g., different Vercel projects)
- Each instance can run a different test

### What if I forget to switch the test?

Students will take the wrong test! Always:
1. Check `.env` before seminar
2. Restart server
3. Verify the test title appears correctly

### Can I delete old results?

**To keep specific test results:**

```bash
# Backup first!
cp data/results.json data/results-backup.json

# Then manually edit results.json to remove unwanted tests
```

**To start completely fresh:**

```bash
rm data/results.json
# Server will create new empty file
```

### How do I rename a test?

1. Rename the file:
   ```bash
   mv tests/old-name.json tests/new-name.json
   ```

2. Update `.env`:
   ```bash
   ACTIVE_TEST=new-name
   ```

3. Update `testId` inside the JSON file

Note: Old results will still have old test ID

## Quick Reference

### Switch Test
```bash
# Edit .env
echo "ACTIVE_TEST=my-test" > .env

# Restart
npm start
```

### Create New Test
```bash
# Copy template
cp tests/seminar-1-march.json tests/my-new-test.json

# Edit questions
open tests/my-new-test.json
```

### View Active Test
```bash
cat .env
```

### List All Tests
```bash
ls -1 tests/
```

### Filter Results
- Admin Dashboard → "Filter by test" dropdown

### Export Results
- Filter first, then click "Export to CSV"

---

## Example Workflow: 3-Week Course

**Week 1:**
```bash
echo "ACTIVE_TEST=week1-intro" > .env
npm start
# Students take test
# Export CSV
```

**Week 2:**
```bash
echo "ACTIVE_TEST=week2-advanced" > .env
npm start
# Students take test
# Export CSV
```

**Week 3:**
```bash
echo "ACTIVE_TEST=week3-final" > .env
npm start
# Students take test
# Export CSV
```

**View All Results:**
- Admin dashboard → "All Tests"
- See combined stats from all weeks
- Export all or filter individually

---

**Current Setup:**
- Test 1: `tests/seminar-1-march.json` ✅ Created
- Test 2: `tests/seminar-2-april.json` ✅ Created
- Active: Check `.env` file
- Results: `data/results.json` (tagged by test)
