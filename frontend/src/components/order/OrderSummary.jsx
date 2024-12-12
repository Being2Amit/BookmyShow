import { useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import axios from "axios";
function OrderSummary() {
  const location = useLocation();
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
  const formatShowtime = (time) => {
    const [hourMinute, meridian] = time.split(" ");
    const [hour, minute] = hourMinute.split(":");
    const formattedHour = hour.length === 1 ? `0${hour}` : hour.replace(/^0/, "");
    return `${formattedHour}:${minute} ${meridian}`;
  };
  const saveBooking = async (data) => {
    //console.log("Booking saved", data);
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

  return (
    <div className="order-summary mt-5 container d-flex justify-content-center align-items-center">
      <div className="card col-md-8 col-lg-6 p-3 bg-light">
        <h5 className="card-title text-uppercase text-danger text-center">Order Summary</h5>
        <div className="card-body">
          <p className="d-flex justify-content-between align-items-center mb-1">
            <strong>{Data.movieTitle} ({Data.selectedLanguage}) ({Data.certification})</strong>
            <strong className="text-muted">{Data.selectedSeats.length} {Data.selectedSeats.length > 1 ? "Tickets" : "Ticket"}</strong>
          </p>
          <p className="text-muted mb-1">{Data.selectedLanguage}, {Data.selectedFormat}</p>
          <p className="text-muted mb-1">{Data.theaterName}: {Data.theaterLocation} ({Data.screenName})</p>
          {Object.entries(groupedSeats).map(([category, seats], index) => {
            if (seats.length > 0) {
              return (<p className="text-muted mb-1" key={index}><strong>{category.charAt(0).toUpperCase() + category.slice(1)} - {seats.join(", ")}</strong></p>);
            } return null;
          })}
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 text-muted"><strong>{formattedDate}</strong></p>
            <p className="mb-0 text-muted">{formatShowtime(Data.selectedShowtime)}</p>
          </div>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0"><strong>Payment ID:</strong></p>
            <p className="mb-0 text-muted">{Data.paymentId.replace("pay_", "")}</p>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <p className="mb-1"><strong>Sub Total:</strong></p>
            <p className="mb-1">Rs. {Data.totalSeatsPrice}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">+ Convenience fees:</p>
            <p className="mb-1">Rs. {Data.convenienceFee}</p>
          </div>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0"><strong>Amount Payable:</strong></p>
            <p className="mb-0 text-muted"><strong>Rs. {Data.totalAmount}</strong></p>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default OrderSummary;