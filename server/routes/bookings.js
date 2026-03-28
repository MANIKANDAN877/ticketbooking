const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const { buses } = require('../data/sampleData');

// In-memory storage for bookings
let bookings = [];

// Create new booking
router.post('/', (req, res) => {
  try {
    const { busId, userId, passengers, seatNumbers } = req.body;

    // Validate request
    if (!busId || !userId || !passengers || !seatNumbers) {
      return res.status(400).json({ 
        error: 'Bus ID, user ID, passengers, and seat numbers are required' 
      });
    }

    if (passengers.length !== seatNumbers.length) {
      return res.status(400).json({ 
        error: 'Number of passengers must match number of seats' 
      });
    }

    // Find bus
    const bus = buses.find(b => b.id === busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Check seat availability
    const { bookedSeats, unavailableSeats } = bus.bookSeats(seatNumbers);
    
    if (unavailableSeats.length > 0) {
      // Release any partially booked seats
      bus.releaseSeats(bookedSeats);
      return res.status(400).json({ 
        error: 'Seats not available', 
        unavailableSeats 
      });
    }

    // Create booking
    const booking = Booking.createFromRequest(
      busId, 
      userId, 
      passengers, 
      seatNumbers, 
      bus.price
    );

    bookings.push(booking);

    res.status(201).json({
      success: true,
      booking: booking.getSummary(),
      busDetails: {
        busNumber: bus.busNumber,
        route: bus.route,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime
      }
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get booking by ID
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const bus = buses.find(b => b.id === booking.busId);
  
  res.json({
    ...booking,
    busDetails: bus ? {
      busNumber: bus.busNumber,
      route: bus.route,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      amenities: bus.amenities
    } : null
  });
});

// Get all bookings for a user
router.get('/user/:userId', (req, res) => {
  const userBookings = bookings
    .filter(b => b.userId === req.params.userId)
    .map(booking => {
      const bus = buses.find(b => b.id === booking.busId);
      return {
        ...booking.getSummary(),
        busDetails: bus ? {
          busNumber: bus.busNumber,
          route: bus.route,
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime
        } : null
      };
    })
    .sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));

  res.json(userBookings);
});

// Cancel booking
router.post('/:id/cancel', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ error: 'Booking already cancelled' });
  }

  // Release seats
  const bus = buses.find(b => b.id === booking.busId);
  if (bus) {
    bus.releaseSeats(booking.seatNumbers);
  }

  // Cancel booking
  booking.cancel();

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    booking: booking.getSummary()
  });
});

// Get all bookings (admin endpoint)
router.get('/', (req, res) => {
  const bookingSummaries = bookings.map(booking => booking.getSummary());
  res.json(bookingSummaries);
});

module.exports = router;
