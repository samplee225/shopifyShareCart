const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now, index: true },
    requestCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    totalResponseTime: { type: Number, default: 0 },
    responseCount: { type: Number, default: 0 },
    memoryUsagePercent: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 }
});

// Auto-delete old metrics after 7 days
metricsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

const Metrics = mongoose.model('Metrics', metricsSchema);

module.exports = Metrics;
