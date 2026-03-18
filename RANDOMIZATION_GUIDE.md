# Question Randomization Guide

Your test system now supports **FULL RANDOMIZATION** - both question order AND answer options are shuffled for each participant!

## Current Settings (BOTH ENABLED)

Open `server.js` and look for the `TEST_CONFIG` section (around line 35):

```javascript
const TEST_CONFIG = {
    title: "Sample Test",
    duration: 10,
    randomizeQuestions: true,   // ✅ Questions appear in random order
    randomizeOptions: true,     // ✅ Answer options (A,B,C,D) are shuffled
    questions: [
        // your questions...
    ]
};
```

## How It Works

### Question Randomization
Every time a student loads the test, questions are shuffled:
- Student A: Q5, Q2, Q1, Q4, Q3
- Student B: Q3, Q1, Q5, Q2, Q4

### Answer Option Randomization
The A, B, C, D options are also shuffled within each question:
- Student A sees: Question 1 with options in order: C, A, D, B
- Student B sees: Question 1 with options in order: B, D, A, C

### How Grading Works
The system is smart! It:
1. Generates a unique shuffled test for each student
2. Stores which option is correct for THAT student's version
3. Grades based on their specific shuffled answer key
4. Everyone is graded fairly even though they saw different orders

## Configuration Options

### Both Enabled (Current Setting - Maximum Security)

```javascript
randomizeQuestions: true
randomizeOptions: true
```

**Best for:**
- Large classes (50+ students)
- High-stakes exams
- Online/remote testing
- Maximum anti-cheating protection

**What students experience:**
- Questions in random order
- Answer choices in random order
- Cannot compare "What did you pick for Question 3?" (different questions)
- Cannot say "I chose B" (B is different for everyone)

### Questions Only

```javascript
randomizeQuestions: true
randomizeOptions: false
```

**Best for:**
- Small seminars (5-20 people)
- In-person testing
- Simple anti-cheating

**What students experience:**
- Questions in random order
- Answer choices stay consistent (A,B,C,D same for everyone)

### No Randomization

```javascript
randomizeQuestions: false
randomizeOptions: false
```

**Best for:**
- Practice tests
- Learning/training scenarios
- When you want consistent test experience

## How to Enable/Disable

Edit `server.js`:

```javascript
// To enable question randomization
randomizeQuestions: true

// To disable question randomization
randomizeQuestions: false

// To also randomize answer options
randomizeOptions: true
```

Then restart or redeploy:

```bash
# If running locally:
# Stop server (Ctrl+C) and run:
npm start

# If deployed to Vercel:
vercel --prod
```

## Testing Full Randomization

### Test in Two Browsers

1. **Open two browsers side by side:**
   - Browser 1: Chrome (regular)
   - Browser 2: Chrome Incognito or Firefox

2. **On both browsers:**
   - Go to http://localhost:3000 (or your deployed URL)
   - Enter different names/emails on each

3. **Compare:**
   - **Question 1:** Probably different questions
   - **Answer options:** Even if same question, options are in different order!

### What You Should See

**Browser 1 - Question 1:**
```
What is the capital of France?
A. Berlin
B. Madrid
C. Paris ✓
D. London
```

**Browser 2 - Question 1 (might be different question):**
```
What is 2 + 2?
A. 5
B. 4 ✓
C. 6
D. 3
```

**Or if same question, different order:**
```
What is the capital of France?
A. Paris ✓
B. London
C. Berlin
D. Madrid
```

## Important Technical Details

### How Answer Keys Work

When a student logs in:
1. Server generates shuffled questions and options
2. Server creates an answer key for that specific shuffle
3. Answer key is stored in the session
4. When grading, server uses that student's specific answer key

### Data Storage

Each session stores:
```json
{
  "id": "session123",
  "userId": "user456",
  "answerKey": {
    "1": 2,  // For this student, correct answer to Q1 is index 2
    "2": 0,  // For this student, correct answer to Q2 is index 0
    ...
  }
}
```

### Why This Is Secure

- Students can't cheat by comparing answers
- Even looking at network traffic doesn't help (correct answers not sent to client)
- Each test instance is unique
- Grading is done server-side using stored answer keys

## Example Test Scenarios

### Scenario 1: Small Group Seminar (5-20 people)
**Recommendation:**
```javascript
randomizeQuestions: true
randomizeOptions: false
```
Simple randomization prevents obvious cheating without overcomplicating.

### Scenario 2: Large Class (50+ people)
**Recommendation:**
```javascript
randomizeQuestions: true
randomizeOptions: true
```
Maximum protection with both randomizations enabled.

### Scenario 3: Practice Test
**Recommendation:**
```javascript
randomizeQuestions: false
randomizeOptions: false
```
Keep consistent order for practice/learning scenarios.

## Advanced: Question Pools

Want even more randomization? You can create question pools:

```javascript
const TEST_CONFIG = {
    title: "Advanced Test",
    duration: 30,
    randomizeQuestions: true,
    questions: [
        // Pool 1: Easy questions (show 3 out of 5)
        { id: 1, question: "Easy Q1...", options: [...], correct: 0 },
        { id: 2, question: "Easy Q2...", options: [...], correct: 1 },
        { id: 3, question: "Easy Q3...", options: [...], correct: 2 },
        { id: 4, question: "Easy Q4...", options: [...], correct: 0 },
        { id: 5, question: "Easy Q5...", options: [...], correct: 3 },

        // Pool 2: Hard questions (show 2 out of 3)
        { id: 6, question: "Hard Q1...", options: [...], correct: 1 },
        { id: 7, question: "Hard Q2...", options: [...], correct: 2 },
        { id: 8, question: "Hard Q3...", options: [...], correct: 0 },
    ]
};
```

Note: This requires additional code to implement pool selection. Let me know if you need this feature!

## Troubleshooting

### "All students see the same questions"
- Check that `randomizeQuestions: true` in server.js
- Redeploy after changes: `vercel --prod`
- Clear browser cache and try again

### "Grading seems wrong"
- Don't worry! Grading is by question ID, not position
- Check admin dashboard to see detailed results
- Verify the `correct` index in your TEST_CONFIG matches the right answer

### "Options are shuffled but questions aren't"
- You have `randomizeOptions: true` but `randomizeQuestions: false`
- Enable both or disable both for consistency

## Summary

✅ **Both randomizations are now ENABLED**
✅ Questions appear in random order for each student
✅ Answer options (A,B,C,D) are shuffled within each question
✅ Unique answer key stored per session
✅ Grading works perfectly with randomization
✅ Maximum anti-cheating protection
✅ Easy to configure in server.js

---

**Current Status:** FULL RANDOMIZATION ACTIVE
**Location:** `/Users/omeshcheriak/fullscreen-test-system/server.js` (line 35)
**Settings:**
- `randomizeQuestions: true`
- `randomizeOptions: true`
