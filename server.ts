import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side persistent storage file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'leaderboard.json');

// Interface for Leaderboard records
interface LeaderboardEntry {
  id: string;
  studentName: string;
  classLevel: number;
  section?: string;
  chapterId?: string;
  chapterName: string;
  mode?: 'practice' | 'exam';
  correctCount: number;
  totalQuestions: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  formattedTime: string;
  timestamp: number;
  formattedDate: string;
}

const DEFAULT_SERVER_LEADERBOARD: LeaderboardEntry[] = [];

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Data directory initialization error:', err);
  }
}

function loadLeaderboardFromFile(): LeaderboardEntry[] {
  try {
    ensureDataFile();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.filter((e) => e && e.id && !e.id.startsWith('lead-seed-'));
      }
    }
  } catch (err) {
    console.error('Failed to read leaderboard file from disk:', err);
  }
  return [];
}

function saveLeaderboardToFile(entries: LeaderboardEntry[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save leaderboard file to disk:', err);
  }
}

// Ensure initial persistent file
ensureDataFile();

// API Routes
app.get('/api/health', (_req, res) => {
  const entries = loadLeaderboardFromFile();
  res.json({ status: 'ok', totalLeaderboardEntries: entries.length });
});

// GET Leaderboard from Server (shared across all users)
app.get('/api/leaderboard', (req, res) => {
  try {
    const { classLevel, mode } = req.query;
    const allEntries = loadLeaderboardFromFile();
    let filtered = [...allEntries];

    if (mode && mode !== 'all') {
      filtered = filtered.filter((entry) => entry.mode === mode || (!entry.mode && mode === 'practice'));
    }

    if (classLevel && classLevel !== 'all') {
      const levelNum = Number(classLevel);
      if (!isNaN(levelNum)) {
        filtered = filtered.filter((entry) => entry.classLevel === levelNum);
      }
    }

    // Rank strictly by:
    // 1. scorePercentage (descending)
    // 2. correctCount (descending)
    // 3. timeSpentSeconds (ascending)
    // 4. timestamp (descending)
    filtered.sort((a, b) => {
      if (b.scorePercentage !== a.scorePercentage) {
        return b.scorePercentage - a.scorePercentage;
      }
      if (b.correctCount !== a.correctCount) {
        return b.correctCount - a.correctCount;
      }
      if (a.timeSpentSeconds !== b.timeSpentSeconds) {
        return a.timeSpentSeconds - b.timeSpentSeconds;
      }
      return b.timestamp - a.timestamp;
    });

    res.json({
      success: true,
      entries: filtered,
      total: filtered.length,
      serverSynced: true,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Server error loading leaderboard' });
  }
});

// POST New Leaderboard Entry to Server (immediately persists to disk and broadcasts to all users)
app.post('/api/leaderboard', (req, res) => {
  try {
    const newEntry = req.body as Partial<LeaderboardEntry>;

    if (!newEntry.studentName || typeof newEntry.scorePercentage !== 'number') {
      res.status(400).json({ success: false, error: 'Invalid leaderboard data format' });
      return;
    }

    const validatedEntry: LeaderboardEntry = {
      id: newEntry.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentName: String(newEntry.studentName).trim().substring(0, 80),
      classLevel: Number(newEntry.classLevel) || 9,
      section: newEntry.section ? String(newEntry.section).trim().substring(0, 80) : 'Standard',
      chapterId: newEntry.chapterId || 'general_quiz',
      chapterName: newEntry.chapterName ? String(newEntry.chapterName).trim().substring(0, 100) : 'Mathematics',
      mode: newEntry.mode || 'practice',
      correctCount: Number(newEntry.correctCount) || 0,
      totalQuestions: Number(newEntry.totalQuestions) || 1,
      scorePercentage: Math.max(0, Math.min(100, Number(newEntry.scorePercentage))),
      timeSpentSeconds: Number(newEntry.timeSpentSeconds) || 0,
      formattedTime: newEntry.formattedTime || `${newEntry.timeSpentSeconds || 0}s`,
      timestamp: Number(newEntry.timestamp) || Date.now(),
      formattedDate: newEntry.formattedDate || 'Just now',
    };

    let entries = loadLeaderboardFromFile();

    // Upsert: Remove existing entry with identical ID if present, then prepend
    entries = entries.filter((e) => e.id !== validatedEntry.id);
    entries.unshift(validatedEntry);

    // Keep store capped at 1000 latest records
    if (entries.length > 1000) {
      entries = entries.slice(0, 1000);
    }

    saveLeaderboardToFile(entries);

    res.json({
      success: true,
      entry: validatedEntry,
      serverSynced: true,
      totalEntries: entries.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Server sync failure' });
  }
});

// Reset Leaderboard
app.post('/api/leaderboard/reset', (_req, res) => {
  saveLeaderboardToFile([...DEFAULT_SERVER_LEADERBOARD]);
  res.json({ success: true, message: 'Leaderboard reset to default seeds', entries: DEFAULT_SERVER_LEADERBOARD });
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

