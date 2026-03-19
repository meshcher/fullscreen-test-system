const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const TEST_CONFIGS = require('./test-configs');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ACTIVE_TEST = process.env.ACTIVE_TEST || 'seminar-1-march';

console.log(`Active test: ${ACTIVE_TEST}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage files
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SESSIONS_FILE = path.join(__dirname, 'data', 'sessions.json');
const RESULTS_FILE = path.join(__dirname, 'data', 'results.json');
const QUESTIONS_FILE = path.join(__dirname, 'questions.json'); // Legacy support
const TESTS_DIR = path.join(__dirname, 'tests');

// Initialize data directory and files
function initDataFiles() {
    // Skip file initialization on Vercel
    if (process.env.VERCEL) {
        return;
    }

    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(SESSIONS_FILE)) {
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(RESULTS_FILE)) {
        fs.writeFileSync(RESULTS_FILE, JSON.stringify([], null, 2));
    }
}

// In-memory storage for Vercel (reset on each deploy)
let memoryStorage = {
    users: [],
    sessions: [],
    results: []
};

// Helper functions
function readJSON(file) {
    // Use in-memory storage on Vercel
    if (process.env.VERCEL) {
        if (file === USERS_FILE) return memoryStorage.users;
        if (file === SESSIONS_FILE) return memoryStorage.sessions;
        if (file === RESULTS_FILE) return memoryStorage.results;
        return [];
    }
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
    // Use in-memory storage on Vercel
    if (process.env.VERCEL) {
        if (file === USERS_FILE) memoryStorage.users = data;
        if (file === SESSIONS_FILE) memoryStorage.sessions = data;
        if (file === RESULTS_FILE) memoryStorage.results = data;
        return;
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Load test configuration
function loadTestConfig() {
    // Load from inlined JS configs
    const config = TEST_CONFIGS[ACTIVE_TEST];
    if (config) {
        console.log(`Loading test: ${ACTIVE_TEST}`);
        return config;
    }

    console.error(`No test configuration found for: ${ACTIVE_TEST}`);
    return null;
}

// Admin credentials (in production, use proper authentication)
const ADMIN_PASSWORD = "admin123";

// Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Routes

// Get test configuration (without correct answers)
app.get('/api/test/config', (req, res) => {
    const TEST_CONFIG = loadTestConfig();

    if (!TEST_CONFIG) {
        return res.status(500).json({ error: 'Failed to load test configuration' });
    }

    // Shuffle questions if enabled
    let questions = TEST_CONFIG.questions;
    if (TEST_CONFIG.randomizeQuestions) {
        questions = shuffleArray(questions);
    }

    // Process each question and optionally shuffle options
    const processedQuestions = questions.map(q => {
        let options = [...q.options];
        let correctIndex = q.correct;

        if (TEST_CONFIG.randomizeOptions) {
            // Create mapping of original index to option text
            const optionsWithIndex = options.map((opt, idx) => ({
                text: opt,
                wasCorrectIndex: idx
            }));

            // Shuffle
            const shuffled = shuffleArray(optionsWithIndex);

            // Extract shuffled options and find new correct index
            options = shuffled.map(o => o.text);
            correctIndex = shuffled.findIndex(o => o.wasCorrectIndex === q.correct);
        }

        return {
            id: q.id,
            question: q.question,
            options: options,
            correctIndex: correctIndex // Keep for server-side validation
        };
    });

    const configWithoutAnswers = {
        title: TEST_CONFIG.title,
        duration: TEST_CONFIG.duration,
        randomizeOptions: TEST_CONFIG.randomizeOptions,
        questions: processedQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options
        })),
        // Store answer key for this session's shuffled questions
        _answerKey: processedQuestions.reduce((acc, q) => {
            acc[q.id] = q.correctIndex;
            return acc;
        }, {})
    };

    res.json(configWithoutAnswers);
});

// Student login/register
app.post('/api/student/login', (req, res) => {
    const { name, email, answerKey } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email required' });
    }

    const users = readJSON(USERS_FILE);
    let user = users.find(u => u.email === email);

    if (!user) {
        user = {
            id: Date.now().toString(),
            name,
            email,
            createdAt: new Date().toISOString()
        };
        users.push(user);
        writeJSON(USERS_FILE, users);
    }

    // Create a session with answer key for this specific test instance
    const sessions = readJSON(SESSIONS_FILE);
    const session = {
        id: Date.now().toString(),
        userId: user.id,
        startTime: new Date().toISOString(),
        active: true,
        answerKey: answerKey || {} // Store the shuffled answer key
    };
    sessions.push(session);
    writeJSON(SESSIONS_FILE, sessions);

    res.json({
        success: true,
        user,
        sessionId: session.id
    });
});

// Submit test results
app.post('/api/test/submit', (req, res) => {
    const { sessionId, answers, violations, timeSpent } = req.body;

    if (!sessionId || !answers) {
        return res.status(400).json({ error: 'Session ID and answers required' });
    }

    const TEST_CONFIG = loadTestConfig();
    if (!TEST_CONFIG) {
        return res.status(500).json({ error: 'Failed to load test configuration' });
    }

    // Get the session to retrieve the answer key
    const sessions = readJSON(SESSIONS_FILE);
    const session = sessions.find(s => s.id === sessionId);

    if (!session) {
        return res.status(400).json({ error: 'Invalid session' });
    }

    // Use session-specific answer key if available (for randomized options)
    const answerKey = session.answerKey || {};

    // Calculate score using the session's answer key
    let correctAnswers = 0;
    const detailedResults = TEST_CONFIG.questions.map(q => {
        const userAnswer = answers[q.id];
        // Use session answer key if available, otherwise use original
        const correctAnswer = answerKey[q.id] !== undefined ? answerKey[q.id] : q.correct;
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctAnswers++;

        // Include the actual text of answers for better reporting
        return {
            questionId: q.id,
            question: q.question,
            options: q.options, // Include all options
            userAnswer,
            userAnswerText: q.options[userAnswer] || 'No answer',
            correctAnswer,
            correctAnswerText: q.options[correctAnswer] || 'Unknown',
            isCorrect
        };
    });

    const score = (correctAnswers / TEST_CONFIG.questions.length) * 100;

    // Save results
    const results = readJSON(RESULTS_FILE);
    const result = {
        id: Date.now().toString(),
        sessionId,
        testId: TEST_CONFIG.testId, // Track which test this result is for
        testTitle: TEST_CONFIG.title,
        score,
        correctAnswers,
        totalQuestions: TEST_CONFIG.questions.length,
        violations: violations || [],
        timeSpent,
        detailedResults,
        submittedAt: new Date().toISOString()
    };
    results.push(result);
    writeJSON(RESULTS_FILE, results);

    // Mark session as inactive
    if (session) {
        session.active = false;
        session.endTime = new Date().toISOString();
        writeJSON(SESSIONS_FILE, sessions);
    }

    res.json({
        success: true,
        score,
        correctAnswers,
        totalQuestions: TEST_CONFIG.questions.length
    });
});

// Log violation
app.post('/api/violation/log', (req, res) => {
    const { sessionId, type, duration } = req.body;

    const sessions = readJSON(SESSIONS_FILE);
    const session = sessions.find(s => s.id === sessionId);

    if (session) {
        if (!session.violations) {
            session.violations = [];
        }
        session.violations.push({
            type,
            duration,
            timestamp: new Date().toISOString()
        });
        writeJSON(SESSIONS_FILE, sessions);
    }

    res.json({ success: true });
});

// Admin: Get all results
app.get('/api/admin/results', (req, res) => {
    const { password } = req.query;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = readJSON(USERS_FILE);
    const sessions = readJSON(SESSIONS_FILE);
    const results = readJSON(RESULTS_FILE);

    // Combine data
    const combined = results.map(result => {
        const session = sessions.find(s => s.id === result.sessionId);
        const user = session ? users.find(u => u.id === session.userId) : null;

        return {
            ...result,
            user: user ? { name: user.name, email: user.email } : null,
            session: session ? {
                startTime: session.startTime,
                endTime: session.endTime,
                violations: session.violations || []
            } : null
        };
    });

    res.json(combined);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Initialize and start server
initDataFiles();

// For Vercel serverless deployment
module.exports = app;
