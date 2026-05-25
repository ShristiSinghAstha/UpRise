import client from 'prom-client';

// Enable collection of default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics({ register: client.register });

// Custom metric: Counter for HTTP requests
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status'],
});

// Custom metric: Histogram for request latency
const httpRequestDurationHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5], // latency buckets in seconds
});

/**
 * Middleware to track HTTP request metrics
 */
const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    // Use req.route.path if available, otherwise req.path to avoid high cardinality in routes with params
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const status = res.statusCode.toString();

    httpRequestCounter.labels(method, route, status).inc();
    httpRequestDurationHistogram.labels(method, route, status).observe(durationInSeconds);
  });

  next();
};

/**
 * Endpoint handler to serve raw metrics for Prometheus scraping
 */
const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
};

export { metricsMiddleware, metricsEndpoint, client as prometheusClient };
