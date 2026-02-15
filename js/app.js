/**
 * Prana Pilates - Main Application Entry Point
 */
import { UI } from './modules/ui.js';
import { Booking } from './modules/booking.js';
import { Payment } from './modules/payment.js';
import { Contact } from './modules/contact.js';
import { ApiService } from './services/api.service.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI Components (Splash, Scroll, Menu)
    const ui = new UI();

    // Initialize Booking System
    // Defer slightly to prioritize critical rendering
    setTimeout(() => {
        new Booking('booking-app');
    }, 100);

    // Initialize Payment System
    new Payment();

    // Initialize Contact Form
    new Contact();
});

// Window Load Tasks (Analytics, heavy assets)
window.addEventListener('load', () => {
    // Log Visit
    setTimeout(() => {
        ApiService.logVisit();
    }, 1500);
});
