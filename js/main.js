/**
 * Main Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Log visit
    Store.logVisit();

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Treat contact as a potential client/lead
            Store.addUser({ name, email });

            alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
            contactForm.reset();
        });
    }

    // Booking Logic
    const bookingApp = document.getElementById('booking-app');
    if (bookingApp) {
        renderBookingUI(bookingApp);
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
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
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

function renderBookingUI(container) {
    const availability = Store.getAvailability();

    // Simple HTML for booking (MVP)
    // In a real app this would be a datepicker
    container.innerHTML = `
        <div class="booking-card">
            <h3>Selecciona un Horario</h3>
            <form id="booking-form">
                <div class="form-group">
                    <label>Nombre:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
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
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            activity: formData.get('activity'),
            day: formData.get('day'),
            time: formData.get('time'),
            date: new Date().toLocaleDateString() // Simplification
        };

        Store.addAppointment(data);
        alert(`¡Reserva solicitada para ${data.activity}! Te confirmaremos por email.`);
        form.reset();
    });
}
