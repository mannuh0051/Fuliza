const axios = require('axios');

module.exports = async (req, res) => {
    // Always return JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }

    try {
        const { phone, amount, reference, description } = req.body;
        if (!phone || !amount) {
            return res.status(400).json({ error: 'Missing phone or amount' });
        }

        const PAYLORE_API_KEY = process.env.PAYLORE_API_KEY;
        const PAYLORE_CHANNEL_ID = process.env.PAYLORE_CHANNEL_ID;
        if (!PAYLORE_API_KEY) {
            return res.status(500).json({ error: 'Missing API key' });
        }

        const payload = {
            phone,
            amount,
            reference: reference || `FULIZA_${Date.now()}`,
            description: description || 'Fuliza Payment'
        };
        if (PAYLORE_CHANNEL_ID) payload.channelId = PAYLORE_CHANNEL_ID;

        const response = await axios.post(
            'https://api.paylorke.com/api/v1/merchants/payments/stk-push',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${PAYLORE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Paylore error:', error.response?.data || error.message);
        return res.status(500).json({
            error: error.response?.data?.message || error.message || 'Internal server error'
        });
    }
};
