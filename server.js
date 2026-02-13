const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MercadoPagoConfig, Preference } = require('mercadopago');

require('dotenv').config();

// Mercado Pago Configuration
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-APP-ACCESS-TOKEN' // FALLBACK FOR DEV
});

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
    console.error('CRITICAL: ADMIN_TOKEN not found in .env. Admin features will be disabled.');
}

// ---------------------------------------------------------
// MongoDB Connection
// ---------------------------------------------------------
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.warn('MONGODB_URI not found. Server running without DB (limited functionality).');
}

// ---------------------------------------------------------
// Schemas & Models
// ---------------------------------------------------------
const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    activity: { type: String, required: true },
    day: String,
    time: String,
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    created_at: { type: Date, default: Date.now }
});

const statSchema = new mongoose.Schema({
    visits: { type: Number, default: 0 }
});

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const User = mongoose.model('User', userSchema);
const Stat = mongoose.model('Stat', statSchema);
const Message = mongoose.model('Message', messageSchema);

// Initialize visits if not exist
async function initStats() {
    try {
        await Stat.findOneAndUpdate({}, { $setOnInsert: { visits: 0 } }, { upsert: true });
    } catch (err) {
        console.error('Error initializing stats:', err);
    }
}
if (MONGODB_URI) initStats();

// ---------------------------------------------------------
// Middleware
// ---------------------------------------------------------
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://images.unsplash.com"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            "frame-src": ["'self'", "https://www.google.com"],
        },
    },
}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname), {
    maxAge: '1d', // Cache static assets for 1 day
    setHeaders: (res, path) => {
        if (path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'public, max-age=0'); // Force fresh content for HTML, JS, and CSS
        }
    }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }
});
app.use('/api/', limiter);

const requireAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === ADMIN_TOKEN) {
        next();
    } else {
        res.status(401).json({ error: 'unauthorized' });
    }
};

// ---------------------------------------------------------
// API Routes
// ---------------------------------------------------------

// Stats (Protected)
app.get('/api/stats', requireAdmin, async (req, res) => {
    try {
        const stats = await Stat.findOne();
        const appointmentsCount = await Appointment.countDocuments();
        const usersCount = await User.countDocuments();
        res.json({
            visits: stats ? stats.visits : 0,
            appointments: appointmentsCount,
            users: usersCount
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Appointments
app.get('/api/appointments', requireAdmin, async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ created_at: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { name, email, activity, day, time, phone } = req.body;
        if (!name || !email || !activity) {
            return res.status(400).json({ error: 'Datos requeridos faltantes.' });
        }

        const sanitize = (str) => typeof str === 'string' ? str.substring(0, 100).replace(/[<>&"']/g, "") : "";

        const newAppointment = new Appointment({
            name: sanitize(name),
            email: sanitize(email).toLowerCase(),
            phone: sanitize(phone).substring(0, 20),
            activity: sanitize(activity).substring(0, 50),
            day: sanitize(day),
            time: sanitize(time)
        });
        await newAppointment.save();

        // Update or create user
        await User.findOneAndUpdate(
            { email: sanitize(email).toLowerCase() },
            {
                name: sanitize(name),
                phone: sanitize(phone).substring(0, 20)
            },
            { upsert: true, new: true }
        );

        res.status(201).json(newAppointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la reserva' });
    }
});

// Users
app.get('/api/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find().sort({ created_at: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Messages
app.get('/api/messages', requireAdmin, async (req, res) => {
    try {
        const messages = await Message.find().sort({ created_at: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Datos requeridos faltantes.' });
        }

        const sanitize = (str) => typeof str === 'string' ? str.substring(0, 500).replace(/[<>&"']/g, "") : "";

        const newMessage = new Message({
            name: sanitize(name),
            email: sanitize(email).toLowerCase(),
            message: sanitize(message)
        });
        await newMessage.save();

        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar el mensaje' });
    }
});

// Payments
app.post('/api/create-preference', async (req, res) => {
    try {
        const { plan, price } = req.body;

        const preference = new Preference(mpClient);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: `Prana Pilates - ${plan}`,
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'ARS'
                    }
                ],
                back_urls: {
                    success: `${req.protocol}://${req.get('host')}/payment-success.html`,
                    failure: `${req.protocol}://${req.get('host')}/payment-failure.html`,
                    pending: `${req.protocol}://${req.get('host')}/payment-pending.html`
                },
                auto_return: 'approved',
            }
        });

        res.json({ id: result.id, init_point: result.init_point });
    } catch (err) {
        console.error('Error creating MP preference:', err);
        res.status(500).json({ error: 'Error al iniciar el pago seguro.' });
    }
});

// Availability (Static for now, could be move to DB later)
app.get('/api/availability', async (req, res) => {
    res.json({
        hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
    });
});

// Visit tracking
app.post('/api/visit', async (req, res) => {
    try {
        const stats = await Stat.findOneAndUpdate({}, { $inc: { visits: 1 } }, { new: true, upsert: true });
        res.json({ visits: stats.visits });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar visita' });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

// Keep-Alive Mechanism for Render
const externalUrl = process.env.RENDER_EXTERNAL_URL;
if (externalUrl) {
    setInterval(() => {
        https.get(`${externalUrl}/api/health`, (res) => {
            console.log(`Keep-alive ping sent to ${externalUrl}. Status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error('Keep-alive ping error:', err.message);
        });
    }, 14 * 60 * 1000); // 14 minutes
}

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        if (externalUrl) console.log(`Keep-alive active for: ${externalUrl}`);
    });
}

module.exports = app;
