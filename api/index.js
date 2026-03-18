const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const ACTIVE_TEST = process.env.ACTIVE_TEST || 'seminar-1-march';

console.log(`Active test: ${ACTIVE_TEST}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Data storage files
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const SESSIONS_FILE = path.join(__dirname, '..', 'data', 'sessions.json');
const RESULTS_FILE = path.join(__dirname, '..', 'data', 'results.json');
const QUESTIONS_FILE = path.join(__dirname, '..', 'questions.json');
const TESTS_DIR = path.join(__dirname, '..', 'tests');

// In-memory storage for Vercel
let memoryStorage = {
    users: [],
    sessions: [],
    results: []
};

// Helper functions
function readJSON(file) {
    // Always use in-memory storage on Vercel
    if (file === USERS_FILE) return memoryStorage.users;
    if (file === SESSIONS_FILE) return memoryStorage.sessions;
    if (file === RESULTS_FILE) return memoryStorage.results;
    return [];
}

function writeJSON(file, data) {
    // Always use in-memory storage on Vercel
    if (file === USERS_FILE) memoryStorage.users = data;
    if (file === SESSIONS_FILE) memoryStorage.sessions = data;
    if (file === RESULTS_FILE) memoryStorage.results = data;
}

// Load test configuration from file
function loadTestConfig() {
    try {
        const testFile = path.join(TESTS_DIR, `${ACTIVE_TEST}.json`);

        if (fs.existsSync(testFile)) {
            console.log(`Loading test from: tests/${ACTIVE_TEST}.json`);
            const config = JSON.parse(fs.readFileSync(testFile, 'utf-8'));
            if (!config.testId) {
                config.testId = ACTIVE_TEST;
            }
            return config;
        }

        if (fs.existsSync(QUESTIONS_FILE)) {
            console.log('Loading test from: questions.json (legacy)');
            const config = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
            if (!config.testId) {
                config.testId = 'default';
            }
            return config;
        }

        console.error('No test configuration found!');
        return null;
    } catch (err) {
        console.error('Error loading test configuration:', err.message);
        return null;
    }
}

const ADMIN_PASSWORD = "admin123";

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Routes
app.get('/api/test/config', (req, res) => {
    const TEST_CONFIG = loadTestConfig();

    if (!TEST_CONFIG) {
        return res.status(500).json({ error: 'Failed to load test configuration' });
    }

    let questions = TEST_CONFIG.questions;
    if (TEST_CONFIG.randomizeQuestions) {
        questions = shuffleArray(questions);
    }

    const processedQuestions = questions.map(q => {
        let options = [...q.options];
        let correctIndex = q.correct;

        if (TEST_CONFIG.randomizeOptions) {
            const optionsWithIndex = options.map((opt, idx) => ({
                text: opt,
                wasCorrectIndex: idx
            }));
            const shuffled = shuffleArray(optionsWithIndex);
            options = shuffled.map(o => o.text);
            correctIndex = shuffled.findIndex(o => o.wasCorrectIndex === q.correct);
        }

        return {
            id: q.id,
            question: q.question,
            options: options,
            correctIndex: correctIndex
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
        _answerKey: processedQuestions.reduce((acc, q) => {
            acc[q.id] = q.correctIndex;
            return acc;
        }, {})
    };

    res.json(configWithoutAnswers);
});

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

    const sessions = readJSON(SESSIONS_FILE);
    const session = {
        id: Date.now().toString(),
        userId: user.id,
        startTime: new Date().toISOString(),
        active: true,
        answerKey: answerKey || {}
    };
    sessions.push(session);
    writeJSON(SESSIONS_FILE, sessions);

    res.json({
        success: true,
        user,
        sessionId: session.id
    });
});

app.post('/api/test/submit', (req, res) => {
    const { sessionId, answers, violations, timeSpent } = req.body;

    if (!sessionId || !answers) {
        return res.status(400).json({ error: 'Session ID and answers required' });
    }

    const TEST_CONFIG = loadTestConfig();
    if (!TEST_CONFIG) {
        return res.status(500).json({ error: 'Failed to load test configuration' });
    }

    const sessions = readJSON(SESSIONS_FILE);
    const session = sessions.find(s => s.id === sessionId);

    if (!session) {
        return res.status(400).json({ error: 'Invalid session' });
    }

    const answerKey = session.answerKey || {};

    let correctAnswers = 0;
    const detailedResults = TEST_CONFIG.questions.map(q => {
        const userAnswer = answers[q.id];
        const correctAnswer = answerKey[q.id] !== undefined ? answerKey[q.id] : q.correct;
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctAnswers++;

        return {
            questionId: q.id,
            question: q.question,
            options: q.options,
            userAnswer,
            userAnswerText: q.options[userAnswer] || 'No answer',
            correctAnswer,
            correctAnswerText: q.options[correctAnswer] || 'Unknown',
            isCorrect
        };
    });

    const score = (correctAnswers / TEST_CONFIG.questions.length) * 100;

    const results = readJSON(RESULTS_FILE);
    const result = {
        id: Date.now().toString(),
        sessionId,
        testId: TEST_CONFIG.testId,
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

app.get('/api/admin/results', (req, res) => {
    const { password } = req.query;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = readJSON(USERS_FILE);
    const sessions = readJSON(SESSIONS_FILE);
    const results = readJSON(RESULTS_FILE);

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

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports = app;
