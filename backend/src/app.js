const express = require('express');
const cors = require('cors');

const whoisRoutes = require('./routes/whois');
const rdapRoutes = require('./routes/rdap');
const priceRoutes = require('./routes/prices');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/whois', whoisRoutes);
app.use('/api/rdap', rdapRoutes);
app.use('/api/prices', priceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

module.exports = app;
