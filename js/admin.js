/**
 * Admin Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('admin')) return;

    // Check for token or prompt
    let stats = await Api.getStats();
    if (!stats || stats.error === 'unauthorized') {
        const password = prompt('Por favor, ingresa la contraseña de administrador:');
        if (password) {
            Api.setToken(password);
            stats = await Api.getStats();
            if (!stats || stats.error === 'unauthorized') {
                alert('Contraseña incorrecta.');
                window.location.href = 'index.html';
                return;
            }
        } else {
            window.location.href = 'index.html';
            return;
        }
    }

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
});

async function loadStats() {
    const stats = await Api.getStats();
    if (!stats) return;
    document.getElementById('stat-visits').textContent = stats.visits;
    document.getElementById('stat-pending').textContent = stats.appointments;
    document.getElementById('stat-clients').textContent = stats.users;
}

async function loadView(viewName) {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    const stats = await Api.getStats();

    switch (viewName) {
        case 'dashboard':
            pageTitle.textContent = 'Resumen';
            contentArea.innerHTML = `
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Visitas Totales</h3>
                        <p>${stats ? stats.visits : '-'}</p>
                    </div>
                </div>
                <div class="section-title" style="margin-top: 2rem;">Últimas Reservas</div>
                ${await renderAppointmentsTable(3)}
            `;
            break;

        case 'appointments':
            pageTitle.textContent = 'Reservas';
            contentArea.innerHTML = await renderAppointmentsTable();
            break;

        case 'clients':
            pageTitle.textContent = 'Base de Datos de Clientes';
            contentArea.innerHTML = await renderClientsTable();
            break;

        case 'settings':
            pageTitle.textContent = 'Configuración de Disponibilidad';
            contentArea.innerHTML = '<p>Funcionalidad de configuración en desarrollo.</p>';
            break;
    }
}

async function renderAppointmentsTable(limit = null) {
    let appointments = await Api.getAppointments();
    appointments.reverse();
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

async function renderClientsTable() {
    const users = await Api.getUsers();

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
