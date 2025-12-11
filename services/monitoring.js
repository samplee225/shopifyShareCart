const os = require('os');

class ServerMonitoring {
    constructor() {
        this.startTime = Date.now();
        this.requestCount = 0;
        this.errorCount = 0;
        this.responseTime = [];
    }

    recordRequest() {
        this.requestCount++;
    }

    recordError() {
        this.errorCount++;
    }

    recordResponseTime(time) {
        this.responseTime.push(time);
        // Keep only last 100 responses for calculation
        if (this.responseTime.length > 100) {
            this.responseTime.shift();
        }
    }

    getUptime() {
        return Date.now() - this.startTime;
    }

    getAverageResponseTime() {
        if (this.responseTime.length === 0) return 0;
        const sum = this.responseTime.reduce((a, b) => a + b, 0);
        return (sum / this.responseTime.length).toFixed(2);
    }

    getSystemMetrics() {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const cpus = os.cpus();

        return {
            uptime: this.getUptime(),
            uptimeFormatted: this.formatUptime(this.getUptime()),
            totalMemory: (totalMem / 1024 / 1024 / 1024).toFixed(2),
            usedMemory: (usedMem / 1024 / 1024 / 1024).toFixed(2),
            freeMemory: (freeMem / 1024 / 1024 / 1024).toFixed(2),
            memoryUsagePercent: ((usedMem / totalMem) * 100).toFixed(2),
            cpuCount: cpus.length,
            platform: os.platform(),
            nodeVersion: process.version,
            requestsTotal: this.requestCount,
            errorsTotal: this.errorCount,
            errorRate: this.requestCount === 0 ? 0 : ((this.errorCount / this.requestCount) * 100).toFixed(2),
            averageResponseTime: this.getAverageResponseTime(),
            timestamp: new Date().toISOString()
        };
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

    getStatus() {
        const metrics = this.getSystemMetrics();
        let status = 'HEALTHY';
        
        if (metrics.memoryUsagePercent > 85) {
            status = 'WARNING';
        }
        if (metrics.memoryUsagePercent > 95 || metrics.errorRate > 10) {
            status = 'CRITICAL';
        }

        return {
            status,
            ...metrics
        };
    }
}

module.exports = ServerMonitoring;
