const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const statsController = require('./controllers/statsController');

// Routes
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const statsRoutes = require('./routes/stats');
const paymentRoutes = require('./routes/payments');

// Initialize App
const app = express();

// Connect to Database
connectDB().then(() => {
    statsController.initStats();
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://images.unsplash.com"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            "frame-src": ["'self'", "https://www.google.com"],
            "frame-ancestors": ["'self'"],
        },
    },
    frameguard: { action: 'sameorigin' }
}));
app.use(cors());
app.use(bodyParser.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }
});
app.use('/api/', limiter);

// API Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', paymentRoutes); // payment routes are mixed in original, keeping consistent path

// Static Files
// Serve files from the root directory (one level up from src)
const rootDir = path.join(__dirname, '../');

app.use(express.static(rootDir, {
    extensions: ['html'],
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
            res.setHeader('Cache-Control', 'public, max-age=0');
        }
    }
}));

// Development Preview Dashboard
app.get('/preview', (req, res) => {
    console.log('--- Dev Dashboard Hit ---');
    res.status(200).sendFile(path.join(rootDir, 'preview.html'));
});

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

module.exports = app;
