import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { Booking } from '../types';
import { Calendar, Users, DollarSign, X, Check, AlertCircle } from 'lucide-react';

interface BookingListProps {
  selectedBookingId?: string | null;
}

const BookingList: React.FC<BookingListProps> = ({ selectedBookingId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(selectedBookingId || null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedBookingId) {
      setExpandedBooking(selectedBookingId);
    }
  }, [selectedBookingId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userBookings = await bookingService.getUserBookings('user123'); // In a real app, this would come from authentication
      setBookings(userBookings);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const result = await bookingService.cancelBooking(bookingId);
      if (result.success) {
        // Update the booking in the list
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ));
        alert('Booking cancelled successfully');
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Bookings Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't made any bookings yet. Start by searching for buses.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search for Buses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    </span>
                    <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold">
                    {booking.busDetails?.route.origin} → {booking.busDetails?.route.destination}
                  </h3>
                  <p className="text-gray-600">{booking.busDetails?.busNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${booking.totalPrice}</p>
                  <p className="text-sm text-gray-500">Total Price</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    {formatDate(booking.busDetails?.departureTime || booking.bookingTime)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    {booking.passengerDetails ? booking.passengerDetails.length : 0} passengers
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    Seats: {booking.seatNumbers ? booking.seatNumbers.join(', ') : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Booked on {formatDate(booking.bookingTime)} at {formatTime(booking.bookingTime)}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {expandedBooking === booking.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>

            {expandedBooking === booking.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <h4 className="font-semibold mb-4">Booking Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Journey Information</h5>
                    <div className="space-y-2 text-sm">
                      <p><strong>Bus Number:</strong> {booking.busDetails?.busNumber}</p>
                      <p><strong>Route:</strong> {booking.busDetails?.route.origin} → {booking.busDetails?.route.destination}</p>
                      <p><strong>Departure:</strong> {booking.busDetails && new Date(booking.busDetails.departureTime).toLocaleString()}</p>
                      <p><strong>Arrival:</strong> {booking.busDetails && new Date(booking.busDetails.arrivalTime).toLocaleString()}</p>
                      <p><strong>Seats:</strong> {booking.seatNumbers ? booking.seatNumbers.join(', ') : 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Passenger Information</h5>
                    <div className="space-y-2">
                      {booking.passengerDetails && booking.passengerDetails.map((passenger, index) => (
                        <div key={index} className="text-sm bg-white p-3 rounded border">
                          <p><strong>{passenger.name}</strong> ({passenger.age} years, {passenger.gender})</p>
                          <p className="text-gray-600">Contact: {passenger.contactNumber}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {booking.busDetails?.amenities && booking.busDetails.amenities.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Bus Amenities</h5>
                    <div className="flex flex-wrap gap-2">
                      {booking.busDetails.amenities.map((amenity: string, index: number) => (
                        <span key={index} className="text-xs bg-white px-2 py-1 rounded border">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
