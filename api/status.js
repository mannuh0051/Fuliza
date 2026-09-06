// api/status.js
const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { transactionId } = req.query;
    if (!transactionId) {
        return res.status(400).json({ error: 'Missing transactionId' });
    }

    const PAYLORE_API_KEY = process.env.PAYLORE_API_KEY;
    const PAYLORE_BASE = 'https://api.paylorke.com/api/v1';

    try {
        const response = await axios.get(
            `${PAYLORE_BASE}/merchants/payments/transactions/${transactionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${PAYLORE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Status error:', error.response?.data || error.message);
        return res.status(500).json({ error: error.response?.data?.message || error.message });
    }
};
