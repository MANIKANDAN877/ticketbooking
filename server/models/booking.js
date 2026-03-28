const { v4: uuidv4 } = require('uuid');

class Booking {
  constructor(busId, userId, passengerDetails, seatNumbers, totalPrice) {
    this.id = uuidv4();
    this.busId = busId;
    this.userId = userId;
    this.passengerDetails = passengerDetails;
    this.seatNumbers = seatNumbers;
    this.totalPrice = totalPrice;
    this.bookingTime = new Date().toISOString();
    this.status = 'confirmed';
    this.paymentStatus = 'paid';
  }

  static createFromRequest(busId, userId, passengers, seats, pricePerSeat) {
    const passengerDetails = passengers.map(p => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      contactNumber: p.contactNumber
    }));

    return new Booking(
      busId,
      userId,
      passengerDetails,
      seats,
      seats.length * pricePerSeat
    );
  }

  cancel() {
    this.status = 'cancelled';
    this.cancelledTime = new Date().toISOString();
  }

  getSummary() {
    return {
      id: this.id,
      busId: this.busId,
      seatNumbers: this.seatNumbers,
      totalPrice: this.totalPrice,
      status: this.status,
      bookingTime: this.bookingTime,
      passengerCount: this.passengerDetails.length
    };
  }
}

module.exports = Booking;
