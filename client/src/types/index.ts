export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
}

export interface Seat {
  number: string;
  isAvailable: boolean;
  type: 'window' | 'aisle' | 'regular';
}

export interface Bus {
  id: string;
  busNumber: string;
  route: Route;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  seatLayout?: Seat[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
}

export interface Booking {
  id: string;
  busId: string;
  userId: string;
  passengerDetails: Passenger[];
  seatNumbers: string[];
  totalPrice: number;
  bookingTime: string;
  status: 'confirmed' | 'cancelled';
  paymentStatus: 'paid' | 'pending';
  busDetails?: {
    busNumber: string;
    route: Route;
    departureTime: string;
    arrivalTime: string;
    amenities: string[];
  };
}

export interface BookingRequest {
  busId: string;
  userId: string;
  passengers: Passenger[];
  seatNumbers: string[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
}
