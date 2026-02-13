const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Security Configuration
const ADMIN_TOKEN = 'prana2026';

// Middleware
app.use(helmet()); // Sets secure HTTP headers
app.use(cors());
app.use(bodyParser.json());

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }
});
app.use('/api/', limiter);

// Helper to read DB
async function readDB() {
    try {
        return await fs.readJson(DB_PATH);
    } catch (err) {
        console.error('Error reading DB:', err);
        return { appointments: [], users: [], visits: 0, availability: {} };
    }
}

// Helper to write DB
async function writeDB(data) {
    try {
        await fs.writeJson(DB_PATH, data, { spaces: 2 });
    } catch (err) {
        console.error('Error writing DB:', err);
    }
}

// Auth Middleware
const requireAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === ADMIN_TOKEN) {
        next();
    } else {
        res.status(401).json({ error: 'unauthorized' });
    }
};

// API Routes

// Stats (Protected)
app.get('/api/stats', requireAdmin, async (req, res) => {
    const db = await readDB();
    res.json({
        visits: db.visits,
        appointments: db.appointments.length,
        users: db.users.length
    });
});

// Appointments
app.get('/api/appointments', requireAdmin, async (req, res) => {
    const db = await readDB();
    res.json(db.appointments);
});

app.post('/api/appointments', async (req, res) => {
    const { name, email, activity, day, time } = req.body;

    // Basic Sanitization and Validation
    if (!name || !email || !activity) {
        return res.status(400).json({ error: 'Nombre, email y actividad son requeridos.' });
    }

    const db = await readDB();
    const newAppointment = {
        id: Date.now().toString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        name: name.substring(0, 100).replace(/[<>]/g, ""),
        email: email.substring(0, 100).replace(/[<>]/g, ""),
        activity: activity.substring(0, 50),
        day,
        time
    };
    db.appointments.push(newAppointment);

    // Add user if new
    const existingUser = db.users.find(u => u.email === email);
    if (!existingUser) {
        db.users.push({
            id: Date.now().toString(),
            name: name.substring(0, 100).replace(/[<>]/g, ""),
            email: email.substring(0, 100).replace(/[<>]/g, ""),
            phone: (req.body.phone || '').substring(0, 20)
        });
    }

    await writeDB(db);
    res.status(201).json(newAppointment);
});

// Users (Protected)
app.get('/api/users', requireAdmin, async (req, res) => {
    const db = await readDB();
    res.json(db.users);
});

// Availability
app.get('/api/availability', async (req, res) => {
    const db = await readDB();
    res.json(db.availability);
});

// Visit tracking
app.post('/api/visit', async (req, res) => {
    const db = await readDB();
    db.visits++;
    await writeDB(db);
    res.json({ visits: db.visits });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
