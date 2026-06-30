/**
 * Serverless Function Entry for Alibaba Cloud ESA / Tencent Cloud EO
 * Exports Express app as handler for serverless/edge function platforms.
 *
 * Note: For production (tencent-eo.json), server.js is used instead.
 * This file provides an alternative entry point for platforms that expect
 * a module export rather than a listening server.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const whoisRoutes = require('./src/routes/whois');
const rdapRoutes = require('./src/routes/rdap');
const priceRoutes = require('./src/routes/prices');

app.use('/api/whois', whoisRoutes);
app.use('/api/rdap', rdapRoutes);
app.use('/api/prices', priceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files - auto-detect between production (dist/api -> dist/)
// and development (backend/ -> dist/)
const tryPaths = [
  path.join(__dirname, '..'), // production: dist/api -> dist/
  path.join(__dirname, '../dist'), // dev: backend -> dist/
];
const frontendDistPath = tryPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || tryPaths[0];

app.use(express.static(frontendDistPath));

// SPA routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 1,
    msg: 'Internal Server Error',
    data: null
  });
});

// For traditional server mode (local development)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Static files: ${frontendDistPath}`);
  });
}

// Export for Serverless/Edge Function platforms
module.exports = app;
