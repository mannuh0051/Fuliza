const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }

    try {
        const { transactionId } = req.query;
        if (!transactionId) {
            return res.status(400).json({ error: 'Missing transactionId' });
        }

        const PAYLORE_API_KEY = process.env.PAYLORE_API_KEY;
        if (!PAYLORE_API_KEY) {
            return res.status(500).json({ error: 'Missing API key' });
        }

        const response = await axios.get(
            `https://api.paylorke.com/api/v1/merchants/payments/transactions/${transactionId}`,
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
        return res.status(500).json({
            error: error.response?.data?.message || error.message || 'Status check failed'
        });
    }
};
