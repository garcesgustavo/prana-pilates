import { ApiService } from './services/api.service.js';

/**
 * Admin Dashboard Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Only run on admin pages or check for specific element
    const adminLayout = document.querySelector('.admin-layout');
    if (!adminLayout) return;

    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');

    // Check for existing valid token
    let stats = await ApiService.getStats();
    if (stats && stats.error !== 'unauthorized') {
        showDashboard();
    } else {
        loginModal.style.display = 'flex';
        adminLayout.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            ApiService.setToken(password);

            stats = await ApiService.getStats();
            if (stats && stats.error !== 'unauthorized') {
                showDashboard();
            } else {
                loginError.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }

    async function showDashboard() {
        if (loginModal) loginModal.style.display = 'none';
        if (adminLayout) adminLayout.style.display = 'flex';

        // Load Stats
        await loadStats();

        // Navigation Handler
        const navLinks = document.querySelectorAll('.admin-nav a[data-view]');
        navLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();

                // Update Active State
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Switch View
                const viewName = link.dataset.view;
                await loadView(viewName);
            });
        });

        // Default View
        await loadView('dashboard');
    }
});

async function loadStats() {
    const stats = await ApiService.getStats();
    const statVisits = document.getElementById('stat-visits');
    const statPending = document.getElementById('stat-pending');
    const statClients = document.getElementById('stat-clients');

    if (!stats || !statVisits) return;

    statVisits.textContent = stats.visits || 0;
    statPending.textContent = stats.appointments || 0;
    statClients.textContent = stats.users || 0;
}

async function loadView(viewName) {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');

    if (!contentArea) return;

    // Reset content
    contentArea.innerHTML = '<p>Cargando...</p>';

    // Determine content based on view
    switch (viewName) {
        case 'dashboard':
            const stats = await ApiService.getStats();
            if (pageTitle) pageTitle.textContent = 'Resumen';
            contentArea.innerHTML = `
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Visitas Totales</h3>
                        <p>${stats ? stats.visits : '-'}</p>
                    </div>
                     <div class="stat-card">
                        <h3>Reservas Pendientes</h3>
                        <p>${stats ? stats.appointments : '-'}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Clientes</h3>
                        <p>${stats ? stats.users : '-'}</p>
                    </div>
                </div>
                <div class="section-title" style="margin-top: 2rem;">Últimas Reservas</div>
                ${await renderAppointmentsTable(3)}
            `;
            break;

        case 'appointments':
            if (pageTitle) pageTitle.textContent = 'Reservas';
            contentArea.innerHTML = await renderAppointmentsTable();
            break;

        case 'messages':
            if (pageTitle) pageTitle.textContent = 'Mensajes de Contacto';
            contentArea.innerHTML = await renderMessagesTable();
            break;

        case 'clients':
            if (pageTitle) pageTitle.textContent = 'Base de Datos de Clientes';
            contentArea.innerHTML = await renderClientsTable();
            break;

        case 'settings':
            if (pageTitle) pageTitle.textContent = 'Configuración';
            contentArea.innerHTML = '<p>Funcionalidad de configuración en desarrollo.</p>';
            break;
    }
}

async function renderAppointmentsTable(limit = null) {
    let appointments = await ApiService.getAppointments();
    if (!appointments || appointments.error) return '<p>Error al cargar reservas.</p>';

    // Copy array
    const displayApps = [...appointments].reverse(); // Assuming API returns newest last? actually backend sorts descending.
    // If backend sorts descending, we don't need to reverse unless backend sort is different.
    // Backend: .sort({ created_at: -1 }) -> Newest first.
    // Existing code did .reverse()... which means oldest first? 
    // Let's assume user wants newest first. If backend sends newest first (desc), then reverse makes it oldest first (asc).
    // I will remove .reverse() to keep newest first as backend sends it. 
    // Wait, original Admin.js did `[...appointments].reverse()`. 
    // If backend was `Appointment.find().sort({ created_at: -1 })`, then it returns newest first.
    // Reversing it makes it oldest first.
    // Usually dashboards show newest first.
    // Maybe the original backend was NOT sorting?
    // Original backend: `Appointment.find().sort({ created_at: -1 })` -> YES it was sorting.
    // So the original admin panel was showing OLDEST first? That's weird.
    // I will TRUST THE BACKEND SORT (Newest First) and remove reverse.

    // Actually, let's keep it simple.
    const finalApps = limit ? appointments.slice(0, limit) : appointments;

    if (finalApps.length === 0) return '<p>No hay reservas registradas.</p>';

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Día/Hora</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${finalApps.map(app => `
                    <tr>
                        <td>${new Date(app.created_at).toLocaleDateString()}</td>
                        <td>${app.name}<br/><small>${app.email}</small></td>
                        <td>${app.day} - ${app.time}</td>
                        <td><span class="status-badge">${app.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function renderMessagesTable() {
    let messages = await ApiService.getMessages();
    if (!messages) return '<p>Error al cargar mensajes.</p>';

    if (messages.length === 0) return '<p>No hay mensajes registrados.</p>';

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Remitente</th>
                    <th>Mensaje</th>
                </tr>
            </thead>
            <tbody>
                ${messages.map(m => `
                    <tr>
                        <td>${new Date(m.created_at).toLocaleDateString()}</td>
                        <td>${m.name}<br/><small>${m.email}</small></td>
                        <td>${m.message}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function renderClientsTable() {
    const users = await ApiService.getUsers();

    if (!users || users.length === 0) return '<p>No hay clientes registrados.</p>';

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(u => `
                    <tr>
                        <td>${u.name}</td>
                        <td>${u.email}</td>
                        <td>${u.phone || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
