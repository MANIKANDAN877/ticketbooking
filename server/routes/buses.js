const express = require('express');
const router = express.Router();
const { buses, routes } = require('../data/sampleData');

// Get all buses
router.get('/', (req, res) => {
  res.json(buses.map(bus => ({
    id: bus.id,
    busNumber: bus.busNumber,
    route: bus.route,
    departureTime: bus.departureTime,
    arrivalTime: bus.arrivalTime,
    price: bus.price,
    totalSeats: bus.totalSeats,
    availableSeats: bus.availableSeats,
    amenities: bus.amenities
  })));
});

// Search buses by route and date
router.get('/search', (req, res) => {
  const { origin, destination, date } = req.query;
  
  if (!origin || !destination || !date) {
    return res.status(400).json({ 
      error: 'Origin, destination, and date are required' 
    });
  }

  const searchDate = new Date(date).toDateString();
  
  const filteredBuses = buses.filter(bus => {
    const busDate = new Date(bus.departureTime).toDateString();
    const matchesRoute = bus.route.origin.toLowerCase() === origin.toLowerCase() &&
                        bus.route.destination.toLowerCase() === destination.toLowerCase();
    const matchesDate = busDate === searchDate;
    
    return matchesRoute && matchesDate;
  });

  res.json(filteredBuses);
});

// Get specific bus details with seat layout
router.get('/:id', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json({
    id: bus.id,
    busNumber: bus.busNumber,
    route: bus.route,
    departureTime: bus.departureTime,
    arrivalTime: bus.arrivalTime,
    price: bus.price,
    totalSeats: bus.totalSeats,
    availableSeats: bus.availableSeats,
    amenities: bus.amenities,
    seatLayout: bus.seatLayout
  });
});

// Check seat availability
router.get('/:id/seats', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  const availableSeats = bus.seatLayout
    .filter(seat => seat.isAvailable)
    .map(seat => seat.number);

  res.json({ 
    busId: bus.id,
    availableSeats,
    totalSeats: bus.totalSeats,
    availableCount: bus.availableSeats
  });
});

module.exports = router;
