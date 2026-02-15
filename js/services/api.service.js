/**
 * Prana Pilates - API Service
 * Handles communication with the Node.js backend
 */
const API_BASE_URL = '/api';

export class ApiService {
    static _token = sessionStorage.getItem('pp_admin_token') || '';

    /**
     * Set the authentication token
     * @param {string} token - The JWT token
     */
    static setToken(token) {
        this._token = token;
        sessionStorage.setItem('pp_admin_token', token);
    }

    /**
     * Get dashboard stats (Visits, Users, Appointments)
     * @returns {Promise<Object|null>}
     */
    static async getStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`, {
                headers: { 'Authorization': this._token }
            });
            if (response.status === 401) return { error: 'unauthorized' };
            return await response.json();
        } catch (err) {
            console.error('Error fetching stats:', err);
            return null;
        }
    }

    /**
     * Get all appointments
     * @returns {Promise<Array>}
     */
    static async getAppointments() {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                headers: { 'Authorization': this._token }
            });
            if (response.status === 401) return [];
            return await response.json();
        } catch (err) {
            console.error('Error fetching appointments:', err);
            return [];
        }
    }

    /**
     * Create a new appointment
     * @param {Object} data - Appointment data
     * @returns {Promise<Object|null>}
     */
    static async addAppointment(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (err) {
            console.error('Error adding appointment:', err);
            return null;
        }
    }

    /**
     * Get all registered users
     * @returns {Promise<Array>}
     */
    static async getUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: { 'Authorization': this._token }
            });
            if (response.status === 401) return [];
            return await response.json();
        } catch (err) {
            console.error('Error fetching users:', err);
            return [];
        }
    }

    /**
     * Get available hours
     * @returns {Promise<Object|null>}
     */
    static async getAvailability() {
        try {
            // Updated path to match new backend structure
            const response = await fetch(`${API_BASE_URL}/appointments/availability`);
            return await response.json();
        } catch (err) {
            console.error('Error fetching availability:', err);
            return null;
        }
    }

    /**
     * Log a new visit
     * @returns {Promise<Object|null>}
     */
    static async logVisit() {
        try {
            // Updated path to match new backend structure
            const response = await fetch(`${API_BASE_URL}/stats/visit`, {
                method: 'POST'
            });
            return await response.json();
        } catch (err) {
            console.error('Error logging visit:', err);
            return null;
        }
    }

    /**
     * Send a contact message
     * @param {Object} data - Message data
     * @returns {Promise<Object|null>}
     */
    static async addMessage(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (err) {
            console.error('Error adding message:', err);
            return null;
        }
    }

    /**
     * Get all messages
     * @returns {Promise<Array>}
     */
    static async getMessages() {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                headers: { 'Authorization': this._token }
            });
            if (response.status === 401) return [];
            return await response.json();
        } catch (err) {
            console.error('Error fetching messages:', err);
            return [];
        }
    }

    /**
     * Create a Mercado Pago preference
     * @param {Object} data - Payment data (plan, price)
     * @returns {Promise<Object|null>}
     */
    static async createPreference(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/create-preference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (err) {
            console.error('Error creating preference:', err);
            return null;
        }
    }
}
