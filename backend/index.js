/**
 * Serverless Function Entry for Alibaba Cloud ESA / Tencent Cloud EO
 * This file exports the Express app as a handler function
 */

const express = require('express');
const path = require('path');
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

// Serve static files from frontend dist directory
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// For SPA routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
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
  });
}

// Export for Serverless/Edge Function platforms
module.exports = app;
