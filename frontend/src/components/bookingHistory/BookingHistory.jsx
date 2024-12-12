import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from "qrcode.react";

const BookingHistory = () => {
  const [previousBookings, setPreviousBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // Default to 'All Bookings'
  const [posters, setPosters] = useState({}); // To store poster URLs by movie title
  const categories = { PREMIUM: ['N', 'M', 'L', 'K'], GOLD: ['J', 'I', 'H', 'G', 'F'], SILVER: ['D', 'C', 'B', 'A'], };
  const placeholderPoster = "https://via.placeholder.com/200x300?text=No+Image+Available";

  useEffect(() => {
    const fetchBookings = async () => {
      try { const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage
        const response = await axios.get('http://localhost:5000/bookings', 
        { headers: { Authorization: `Bearer ${token}` },});
        const allBookingsData = response.data.bookings;
        const successfulBookings = allBookingsData.filter(booking => booking.status !== 'failed');
        setAllBookings(successfulBookings);
        setPreviousBookings(successfulBookings.filter(booking => new Date(booking.selectedDate) < new Date()));
        setUpcomingBookings(successfulBookings.filter(booking => new Date(booking.selectedDate) >= new Date()));
        fetchPosters(successfulBookings);
      } catch (error) {console.error('Error fetching bookings:', error);
      } finally {setLoading(false);}
    };
    const fetchPosters = async (bookings) => {
      const apiKey = '41c953dc7d1c21d27df7b693e9740a3c';
      const newPosters = {};
      const posterPromises = bookings.map(async (booking) => {
        const title = booking.movieTitle;
        if (posters[title]) return;
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`);
          const movies = response.data.results;
          if (movies.length > 0) {
            const latestMovie = movies.reduce((latest, current) => {
              const latestDate = new Date(latest.release_date || "1900-01-01");
              const currentDate = new Date(current.release_date || "1900-01-01");
              return currentDate > latestDate ? current : latest;
            });newPosters[title] = `https://image.tmdb.org/t/p/w500${latestMovie.poster_path}`;
          }
        } catch (error) {console.error(`Error fetching poster for ${title}:`, error);}
      });
      await Promise.all(posterPromises);
      setPosters((prev) => ({ ...prev, ...newPosters }));
    };
    fetchBookings();}, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatShowtime = (time) => {
    const [hour, minute] = time.split(':');
    const parsedHour = parseInt(hour, 10);
    const isAM = parsedHour < 12;
    const formattedHour = parsedHour % 12 === 0 ? 12 : parsedHour % 12;
    const formattedMinute = minute.length === 1 ? `0${minute}` : minute;
    const meridian = isAM ? 'AM' : 'PM';
    return `${formattedHour < 10 ? `0${formattedHour}` : formattedHour}:${formattedMinute} ${meridian}`;
  };

  const groupSeatsByCategory = (seats) => {
    const grouped = { PREMIUM: [], GOLD: [], SILVER: [] };
    seats.forEach((seat) => {
      const seatRow = seat.charAt(0);
      for (const [category, rows] of Object.entries(categories)) {
        if (rows.includes(seatRow)) {
          grouped[category].push(seat);
          break;
        }
      }
    });
    return grouped;
  };

  const formatSeats = (groupedSeats) => {
    return Object.entries(groupedSeats)
      .filter(([, seats]) => seats.length > 0)
      .map(([category, seats]) => `${category} - ${seats.join(', ')}`)
      .join(' | ');
  };

  if (loading) {
    return <div className="text-center"><strong>Loading...</strong></div>;
  }

  let displayedBookings = [];
  if (activeTab === 'previous') {displayedBookings = previousBookings;} 
  else if (activeTab === 'upcoming') {displayedBookings = upcomingBookings;} 
  else {displayedBookings = allBookings;}

  return (
    <div className="container py-5">
      <h2 className="mb-4">Booking History</h2>
      <div className="mb-4">
        <button className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'} me-2`} onClick={() => setActiveTab('all')}>All Bookings</button>
        <button className={`btn ${activeTab === 'previous' ? 'btn-primary' : 'btn-secondary'} me-2`} onClick={() => setActiveTab('previous')}>Previous Bookings</button>
        <button className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'} me-2`} onClick={() => setActiveTab('upcoming')}>Upcoming Bookings</button>
      </div>
      <div className="row">
        {displayedBookings.length === 0 ? (
          <div className="text-center"><p>No bookings found in this category.</p></div>
        ) : (displayedBookings.map((booking) => (
          <div key={booking.bookingId} className="col-md-12 mb-4">
            <div className="card shadow-sm bg-light">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="text-start col-md-3">{posters[booking.movieTitle] ? (
                  <img className="img-fluid rounded" src={posters[booking.movieTitle]} alt={`Poster of ${booking.movieTitle}`} style={{ width: '200px', height: '200px', objectFit: 'center' }}  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite error loop
                    e.target.src = placeholderPoster; // Fallback to placeholder
                  }}/> ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#ccc' }}>
                      <span>Loading...</span>
                    </div>
                  )}
                </div>
                <div className='text-start col-md-4 px-5' style={{ flex: 1 }}>
                  <h5 className="card-title">{booking.movieTitle}</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="card-text mb-0">{booking.theater} , {booking.location}</p>
                    <p className="card-text mb-0">{booking.screen}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="card-text mb-0">{booking.selectedSeats.length} Ticket</p>
                    <p className="card-text mb-0">{formatSeats(groupSeatsByCategory(booking.selectedSeats))}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="card-text mb-0">{formatDate(booking.selectedDate)}</p>
                    <p className="card-text mb-0">{formatShowtime(booking.selectedShowtime)}</p>
                  </div>
                  <hr style={{ borderTop: "1px dashed #000", margin: "3px 0" }} />
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="card-text mb-0">Ticket Price <strong className='px-5'>:</strong></p>
                    <p className="mb-0 text-muted">RS. {booking.totalSeatsPrice}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">Convenience fees<strong className='px-1'> : </strong></p>
                    <p className="mb-1">+ Rs. {booking.convenienceFee}</p>
                  </div>
                  <hr style={{ borderTop: "1px dashed #000", margin: "3px 0" }} />
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0"><strong>Amount Payable :</strong></p>
                    <p className="mb-0 text-muted"><strong>Rs. {booking.totalAmount}</strong></p>
                  </div>
                  <hr style={{ borderTop: "1px dashed #000", margin: "3px 0" }} />
                </div>
                <div className="QR col-md-3 text-end" style={{ borderLeft: "1px dashed gray" , position: "relative"}}>
                  <div className="d-flex flex-column align-items-center justify-content-center text-center mt-5">
                    <QRCodeCanvas value={JSON.stringify({
                      bookingId: booking.bookingId, movieTitle: booking.movieTitle,date: booking.selectedDate,
                      seats: booking.selectedSeats, amount: booking.totalAmount,})} size={95} />
                    <div className="d-flex flex-column align-items-center mt-3">
                      <p className="badge text-muted fs-6 mb-2">Booking ID</p>
                      <p className="badge bg-dark">{booking.bookingId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
      <style>
        {`.QR::before,.QR::after {content: '';position: absolute;width: 20px;height: 20px;background-color:white;
            border-radius: 50%;border: 1px solid #ccc;left: -10px;}
          .QR::before {top: -20px; border-top: 1px solid white;}
          .QR::after {bottom: -20px transform: translateY(-50%) ; border-bottom: 1px solid white;}
        `}
      </style>
    </div>
  );
};

export default BookingHistory;