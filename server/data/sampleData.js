const Bus = require('../models/bus');

// Sample routes
const routes = [
  // Tamil Nadu Routes
  { id: 'route1', origin: 'Chennai', destination: 'Nagercoil', distance: 180, duration: '3h 30m' },
  { id: 'route2', origin: 'Chennai', destination: 'Thiruchy', distance: 320, duration: '5h 45m' },
  { id: 'route3', origin: 'Nagercoil', destination: 'Thiruchy', distance: 190, duration: '4h 15m' },
  { id: 'route4', origin: 'Chennai', destination: 'Coimbatore', distance: 490, duration: '7h 30m' },
  { id: 'route5', origin: 'Thiruchy', destination: 'Madurai', distance: 125, duration: '2h 30m' },
  { id: 'route6', origin: 'Coimbatore', destination: 'Madurai', distance: 210, duration: '4h 00m' },
  { id: 'route7', origin: 'Chennai', destination: 'Salem', distance: 340, duration: '6h 00m' },
  { id: 'route8', origin: 'Salem', destination: 'Thiruchy', distance: 150, duration: '3h 00m' },
  { id: 'route9', origin: 'Chennai', destination: 'Tirupur', distance: 310, duration: '5h 30m' },
  { id: 'route10', origin: 'Madurai', destination: 'Tirunelveli', distance: 155, duration: '3h 15m' },
  { id: 'route11', origin: 'Coimbatore', destination: 'Erode', distance: 90, duration: '2h 00m' },
  { id: 'route12', origin: 'Tiruchy', destination: 'Thanjavur', distance: 55, duration: '1h 30m' },
  
  // Keep some original routes for variety
  { id: 'route13', origin: 'New York', destination: 'Boston', distance: 215, duration: '4h 30m' },
  { id: 'route14', origin: 'New York', destination: 'Washington DC', distance: 225, duration: '4h 15m' },
  { id: 'route15', origin: 'Los Angeles', destination: 'San Francisco', distance: 380, duration: '6h 15m' },
  { id: 'route16', origin: 'Chicago', destination: 'Detroit', distance: 280, duration: '4h 45m' }
];

// Sample buses
const buses = [
  // Tamil Nadu Bus Services
  new Bus(
    'bus1',
    'TN-CHN-NGR-001',
    routes[0],
    '2026-01-15T08:00:00Z',
    '2026-01-15T11:30:00Z',
    45,
    40,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom']
  ),
  new Bus(
    'bus2',
    'TN-CHN-NGR-002',
    routes[0],
    '2026-01-15T14:00:00Z',
    '2026-01-15T18:30:00Z',
    50,
    40,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom', 'Snacks']
  ),
  new Bus(
    'bus3',
    'TN-CHN-THY-001',
    routes[1],
    '2026-01-16T06:30:00Z',
    '2026-01-16T12:15:00Z',
    40,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus4',
    'TN-NGR-THY-001',
    routes[2],
    '2026-01-16T09:00:00Z',
    '2026-01-16T13:15:00Z',
    45,
    40,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom']
  ),
  new Bus(
    'bus5',
    'TN-CHN-CMB-001',
    routes[3],
    '2026-01-17T08:30:00Z',
    '2026-01-17T15:00:00Z',
    50,
    45,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom', 'Entertainment']
  ),
  new Bus(
    'bus6',
    'TN-THY-MDU-001',
    routes[4],
    '2026-01-17T10:00:00Z',
    '2026-01-17T14:30:00Z',
    40,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus7',
    'TN-CMB-MDU-001',
    routes[5],
    '2026-01-18T08:30:00Z',
    '2026-01-18T14:00:00Z',
    45,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus8',
    'TN-CHN-SLM-001',
    routes[6],
    '2026-01-18T10:00:00Z',
    '2026-01-18T13:00:00Z',
    40,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus9',
    'TN-CHN-TUP-001',
    routes[7],
    '2026-01-19T08:30:00Z',
    '2026-01-19T15:30:00Z',
    50,
    40,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom']
  ),
  new Bus(
    'bus10',
    'TN-MDU-TVL-001',
    routes[8],
    '2026-01-19T10:00:00Z',
    '2026-01-19T16:15:00Z',
    40,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus11',
    'TN-CBE-EDU-001',
    routes[9],
    '2026-01-20T08:30:00Z',
    '2026-01-20T15:15:00Z',
    45,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus12',
    'TN-THY-TJV-001',
    routes[10],
    '2026-01-20T10:00:00Z',
    '2026-01-20T13:15:00Z',
    35,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus13',
    'TN-CBE-EDE-001',
    routes[11],
    '2026-01-21T09:00:00Z',
    '2026-01-21T12:00:00Z',
    40,
    40,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  
  // Keep some original routes for variety
  new Bus(
    'bus14',
    'NY-BOS-001',
    routes[12],
    '2026-01-01T08:00:00Z',
    '2026-01-01T12:30:00Z',
    45,
    40,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom']
  ),
  new Bus(
    'bus15',
    'NY-DC-001',
    routes[13],
    '2026-01-01T06:30:00Z',
    '2026-01-01T10:45:00Z',
    35,
    45,
    ['WiFi', 'AC', 'Charging Ports']
  ),
  new Bus(
    'bus16',
    'LA-SF-001',
    routes[14],
    '2026-01-01T07:00:00Z',
    '2026-01-01T13:15:00Z',
    75,
    50,
    ['WiFi', 'AC', 'Charging Ports', 'Restroom', 'Premium Seating']
  ),
  new Bus(
    'bus17',
    'CHI-DT-001',
    routes[15],
    '2026-01-01T08:30:00Z',
    '2026-01-01T13:15:00Z',
    40,
    40,
    ['WiFi', 'AC', 'Charging Ports']
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
