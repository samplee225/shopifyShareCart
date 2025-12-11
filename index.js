const express = require('express');
const routes = require('./Routes/Route');
const connectDB = require('./services/connection');
const cors = require('cors');
const dotenv = require('dotenv');
const ServerMonitoring = require('./services/monitoring');

const app = express();
dotenv.config();
const monitoring = new ServerMonitoring();

connectDB;
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './view');

// Middleware to track requests
app.use((req, res, next) => {
    const startTime = Date.now();
    monitoring.recordRequest();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        monitoring.recordResponseTime(duration);

        if (res.statusCode >= 400) {
            monitoring.recordError();
        }
    });

    next();
});

const PORT = process.env.PORT || 3000;

app.use('/api', routes);

// Status routes
app.get('/status', (req, res) => {
    res.render('status');
});

app.get('/api/status', (req, res) => {
    const status = monitoring.getStatus();
    res.json(status);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Status page available at http://localhost:${PORT}/status`);
}); 