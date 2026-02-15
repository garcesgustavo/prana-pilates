const app = require('./src/app');
const https = require('https');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const externalUrl = process.env.RENDER_EXTERNAL_URL;

// Keep-Alive Mechanism for Render
if (externalUrl) {
    setInterval(() => {
        https.get(`${externalUrl}/api/health`, (res) => {
            console.log(`Keep-alive ping sent to ${externalUrl}. Status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error('Keep-alive ping error:', err.message);
        });
    }, 14 * 60 * 1000); // 14 minutes
}

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        if (externalUrl) console.log(`Keep-alive active for: ${externalUrl}`);
    });
}

module.exports = app;
