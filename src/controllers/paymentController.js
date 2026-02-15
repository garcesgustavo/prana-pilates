const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

// Mercado Pago Configuration
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-APP-ACCESS-TOKEN'
});

/**
 * Create a Mercado Pago preference
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createPreference = async (req, res) => {
    try {
        const { plan, price } = req.body;

        const preference = new Preference(mpClient);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: `Prana Pilates - ${plan}`,
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'ARS'
                    }
                ],
                back_urls: {
                    success: `${req.protocol}://${req.get('host')}/payment-success.html`,
                    failure: `${req.protocol}://${req.get('host')}/payment-failure.html`,
                    pending: `${req.protocol}://${req.get('host')}/payment-pending.html`
                },
                auto_return: 'approved',
            }
        });

        res.json({ id: result.id, init_point: result.init_point });
    } catch (err) {
        console.error('Error creating MP preference:', err);
        res.status(500).json({ error: 'Error al iniciar el pago seguro.' });
    }
};
