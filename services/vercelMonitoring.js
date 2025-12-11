const os = require('os');
const Metrics = require('../model/MetricsModel');

class VercelServerMonitoring {
    constructor() {
        this.startTime = Date.now();
        this.requestCountLocal = 0;
        this.errorCountLocal = 0;
        this.responseTimes = [];
    }

    recordRequest() {
        this.requestCountLocal++;
    }

    recordError() {
        this.errorCountLocal++;
    }

    recordResponseTime(time) {
        this.responseTimes.push(time);
        if (this.responseTimes.length > 100) {
            this.responseTimes.shift();
        }
    }

    getAverageResponseTime() {
        if (this.responseTimes.length === 0) return 0;
        const sum = this.responseTimes.reduce((a, b) => a + b, 0);
        return (sum / this.responseTimes.length).toFixed(2);
    }

    async persistMetrics() {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const memoryUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

            const metric = new Metrics({
                requestCount: this.requestCountLocal,
                errorCount: this.errorCountLocal,
                totalResponseTime: this.responseTimes.reduce((a, b) => a + b, 0),
                responseCount: this.responseTimes.length,
                memoryUsagePercent: memoryUsagePercent,
                uptime: Date.now() - this.startTime
            });

            await metric.save();
        } catch (error) {
            console.error('Error persisting metrics:', error);
        }
    }

    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    async getStatus() {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const cpus = os.cpus();

            // Get recent metrics from database
            const recentMetrics = await Metrics.find({})
                .sort({ timestamp: -1 })
                .limit(1);

            const dbMetric = recentMetrics[0];
            const uptime = Date.now() - this.startTime;
            const memoryUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

            let totalRequests = this.requestCountLocal;
            let totalErrors = this.errorCountLocal;

            if (dbMetric) {
                totalRequests += dbMetric.requestCount;
                totalErrors += dbMetric.errorCount;
            }

            const status = totalRequests === 0 ? 'HEALTHY' :
                memoryUsagePercent > 85 ? 'WARNING' :
                memoryUsagePercent > 95 || (totalErrors / totalRequests) * 100 > 10 ? 'CRITICAL' : 'HEALTHY';

            return {
                status,
                uptime,
                uptimeFormatted: this.formatUptime(uptime),
                totalMemory: (totalMem / 1024 / 1024 / 1024).toFixed(2),
                usedMemory: (usedMem / 1024 / 1024 / 1024).toFixed(2),
                freeMemory: (freeMem / 1024 / 1024 / 1024).toFixed(2),
                memoryUsagePercent: memoryUsagePercent,
                cpuCount: cpus.length,
                platform: os.platform(),
                nodeVersion: process.version,
                requestsTotal: totalRequests,
                errorsTotal: totalErrors,
                errorRate: totalRequests === 0 ? 0 : ((totalErrors / totalRequests) * 100).toFixed(2),
                averageResponseTime: this.getAverageResponseTime(),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting status:', error);
            return {
                status: 'ERROR',
                error: 'Failed to retrieve status',
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = VercelServerMonitoring;
