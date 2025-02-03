import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from "qrcode.react";

function BookingHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // Default to 'All Bookings'
  const [posters, setPosters] = useState({}); // To store poster URLs by movie title
  const moviesPerPage = 5;
  const categories = { PREMIUM: ['N', 'M', 'L', 'K'], GOLD: ['J', 'I', 'H', 'G', 'F'], SILVER: ['E', 'D', 'C', 'B', 'A'], };
  const placeholderPoster = "https://via.placeholder.com/200x300?text=No+Image+Available";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage
        const response = await axios.get('http://localhost:5000/bookings',
        { headers: { Authorization: `Bearer ${token}` }, });
        const allBookingsData = response.data.bookings;
        const successfulBookings = allBookingsData.filter(booking => booking.status !== 'failed');
        setAllBookings(successfulBookings);
        const currentDateTime = new Date();
        const convertTo24HourFormat = (time) => {
          const timeRegex = /^([0-9]{1,2}):([0-9]{2}) (AM|PM)$/;
          const match = time.match(timeRegex);
          if (!match) return null;
          let [, hour, minute, period] = match;
          hour = parseInt(hour, 10);
          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
          return `${String(hour).padStart(2, '0')}:${minute}`;
        };
        // Function to compare showtime with current time
        const compareShowtimeWithCurrent = (selectedDate, selectedShowtime) => {
          const selectedDateObj = new Date(selectedDate);
          const formattedShowtime = convertTo24HourFormat(selectedShowtime);
          if (!formattedShowtime) return false;
          const [hours, minutes] = formattedShowtime.split(':');
          selectedDateObj.setHours(hours, minutes, 0, 0); // Set the selected time to the selected date
          selectedDateObj.setHours(selectedDateObj.getHours() + 1);
          return selectedDateObj >= currentDateTime; // Check if the booking time is in the future
        };
        // Filter previous and upcoming bookings
        setAllBookings(successfulBookings.sort((a, b) => 
          new Date(b.selectedDate) - new Date(a.selectedDate) || 
          convertTo24HourFormat(b.selectedShowtime).localeCompare(convertTo24HourFormat(a.selectedShowtime))
        ));
        setPreviousBookings(successfulBookings
          .filter(booking => !compareShowtimeWithCurrent(booking.selectedDate, booking.selectedShowtime))
          .sort((a, b) => new Date(b.selectedDate) - new Date(a.selectedDate) || 
          convertTo24HourFormat(b.selectedShowtime).localeCompare(convertTo24HourFormat(a.selectedShowtime)))
        );
        
        setUpcomingBookings(successfulBookings
          .filter(booking => compareShowtimeWithCurrent(booking.selectedDate, booking.selectedShowtime))
          .sort((a, b) => new Date(a.selectedDate) - new Date(b.selectedDate) || 
          convertTo24HourFormat(a.selectedShowtime).localeCompare(convertTo24HourFormat(b.selectedShowtime)))
        );
        fetchPosters(successfulBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
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
              const latestDate = new Date(latest.release_date || "2000-01-01");
              const currentDate = new Date(current.release_date || "2000-01-01");
              return currentDate > latestDate ? current : latest;
            });
            newPosters[title] = `https://image.tmdb.org/t/p/w500${latestMovie.poster_path}`;
          }
        } catch (error) {
          console.error(`Error fetching poster for ${title}:`, error);
        }
      });
      await Promise.all(posterPromises);
      setPosters((prev) => ({ ...prev, ...newPosters }));
    };
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
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
  let totalPages = 0;
  if (activeTab === 'previous') {
    displayedBookings = [...previousBookings];
    totalPages = Math.ceil(previousBookings.length / moviesPerPage);
  } else if (activeTab === 'upcoming') {
    displayedBookings = [...upcomingBookings];
    totalPages = Math.ceil(upcomingBookings.length / moviesPerPage);
  } else {
    displayedBookings = [...allBookings].reverse();
    totalPages = Math.ceil(allBookings.length / moviesPerPage);
  }
  displayedBookings = displayedBookings.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to the first page when the tab changes
  };

  return (
    <div className="container px-3 py-3">
      <h2 className="mb-4">Booking History:</h2>
      <div className="d-flex flex-grow-1 gap-2 mb-3">
        <button className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('all')}>All Bookings</button>
        <button className={`btn ${activeTab === 'previous' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('previous')}>Previous Bookings</button>
        <button className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('upcoming')}>Upcoming Bookings</button>
      </div>
      <div className="row">
        {displayedBookings.length === 0 ? (
          <div className="text-center"><p>No bookings found in this category.</p></div>) : (
          displayedBookings.map((booking) => (
            <div key={booking.bookingId} className="mb-4">
              <div className="col-12 card shadow-sm bg-light">
                <div className="row">
                  <div className="col-md-3 col-sm-2 text-center">
                    <img className="img-fluid rounded" src={posters[booking.movieTitle] || placeholderPoster} alt={`Poster of ${booking.movieTitle}`} style={{ width: '100%', height: '246px', objectFit: 'center' }} />
                  </div>
                  <div className='col-md-6 col-sm-6 px-4'>
                    <h5 className="card-title mt-3">{booking.movieTitle}</h5>
                    <div className="d-flex col-12 justify-content-between">
                      <p className="col-md-6 mb-0">{booking.theater},{booking.location}</p>
                      <p className="col-md-6  text-end mb-0">{booking.screen}</p>
                    </div>
                    <div className="d-flex col-12 justify-content-between">
                      <p className="col-md-6 mb-0">{booking.selectedSeats.length} Ticket</p>
                      <p className="col-md-6 text-end mb-0">{formatSeats(groupSeatsByCategory(booking.selectedSeats))}</p>
                    </div>
                    <div className="d-flex col-12 justify-content-between">
                      <p className="col-md-6 mb-0">{formatDate(booking.selectedDate)}</p>
                      <p className="col-md-6 text-end mb-0">{booking.selectedShowtime}</p>
                    </div>
                    <hr style={{ borderTop: "1px dashed #000", margin: "3px 0" }} />
                    <div className="d-flex col-12 justify-content-between">
                      <p className="col-md-6 mb-0">Ticket Price</p><strong> : </strong>
                      <p className="col-md-6 text-end mb-0">RS. {booking.totalSeatsPrice}</p>
                    </div>
                    <div className="d-flex col-12 justify-content-between">
                      <p className="col-md-6 mb-1">Convenience fees</p><strong> : </strong>
                      <p className="col-md-6 text-end mb-0">+ Rs. {booking.convenienceFee}</p>
                    </div>
                    <hr style={{ borderTop: "1px dashed #000", margin: "3px 0" }} />
                    <div className="d-flex col-12 justify-content-between">
                      <p className="col-md-6 mb-0"><strong>Amount Payable </strong></p><strong> : </strong>
                      <p className="col-md-6 text-end mb-0"><strong>Rs. {booking.totalAmount}</strong></p>
                    </div>
                    <hr className="s" style={{ borderTop: "1px dashed #000", margin: "3px 0" }} />
                  </div>
                  <div className="QR col-md-3">
                    <div className="d-flex flex-column align-items-center mt-5">
                      <QRCodeCanvas value={JSON.stringify({
                        bookingId: booking.bookingId, movieTitle: booking.movieTitle, date: booking.selectedDate,
                        seats: booking.selectedSeats, amount: booking.totalAmount,
                      })} size={95} />
                      <div className="d-flex flex-column mt-3">
                        <p className="badge text-muted fs-6 mb-2">Booking ID</p>
                        <p className="badge bg-dark"><small className='text-truncate'>{booking.bookingId}</small></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div className="container">
          <button className="btn btn-outline-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}> Previous </button>
          <span className="mx-2 my-2">Page {currentPage} of {totalPages}</span>
          <button className="btn btn-outline-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}> Next </button>
        </div>
      </div>
      <style>
        {`.QR {position: relative; border-left: 1px dashed gray;}
          .QR::before,.QR::after {content: '';position: absolute;width: 20px;height: 20px;background-color:white;
            border-radius: 50%;border: 1px solid #ccc;left: -10px;}
          .QR::before {top: -3px; border-top: 1px solid white;}
          .QR::after {bottom:-5px transform: translateY(-50%) ; border-bottom: 1px solid white;}
          
           @media (max-width: 320px) { .QR {border-left: none } .QR::before, .QR::after {display: none;}
        `}
      </style>
    </div>
  );
};

export default BookingHistory;
