import { ApiService } from '../services/api.service.js';

/**
 * Contact Module
 * Handles contact form submission
 */
export class Contact {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            const result = await ApiService.addMessage(data);

            if (result && result.success) {
                alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
                this.form.reset();
            } else {
                alert('Lo sentimos, hubo un error al enviar tu mensaje. Por favor intenta más tarde.');
            }

            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    }
}
