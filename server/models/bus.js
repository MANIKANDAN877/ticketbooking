const { v4: uuidv4 } = require('uuid');

class Bus {
  constructor(id, busNumber, route, departureTime, arrivalTime, price, totalSeats, amenities) {
    this.id = id || uuidv4();
    this.busNumber = busNumber;
    this.route = route;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.price = price;
    this.totalSeats = totalSeats;
    this.availableSeats = totalSeats;
    this.amenities = amenities || [];
    this.seatLayout = this.generateSeatLayout(totalSeats);
  }

  generateSeatLayout(totalSeats) {
    const layout = [];
    const rows = Math.ceil(totalSeats / 4);
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= 4; col++) {
        const seatNumber = `${row}${String.fromCharCode(64 + col)}`;
        if ((row - 1) * 4 + col <= totalSeats) {
          layout.push({
            number: seatNumber,
            isAvailable: true,
            type: col === 4 ? 'window' : col === 1 ? 'aisle' : 'regular'
          });
        }
      }
    }
    
    return layout;
  }

  bookSeats(seatNumbers) {
    const bookedSeats = [];
    const unavailableSeats = [];

    for (const seatNumber of seatNumbers) {
      const seat = this.seatLayout.find(s => s.number === seatNumber);
      if (seat && seat.isAvailable) {
        seat.isAvailable = false;
        bookedSeats.push(seatNumber);
        this.availableSeats--;
      } else {
        unavailableSeats.push(seatNumber);
      }
    }

    return { bookedSeats, unavailableSeats };
  }

  releaseSeats(seatNumbers) {
    for (const seatNumber of seatNumbers) {
      const seat = this.seatLayout.find(s => s.number === seatNumber);
      if (seat && !seat.isAvailable) {
        seat.isAvailable = true;
        this.availableSeats++;
      }
    }
  }
}

module.exports = Bus;
