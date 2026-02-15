require('dotenv').config();

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
    console.error('CRITICAL: ADMIN_TOKEN not found in .env. Admin features will be disabled.');
}

/**
 * Middleware to require admin authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requireAdmin = (req, res, next) => {
    const token = req.headers['authorization'];

    // Debug logs - remove in production
    if (token !== ADMIN_TOKEN) {
        console.log(`[Auth Debug] Login attempt failed.`);
        console.log(`[Auth Debug] Received token: '${token}'`);
        console.log(`[Auth Debug] Expected (loaded): '${ADMIN_TOKEN}'`);
    }

    if (token === ADMIN_TOKEN) {
        next();
    } else {
        res.status(401).json({ error: 'unauthorized' });
    }
};

module.exports = requireAdmin;
