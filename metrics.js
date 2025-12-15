let req = 0;
let err = 0;
let latSum = 0;
let start = Date.now();

function recordRequest(lat, isErr) {
  req++;
  latSum += lat || 0;
  if (isErr) err++;
}

function getMetrics() {
  return `
agro_requests_total ${req}
agro_errors_total ${err}
agro_avg_latency_ms ${(latSum / Math.max(req,1)).toFixed(2)}
agro_uptime_ms ${Date.now() - start}
`.trim();
}

module.exports = { recordRequest, getMetrics };
