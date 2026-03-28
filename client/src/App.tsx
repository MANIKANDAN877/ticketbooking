import React from 'react';
import './App.css';
import BusSearch from './components/BusSearch';
import BookingList from './components/BookingList';
import { useState } from 'react';

function App() {
  const [activeView, setActiveView] = useState<'search' | 'bookings'>('search');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">🚌 BusBook</h1>
              <span className="text-xs sm:text-sm opacity-75">Your Journey Starts Here</span>
            </div>
            <nav className="flex space-x-2 sm:space-x-4 w-full sm:w-auto justify-center">
              <button
                onClick={() => setActiveView('search')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  activeView === 'search'
                    ? 'bg-white text-blue-600'
                    : 'hover:bg-blue-700'
                }`}
              >
                Search Buses
              </button>
              <button
                onClick={() => setActiveView('bookings')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  activeView === 'bookings'
                    ? 'bg-white text-blue-600'
                    : 'hover:bg-blue-700'
                }`}
              >
                My Bookings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {activeView === 'search' ? (
          <BusSearch onBookingComplete={(bookingId: string) => {
            setSelectedBooking(bookingId);
            setActiveView('bookings');
          }} />
        ) : (
          <BookingList selectedBookingId={selectedBooking} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-8 sm:mt-16">
        <div className="container mx-auto px-2 sm:px-4 text-center">
          <p className="text-sm sm:text-base">&copy; 2024 BusBook Platform. All rights reserved.</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Safe, reliable, and comfortable bus travel
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
