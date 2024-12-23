import { useLocation } from "react-router-dom";
import { useEffect,useState } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import axios from "axios";
function OrderSummary() {
  const location = useLocation();
  const [poster, setPoster] = useState("");
  const Data = location.state; // Retrieve passed data
  const categories = { premium: ['N', 'M', 'L', 'K'], vip: ['J', 'I', 'H', 'G', 'F'], Silver: ['D', 'C', 'B', 'A'], };
  const getCategory = (seat) => {// Function to determine category based on seat row
    const seatRow = seat.charAt(0); // Get the row (e.g., "M" from "M11")
    for (const [category, rows] of Object.entries(categories)) {// Check each category
      if (rows.includes(seatRow)) { return category; } // Return the category if the row matches
    } return 'Unknown'; // Default if no match is found
  };
  const groupSeatsByCategory = (seats) => {
    const grouped = { premium: [], vip: [], Silver: [] };// Grouping seats by their category
    seats.forEach((seat) => {
      const category = getCategory(seat);
      if (grouped[category]) { grouped[category].push(seat); } // Add seat to the corresponding category group
    }); return grouped;
  };
  const groupedSeats = groupSeatsByCategory(Data.selectedSeats);// Get the grouped seats
  // Helper function to format date and determine if the date is "Today"
  const formatDate = (date) => {
    const options = { weekday: "short", day: "2-digit", month: "short", year: "numeric", };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const getDateLabel = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    return inputDate.toDateString() === today.toDateString()
      ? `Today, ${formatDate(date)}` : formatDate(date);
  };
  const formattedDate = Data.selectedDate ? getDateLabel(Data.selectedDate) : "";
  const saveBooking = async (data) => {
    console.log("Booking saved", data);
    const bookingData = { movieTitle: Data.movieTitle,theater: Data.theaterName, Location: Data.theaterLocation, screen:Data.screenName,selectedSeats: Data.selectedSeats,selectedDate: Data.selectedDate,selectedShowtime: Data.selectedShowtime,
    totalSeatsPrice: Data.totalSeatsPrice,convenienceFee: Data.convenienceFee,totalAmount: Data.totalAmount,paymentId: Data.paymentId,}; // Payment ID to ensure uniqueness
    try {
      const response = await axios.post('http://localhost:5000/book', bookingData, {
        headers: {'Content-Type': 'application/json',Authorization: `Bearer ${localStorage.getItem('token')}`,}, // Include JWT token for authentication
      });//console.log(response);
      if (response.status === 201) {toast.success(`Booking saved! Booking ID: ${response.data.bookingId}`);} 
      else { toast.error(`Error: ${response.data.message}`);}
    } catch (error) {//console.error('Error saving booking:', error);
      toast.error(error.response?.data?.message || 'Failed to save booking. Please try again.');
    }
  };

  useEffect(() => {if (Data && Data.paymentId && !Data.isProcessed) {saveBooking(Data);Data.isProcessed = true;}}, [Data]);
  // Function to fetch poster using TMDB API
  const fetchPoster = async () => {
    const apiKey = "41c953dc7d1c21d27df7b693e9740a3c"; // TMDB API Key
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          Data.movieTitle
        )}`
      );
      const movies = response.data.results;
      if (movies.length > 0) {
        const latestMovie = movies.reduce((latest, current) => {
          const latestDate = new Date(latest.release_date || "1900-01-01");
          const currentDate = new Date(current.release_date || "1900-01-01");
          return currentDate > latestDate ? current : latest;
        });
        setPoster(`https://image.tmdb.org/t/p/w500${latestMovie.poster_path}`);
      }
    } catch (error) {
      console.error("Error fetching poster:", error);
    }
  };

  useEffect(() => {
    fetchPoster(); // Fetch poster when component mounts
  }, [Data.movieTitle]);
  return (
    <div className="order-summary mt-5 container d-flex justify-content-center align-items-center">
      <div className="card Order position-relative col-md-8 col-lg-6 p-3 bg-light">
        <h5 className="card-title text-uppercase text-danger text-center">Order Summary</h5>
        <div className="card-body">
        <div className=" row">
                <div className="col-md-3">
                  {poster && (
                    <img src={poster} alt={`${Data.movieTitle} Poster`} className="img-fluid mb-3"
                    style={{ borderRadius: "10px", width: '150px', height: '150px' }}/>
                  )}
                </div>
                <div className="col">
                  <p className="d-flex justify-content-between align-items-center mb-1">
                    <strong>{Data.movieTitle} ({Data.selectedLanguage}) ({Data.certification})</strong>&nbsp;
                    <span className="badge bg-secondary text-white">{Data.selectedSeats.length} {Data.selectedSeats.length > 1 ? "Tickets" : "Ticket"}</span>
                  </p>
                  <p className="text-muted mb-1">{Data.selectedLanguage}, {Data.selectedFormat}</p>
                  <p className="text-muted mb-1">{Data.theaterName}: {Data.theaterLocation} ({Data.screenName})</p>
                  {Object.entries(groupedSeats).map(([category, seats], index) => {
                    if (seats.length > 0) {
                      return (<p className="text-muted mb-1" key={index}>
                        {category.charAt(0).toUpperCase() + category.slice(1)} - {seats.join(", ")}</p>);
                    } return null;
                  })}
                  <div className="d-flex justify-content-between">
                    <p className="text-muted">{formattedDate} </p >
                    <p className="text-muted">{Data.selectedShowtime} </p>
                  </div>
                </div>
              </div>
          <hr style={{border:"1px dashed"}} />
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0"><strong>Payment ID:</strong></p>
            <p className="mb-0 text-muted">{Data.paymentId.replace("pay_", "")}</p>
          </div>
          <hr style={{border:"1px dashed"}} />
          <div className="d-flex justify-content-between">
            <p className="mb-1"><strong>Sub Total:</strong></p>
            <p className="mb-1">Rs. {Data.totalSeatsPrice}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Convenience fees:</p>
            <p className="mb-1">Rs. {Data.convenienceFee}</p>
          </div>
          <hr style={{border:"1px dashed"}} />
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0"><strong>Amount Payable:</strong></p>
            <p className="mb-0 text-muted"><strong>Rs. {Data.totalAmount}</strong></p>
          </div>
        </div>
      </div>
      <style>
        { `.Order::before, .Order::after {content: '';position: absolute;width: 20px;height: 20px;background-color: white;border-radius: 50%;border: 1px solid #ccc;top: 53%; transform: translateY(-50%);}
          .Order::before { left: -5px; border-left: 1px solid white; }
          .Order::after { right: -5px; border-right: 1px solid white; }
        `}
      </style>
      <ToastContainer/>
    </div>
  );
};

export default OrderSummary;