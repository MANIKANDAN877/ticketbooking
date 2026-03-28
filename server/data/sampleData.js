const Bus = require('../models/bus');

// Sample routes
const routes = [
  { id: 'route1', origin: 'New York', destination: 'Boston', distance: 215, duration: '4h 30m' },
  { id: 'route2', origin: 'New York', destination: 'Washington DC', distance: 225, duration: '4h 15m' },
  { id: 'route3', origin: 'Boston', destination: 'Philadelphia', distance: 310, duration: '5h 45m' },
  { id: 'route4', origin: 'Washington DC', destination: 'Miami', distance: 1050, duration: '18h 30m' },
  { id: 'route5', origin: 'Los Angeles', destination: 'San Francisco', distance: 380, duration: '6h 15m' },
  { id: 'route6', origin: 'Chicago', destination: 'Detroit', distance: 280, duration: '4h 45m' }
];

// Sample buses
const buses = [
  new Bus(
    'bus1',
    'NY-BOS-001',
    routes[0],
    '2026-04-01T08:00:00Z',
    '2026-04-01T12:30:00Z',
    45,
    40,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom']
  ),
  new Bus(
    'bus2',
    'NY-BOS-002',
    routes[0],
    '2026-04-01T14:00:00Z',
    '2026-04-01T18:30:00Z',
    55,
    40,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom', 'Snacks']
  ),
  new Bus(
    'bus3',
    'NY-DC-001',
    routes[1],
    '2026-04-02T06:30:00Z',
    '2026-04-02T10:45:00Z',
    35,
    45,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus4',
    'NY-DC-002',
    routes[1],
    '2026-04-02T11:00:00Z',
    '2026-04-02T15:15:00Z',
    40,
    45,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom']
  ),
  new Bus(
    'bus5',
    'BOS-PHL-001',
    routes[2],
    '2026-04-03T09:00:00Z',
    '2026-04-03T14:45:00Z',
    60,
    35,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom', 'Entertainment']
  ),
  new Bus(
    'bus6',
    'LA-SF-001',
    routes[4],
    '2026-04-04T07:00:00Z',
    '2026-04-04T13:15:00Z',
    75,
    50,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom', 'Premium Seating']
  ),
  new Bus(
    'bus7',
    'CHI-DT-001',
    routes[5],
    '2026-04-05T08:30:00Z',
    '2026-04-05T13:15:00Z',
    40,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus8',
    'DC-MIA-001',
    routes[3],
    '2026-04-06T20:00:00Z',
    '2026-04-07T14:30:00Z',
    120,
    35,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom', 'Overnight Service']
  )
];

// Simulate some booked seats for realistic demo
buses[0].bookSeats(['1A', '1B', '2C', '2D']);
buses[1].bookSeats(['5A', '5B', '6C']);
buses[2].bookSeats(['3A', '3B', '3C', '3D', '4A', '4B']);
buses[4].bookSeats(['1C', '1D', '2A']);

module.exports = {
  routes,
  buses
};
