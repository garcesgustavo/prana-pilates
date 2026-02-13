/**
 * Admin Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('admin')) return;

    // Load Stats
    loadStats();

    // Navigation Handler
    const navLinks = document.querySelectorAll('.admin-nav a[data-view]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update Active State
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch View
            const viewName = link.dataset.view;
            loadView(viewName);
        });
    });

    // Default View
    loadView('dashboard');
});

function loadStats() {
    const stats = Store.getStats();
    document.getElementById('stat-visits').textContent = stats.visits;
    document.getElementById('stat-pending').textContent = stats.appointments;
    document.getElementById('stat-clients').textContent = stats.users;
}

function loadView(viewName) {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');

    switch (viewName) {
        case 'dashboard':
            pageTitle.textContent = 'Resumen';
            contentArea.innerHTML = `
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Visitas Totales</h3>
                        <p>${Store.getStats().visits}</p>
                    </div>
                </div>
                <div class="section-title" style="margin-top: 2rem;">Últimas Reservas</div>
                ${renderAppointmentsTable(3)}
            `;
            break;

        case 'appointments':
            pageTitle.textContent = 'Reservas';
            contentArea.innerHTML = renderAppointmentsTable();
            break;

        case 'clients':
            pageTitle.textContent = 'Base de Datos de Clientes';
            contentArea.innerHTML = renderClientsTable();
            break;

        case 'settings':
            pageTitle.textContent = 'Configuración de Disponibilidad';
            contentArea.innerHTML = '<p>Funcionalidad de configuración en desarrollo.</p>';
            break;
    }
}

function renderAppointmentsTable(limit = null) {
    let appointments = Store.getAppointments().reverse();
    if (limit) appointments = appointments.slice(0, limit);

    if (appointments.length === 0) return '<p>No hay reservas registradas.</p>';

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
                ${appointments.map(app => `
                    <tr>
                        <td>${new Date(app.created_at).toLocaleDateString()}</td>
                        <td>${app.name}<br><small>${app.email}</small></td>
                        <td>${app.day} - ${app.time}</td>
                        <td><span class="status-badge">${app.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderClientsTable() {
    const users = Store.getUsers();

    if (users.length === 0) return '<p>No hay clientes registrados.</p>';

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
