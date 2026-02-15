import { ApiService } from '../services/api.service.js';

/**
 * Booking Module
 * Handles the booking form logic
 */
export class Booking {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (this.container) {
            this.renderBookingUI();
        }
    }

    /**
     * Renders the booking form
     */
    async renderBookingUI() {
        this.container.innerHTML = '<p class="loading-text">Cargando horarios disponibles...</p>';

        const availability = await ApiService.getAvailability();

        if (!availability) {
            this.container.innerHTML = '<p class="error-text">No se pudieron cargar los horarios. Intenta más tarde.</p>';
            return;
        }

        const hoursOptions = availability.hours.map(h => `<option value="${h}">${h}</option>`).join('');

        this.container.innerHTML = `
            <div class="booking-card">
                <h3>Datos para reserva</h3>
                <form id="booking-form">
                    <div class="form-group">
                        <label>Nombre y Apellido:</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono de contacto:</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>Mail de contacto:</label>
                        <input type="email" name="email" required>
                    </div>
                     <div class="form-group">
                        <label>Actividad:</label>
                        <select name="activity" required>
                            <option value="Pilates Combinado">Pilates Combinado</option>
                            <option value="Yoga">Yoga</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Día Preferido:</label>
                        <select name="day" required>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Horario:</label>
                        <select name="time" required>
                            ${hoursOptions}
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Confirmar Reserva</button>
                </form>
            </div>
        `;

        this.initFormHandler();
    }

    /**
     * Initializes the form submission handler
     */
    initFormHandler() {
        const form = document.getElementById('booking-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                activity: formData.get('activity'),
                day: formData.get('day'),
                time: formData.get('time'),
                date: new Date().toLocaleDateString()
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando...';

            const result = await ApiService.addAppointment(data);

            if (result) {
                alert(`¡Reserva solicitada para ${data.activity}! Te confirmaremos por email.`);
                form.reset();
            } else {
                alert('Lo sentimos, hubo un error al procesar tu reserva. Por favor intenta más tarde.');
            }

            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    }
}
