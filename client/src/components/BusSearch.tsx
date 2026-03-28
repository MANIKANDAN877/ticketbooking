import React, { useState } from 'react';
import { Search, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { busService, bookingService } from '../services/api';
import { Bus, Passenger, SearchParams } from '../types';

interface BusSearchProps {
  onBookingComplete: (bookingId: string) => void;
}

const BusSearch: React.FC<BusSearchProps> = ({ onBookingComplete }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: '',
    destination: '',
    date: ''
  });
  const [searchResults, setSearchResults] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'search' | 'results' | 'seats' | 'details' | 'confirmation'>('search');

  // Available cities from sample data
  const availableCities = [
    'New York',
    'Boston', 
    'Washington DC',
    'Philadelphia',
    'Los Angeles',
    'San Francisco',
    'Chicago',
    'Detroit'
  ];

  const handleSearch = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.date) {
      alert('Please fill in all search fields');
      return;
    }

    setLoading(true);
    try {
      const results = await busService.searchBuses(searchParams);
      setSearchResults(results);
      setStep('results');
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = async (bus: Bus) => {
    setLoading(true);
    try {
      const busDetails = await busService.getBusDetails(bus.id);
      setSelectedBus(busDetails);
      setStep('seats');
    } catch (error) {
      console.error('Failed to get bus details:', error);
      alert('Failed to load bus details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < 6) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      alert('Maximum 6 seats allowed per booking');
    }
  };

  const proceedToDetails = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const newPassengers = selectedSeats.map((_, index) => ({
      name: '',
      age: 0,
      gender: 'male' as const,
      contactNumber: ''
    }));
    setPassengers(newPassengers);
    setStep('details');
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleBooking = async () => {
    if (!selectedBus) return;

    const isValid = passengers.every(p => 
      p.name.trim() !== '' && 
      p.age > 0 && 
      p.contactNumber.trim() !== ''
    );

    if (!isValid) {
      alert('Please fill in all passenger details correctly (name, age, and contact number are required)');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        busId: selectedBus.id,
        userId: 'user123', // In a real app, this would come from authentication
        passengers,
        seatNumbers: selectedSeats
      };

      const result = await bookingService.createBooking(bookingData);
      if (result.success) {
        setStep('confirmation');
        onBookingComplete(result.booking.id);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setStep('search');
    setSearchParams({ origin: '', destination: '', date: '' });
    setSearchResults([]);
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengers([]);
  };

  const renderSearchForm = () => (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Search Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Search for Buses</h2>
            <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>Available Cities:</strong> {availableCities.join(', ')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <MapPin className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  From
                </label>
                <input
                  type="text"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter origin city"
                  list="origin-cities"
                />
                <datalist id="origin-cities">
                  {availableCities.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <MapPin className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  To
                </label>
                <input
                  type="text"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter destination city"
                  list="destination-cities"
                />
                <datalist id="destination-cities">
                  {availableCities.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Calendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="mt-4 sm:mt-6 w-full px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {loading ? 'Searching...' : 'Search Buses'}
            </button>
          </div>
        </div>

        {/* Route Schedule */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">📅 April 2026 Schedule</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="border-l-4 border-blue-500 pl-2 sm:pl-3">
                <p className="font-semibold text-xs sm:text-sm">April 1</p>
                <p className="text-xs text-gray-600">New York → Boston (2 buses)</p>
              </div>
              <div className="border-l-4 border-green-500 pl-2 sm:pl-3">
                <p className="font-semibold text-xs sm:text-sm">April 2</p>
                <p className="text-xs text-gray-600">New York → Washington DC (2 buses)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-2 sm:pl-3">
                <p className="font-semibold text-xs sm:text-sm">April 3</p>
                <p className="text-xs text-gray-600">Boston → Philadelphia (1 bus)</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-2 sm:pl-3">
                <p className="font-semibold text-xs sm:text-sm">April 4</p>
                <p className="text-xs text-gray-600">Los Angeles → San Francisco (1 bus)</p>
              </div>
              <div className="border-l-4 border-red-500 pl-2 sm:pl-3">
                <p className="font-semibold text-xs sm:text-sm">April 5</p>
                <p className="text-xs text-gray-600">Chicago → Detroit (1 bus)</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-2 sm:pl-3">
                <p className="font-semibold text-xs sm:text-sm">April 6-7</p>
                <p className="text-xs text-gray-600">Washington DC → Miami (overnight)</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>💰 Payment:</strong> Cash only during journey
              </p>
              <p className="text-xs text-gray-700">
                <strong>🕐 Arrival:</strong> 15 minutes before departure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Available Buses</h2>
        <button onClick={resetSearch} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base">
          ← Back to Search
        </button>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((bus) => (
            <div key={bus.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">{bus.busNumber}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{bus.route.origin} → {bus.route.destination}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">${bus.price}</p>
                  <p className="text-xs sm:text-sm text-gray-500">per seat</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-xs sm:text-sm">
                    {new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-xs sm:text-sm">{bus.availableSeats}/{bus.totalSeats} seats available</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {bus.amenities.map((amenity, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleBusSelect(bus)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                Select Seats
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No buses found</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              No buses are available for this route on the selected date. Try different cities or dates.
            </p>
            <button
              onClick={resetSearch}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              Search Again
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSeatSelection = () => {
    if (!selectedBus) return null;

    const seatRows = Math.ceil(selectedBus.totalSeats / 4);

    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Select Seats</h2>
          <button onClick={() => setStep('results')} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base">
            ← Back to Results
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{selectedBus.busNumber}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{selectedBus.route.origin} → {selectedBus.route.destination}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {new Date(selectedBus.departureTime).toLocaleDateString()} at{' '}
              {new Date(selectedBus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="bg-gray-800 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base">Driver</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              {Array.from({ length: seatRows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex items-center justify-center space-x-2 sm:space-x-4">
                  {selectedBus.seatLayout?.slice(rowIndex * 4, rowIndex * 4 + 4).map((seat) => (
                    <button
                      key={seat.number}
                      onClick={() => seat.isAvailable && handleSeatToggle(seat.number)}
                      disabled={!seat.isAvailable}
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg border-2 text-xs sm:text-sm font-medium transition-colors ${
                        !seat.isAvailable
                          ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                          : selectedSeats.includes(seat.number)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white border border-gray-300 rounded mr-1 sm:mr-2"></div>
                Available
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 border border-blue-600 rounded mr-1 sm:mr-2"></div>
                Selected
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 border border-gray-300 rounded mr-1 sm:mr-2"></div>
                Occupied
              </span>
            </div>
            <div className="text-base sm:text-lg font-semibold">
              Total: ${selectedSeats.length * selectedBus.price}
            </div>
          </div>

          <button
            onClick={proceedToDetails}
            disabled={selectedSeats.length === 0}
            className="w-full px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
          >
            Continue to Passenger Details
          </button>
        </div>
      </div>
    );
  };

  const renderPassengerDetails = () => (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Passenger Details</h2>
        <button onClick={() => setStep('seats')} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base">
          ← Back to Seat Selection
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Booking Summary</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <p className="text-sm sm:text-base"><strong>Bus:</strong> {selectedBus?.busNumber}</p>
            <p className="text-sm sm:text-base"><strong>Route:</strong> {selectedBus?.route.origin} → {selectedBus?.route.destination}</p>
            <p className="text-sm sm:text-base"><strong>Date:</strong> {selectedBus && new Date(selectedBus.departureTime).toLocaleDateString()}</p>
            <p className="text-sm sm:text-base"><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
            <p className="text-sm sm:text-base"><strong>Total Price:</strong> ${selectedBus && selectedSeats.length * selectedBus.price}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">Passenger Information</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4">
            <p className="text-xs sm:text-sm text-yellow-800">
              <strong>Please fill in all passenger details:</strong><br/>
              • Full name (required)<br/>
              • Age (must be greater than 0)<br/>
              • Contact number (required)
            </p>
          </div>
          {passengers.map((passenger, index) => (
            <div key={index} className="border rounded-lg p-3 sm:p-4">
              <h4 className="font-medium mb-3 text-sm sm:text-base">Seat {selectedSeats[index]}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    passenger.name.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <input
                  type="number"
                  placeholder="Age *"
                  value={passenger.age || ''}
                  onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    passenger.age <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  min="1"
                  max="120"
                />
                <select
                  value={passenger.gender}
                  onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="tel"
                  placeholder="Contact Number *"
                  value={passenger.contactNumber}
                  onChange={(e) => handlePassengerChange(index, 'contactNumber', e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    passenger.contactNumber.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="mt-4 sm:mt-6 w-full px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base"
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Booking Confirmed!</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Payment Information</h3>
          <p className="text-blue-700 text-xs sm:text-sm">
            <strong>Cash Payment Required:</strong> Please pay the full amount in cash to the bus conductor during your journey.
          </p>
          <p className="text-blue-600 text-xs sm:text-sm mt-2">
            Please arrive at the boarding point 15 minutes before departure with exact cash payment.
          </p>
        </div>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Your bus tickets have been successfully booked. You will receive a confirmation email shortly.
        </p>
        <button
          onClick={resetSearch}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
        >
          Book Another Trip
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {step === 'search' && renderSearchForm()}
      {step === 'results' && renderSearchResults()}
      {step === 'seats' && renderSeatSelection()}
      {step === 'details' && renderPassengerDetails()}
      {step === 'confirmation' && renderConfirmation()}
    </div>
  );
};

export default BusSearch;
