const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Serve static files from dist directory (same level as api folder)
const frontendDistPath = path.join(__dirname, '..');
app.use(express.static(frontendDistPath));

// For SPA routing - serve index.html for all non-API routes that don't match static files
app.use((req, res, next) => {
  // Skip if it's an API route
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // Serve index.html for SPA routing
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 1,
    msg: 'Internal Server Error',
    data: null
  });
});

app.listen(PORT, () => {
  console.log(`WHOIS Domain Lookup server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;
