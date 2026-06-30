const express = require('express');
const path = require('path');
const fs = require('fs');
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

// Serve static files - auto-detect between production (dist/api -> dist/)
// and development (backend/ -> dist/)
const tryPaths = [
  path.join(__dirname, '..'),           // production: dist/api -> dist/
  path.join(__dirname, '../dist'),      // dev: backend -> dist/
];
const frontendDistPath = tryPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || tryPaths[0];

app.use(express.static(frontendDistPath));

// SPA routing - serve index.html for all non-API routes
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
  console.log(`Static files: ${frontendDistPath}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;
