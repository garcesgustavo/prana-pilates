/**
 * Prana Pilates - API Utility
 * Handles communication with the Node.js backend
 */

const API_BASE_URL = '/api';

const Api = {
    // Security Token
    _token: sessionStorage.getItem('pp_admin_token') || '',

    setToken(token) {
        this._token = token;
        sessionStorage.setItem('pp_admin_token', token);
    },

    async getStats() {
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
    },

    async getAppointments() {
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
    },

    async addAppointment(data) {
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
    },

    async getUsers() {
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
    },

    async getAvailability() {
        try {
            const response = await fetch(`${API_BASE_URL}/availability`);
            return await response.json();
        } catch (err) {
            console.error('Error fetching availability:', err);
            return null;
        }
    },

    async logVisit() {
        try {
            const response = await fetch(`${API_BASE_URL}/visit`, {
                method: 'POST'
            });
            return await response.json();
        } catch (err) {
            console.error('Error logging visit:', err);
            return null;
        }
    },

    async addMessage(data) {
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
    },

    async getMessages() {
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
};
