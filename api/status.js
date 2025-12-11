const VercelServerMonitoring = require('../services/vercelMonitoring');

const monitoring = new VercelServerMonitoring();

module.exports = async (req, res) => {
    try {
        const status = await monitoring.getStatus();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve status', message: error.message });
    }
};
