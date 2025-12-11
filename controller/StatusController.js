const getStatus = (monitoring) => {
    return (req, res) => {
        try {
            const status = monitoring.getStatus();
            res.status(200).json(status);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve status' });
        }
    };
};

const getStatusPage = (req, res) => {
    try {
        res.render('status');
    } catch (error) {
        res.status(500).json({ error: 'Failed to load status page' });
    }
};

module.exports = { getStatus, getStatusPage };
