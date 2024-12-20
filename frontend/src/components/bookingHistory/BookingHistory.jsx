import { useEffect, useState } from "react";
function BookingHistory () {
  const [bookings, setBookings] = useState([]);

  const fetchBookingHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <div className="card mt-4 p-3">
      <h4>Booking History</h4>
      {bookings.length === 0 ? (
        <p>No booking history available.</p>
      ) : (
        <ul className="list-group">
          {bookings.map((booking, index) => (
            <li key={index} className="list-group-item">
              <strong>Movie:</strong> {booking.movieTitle} <br />
              <strong>Date:</strong> {booking.date} <br />
              <strong>Seats:</strong> {booking.seats.join(', ')} <br />
              <button className="btn btn-outline-primary mt-2">View Ticket</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory