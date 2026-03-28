const express = require('express');
const router = express.Router();
const { routes } = require('../data/sampleData');

// Get all routes
router.get('/', (req, res) => {
  res.json(routes);
});

// Get route by ID
router.get('/:id', (req, res) => {
  const route = routes.find(r => r.id === req.params.id);
  
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.json(route);
});

// Get popular routes (most frequent destinations)
router.get('/popular', (req, res) => {
  // Return top 4 popular routes
  const popularRoutes = routes.slice(0, 4);
  res.json(popularRoutes);
});

// Search routes by origin or destination
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchQuery = query.toLowerCase();
  const filteredRoutes = routes.filter(route => 
    route.origin.toLowerCase().includes(searchQuery) ||
    route.destination.toLowerCase().includes(searchQuery)
  );

  res.json(filteredRoutes);
});

module.exports = router;
