/**
 * Main Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
            contactForm.reset();
        });
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .class-card');
    animatedElements.forEach(el => observer.observe(el));

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.toggle('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }
});

// Defer non-critical tasks until after the page has loaded and is interactive
window.addEventListener('load', () => {
    // Log visit without blocking the initial render
    setTimeout(() => {
        Api.logVisit();
    }, 1500);

    // Initialise booking logic later
    const bookingApp = document.getElementById('booking-app');
    if (bookingApp) {
        renderBookingUI(bookingApp);
    }
});

async function renderBookingUI(container) {
    const availability = await Api.getAvailability();
    if (!availability) return;

    // Simple HTML for booking
    container.innerHTML = `
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
                    </select>
                </div>
                <div class="form-group">
                    <label>Horario:</label>
                    <select name="time" required>
                        ${availability.hours.map(h => `<option value="${h}">${h}</option>`).join('')}
                    </select>
                </div>
                <button type="submit" class="btn-primary">Confirmar Reserva</button>
            </form>
        </div>
    `;

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

        const result = await Api.addAppointment(data);
        if (result) {
            alert(`¡Reserva solicitada para ${data.activity}! Te confirmaremos por email.`);
            form.reset();
        } else {
            alert('Lo sentimos, hubo un error al procesar tu reserva. Por favor intenta más tarde.');
        }
    });
}
