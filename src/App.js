import React, { useState } from 'react';

const FacilityBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  const facilities = [
    {
      name: 'Clubhouse',
      slots: [
        { startTime: '10:00', endTime: '16:00', price: 100 },
        { startTime: '16:00', endTime: '22:00', price: 600 },
      ],
    },
    {
      name: 'Tennis Court',
      slots: [{ startTime: '00:00', endTime: '23:59', price: 50 }],
    },
  ];

  const handleBooking = () => {
    // Validate inputs (e.g., facility, startTime, endTime)
    if (!selectedFacility || !selectedStartTime || !selectedEndTime) {
      alert('Please fill in all the required fields.');
      return;
    }

    const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
    const [endHour, endMinute] = selectedEndTime.split(':').map(Number);

    // Check if the selected times are valid
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      alert('Invalid time range. End time should be after start time.');
      return;
    }

    // Find the selected facility's object
    const selectedFacilityObj = facilities.find((f) => f.name === selectedFacility);

    // Find the corresponding slot for the selected time range
    const selectedSlot = selectedFacilityObj.slots.find((slot) => {
      const [slotStartHour, slotStartMinute] = slot.startTime.split(':').map(Number);
      const [slotEndHour, slotEndMinute] = slot.endTime.split(':').map(Number);

      // Check if the selected time range is within the slot's time range
      return (
        (startHour >= slotStartHour && startHour < slotEndHour) ||
        (endHour > slotStartHour && endHour <= slotEndHour)
      );
    });

    if (!selectedSlot) {
      alert('Invalid time slot for the selected facility.');
      return;
    }

    // Calculate the time range for the selected time
    const selectedDuration = (endHour - startHour) * 60 + (endMinute - startMinute);

    // Calculate the amount for this slot per hour
    const selectedSlotDuration = (selectedSlot.price / 60) * selectedDuration;

    const newBooking = {
      facility: selectedFacility,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      totalCost: selectedSlotDuration,
    };

    setBookings([...bookings, newBooking]);

  
    setShowModal(false);
  };

  return (
    <div className="container">
    <h2>Facility Booking</h2>
    
    {facilities.map((facility) => (
      <div key={facility.name} className="facility-container">
        <h3>{facility.name}</h3>
        <table>
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {facility.slots.map((slot, index) => (
              <tr key={index}>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
                <td>Rs. {slot.price}/hour</td>
                <td>
                  <button
                    className="book-button"
                    onClick={() => {
                      setSelectedFacility(facility.name);
                      setShowModal(true);
                    }}
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}

   
    {showModal && (
      <div className="modal-container">
        <div className="modal-content">
          <h2>Book Facility</h2>
          <p>Selected Facility: {selectedFacility}</p>
          <label>
            Start Time:
            <input
              type="time"
              value={selectedStartTime}
              onChange={(e) => setSelectedStartTime(e.target.value)}
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={selectedEndTime}
              onChange={(e) => setSelectedEndTime(e.target.value)}
            />
          </label>
          <button className="book-now" onClick={handleBooking}>Book Now</button>
          <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </div>
    )}

    <h2>Bookings</h2>
    
    <table className="bookings-table">
      <thead>
        <tr>
          <th>Facility</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking, index) => (
          <tr key={index}>
            <td>{booking.facility}</td>
            <td>{booking.startTime}</td>
            <td>{booking.endTime}</td>
            <td>Rs. {booking.totalCost.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};
export default FacilityBooking;
