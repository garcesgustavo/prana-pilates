/**
 * Prana Pilates - Data Store
 * Handles all data persistence using localStorage
 */

const Store = {
    // Keys
    KEYS: {
        APPOINTMENTS: 'pp_appointments',
        USERS: 'pp_users',
        VISITS: 'pp_visits',
        AVAILABILITY: 'pp_availability'
    },

    // Initialize Store
    init() {
        if (!localStorage.getItem(this.KEYS.VISITS)) {
            localStorage.setItem(this.KEYS.VISITS, '0');
        }
        if (!localStorage.getItem(this.KEYS.APPOINTMENTS)) {
            localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify([]));
        }
        
        // Default Availability: Mon-Fri, 9am-6pm
        if (!localStorage.getItem(this.KEYS.AVAILABILITY)) {
            const defaultAvailability = {
                days: [1, 2, 3, 4, 5], // Mon-Fri
                hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
            };
            localStorage.setItem(this.KEYS.AVAILABILITY, JSON.stringify(defaultAvailability));
        }
    },

    // Visits
    logVisit() {
        let visits = parseInt(localStorage.getItem(this.KEYS.VISITS) || '0');
        visits++;
        localStorage.setItem(this.KEYS.VISITS, visits.toString());
        return visits;
    },

    getStats() {
        const visits = localStorage.getItem(this.KEYS.VISITS);
        const appointments = JSON.parse(localStorage.getItem(this.KEYS.APPOINTMENTS) || '[]');
        const users = JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
        
        return {
            visits,
            appointments: appointments.length,
            users: users.length
        };
    },

    // Appointments
    addAppointment(data) {
        const appointments = JSON.parse(localStorage.getItem(this.KEYS.APPOINTMENTS) || '[]');
        const newAppointment = {
            id: Date.now().toString(),
            status: 'pending',
            created_at: new Date().toISOString(),
            ...data
        };
        appointments.push(newAppointment);
        localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(appointments));
        
        // Also add to users if new
        this.addUser(data);
        
        return newAppointment;
    },

    getAppointments() {
        return JSON.parse(localStorage.getItem(this.KEYS.APPOINTMENTS) || '[]');
    },

    // Users
    addUser(data) {
        const users = JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
        const existing = users.find(u => u.email === data.email);
        
        if (!existing) {
            const newUser = {
                id: Date.now().toString(),
                name: data.name,
                email: data.email,
                phone: data.phone || ''
            };
            users.push(newUser);
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
        }
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
    },

    // Availability
    getAvailability() {
        return JSON.parse(localStorage.getItem(this.KEYS.AVAILABILITY) || '{}');
    }
};

// Auto-init on load
Store.init();
