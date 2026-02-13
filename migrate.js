const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const DB_PATH = path.join(__dirname, 'data', 'db.json');
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI no definida en .env');
    process.exit(1);
}

// Schemas (Must match server.js)
const appointmentSchema = new mongoose.Schema({
    name: String, email: String, activity: String, day: String, time: String, status: String, created_at: Date
});
const userSchema = new mongoose.Schema({
    name: String, email: String, phone: String, created_at: Date
});
const statSchema = new mongoose.Schema({
    visits: Number
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const User = mongoose.model('User', userSchema);
const Stat = mongoose.model('Stat', statSchema);

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB...');

        if (!await fs.pathExists(DB_PATH)) {
            console.log('No se encontró db.json. Nada que migrar.');
            process.exit(0);
        }

        const data = await fs.readJson(DB_PATH);
        console.log(`Migrando ${data.appointments.length} reservas y ${data.users.length} usuarios...`);

        // Migrate Stats
        await Stat.findOneAndUpdate({}, { visits: data.visits }, { upsert: true });

        // Migrate Users (avoid duplicates)
        for (const u of data.users) {
            await User.findOneAndUpdate(
                { email: u.email.toLowerCase() },
                { name: u.name, phone: u.phone },
                { upsert: true }
            );
        }

        // Migrate Appointments
        const appointmentsToInsert = data.appointments.map(app => ({
            name: app.name,
            email: app.email,
            activity: app.activity,
            day: app.day,
            time: app.time,
            status: app.status || 'pending',
            created_at: app.created_at
        }));

        if (appointmentsToInsert.length > 0) {
            await Appointment.insertMany(appointmentsToInsert);
        }

        console.log('¡Migración completada con éxito!');
        process.exit(0);
    } catch (err) {
        console.error('Error durante la migración:', err);
        process.exit(1);
    }
}

migrate();
