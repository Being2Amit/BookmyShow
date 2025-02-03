import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { GrPrevious } from "react-icons/gr";
import { toast } from 'react-toastify';

const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const { movieTitle, theaterName, selectedDate, selectedFormat, selectedShowtime, certification, selectedLanguage, theaterLocation, selectedSeats = [], ticketPrices, } = location.state || {};
  //Calculate price
  useEffect(() => {
    const totalSeatsPrice = selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat), 0);
    const fee = totalSeatsPrice * 0.1;
    const total = totalSeatsPrice + fee;
    setConvenienceFee(fee);
    setTotalAmount(total);
  }, [selectedSeats, ticketPrices]);
  // Check if the showtime has passed
  useEffect(() => {
    const checkShowtime = () => {
      const now = new Date();
      const showtimeDate = new Date(`${selectedDate} ${selectedShowtime}`);
      const bufferTime = 10 * 60 * 1000; // 10 minutes in milliseconds
      if (now > showtimeDate.getTime() + bufferTime) {
        setIsDisabled(true);
        toast.error("Movie Showtime has Expired. Redirecting to Home page...");
        setTimeout(() => navigate("/")); // Redirect after 3 seconds
      }
    };
    checkShowtime();
    const interval = setInterval(checkShowtime, 1000); // Check every minute
    return () => clearInterval(interval);
  }, [selectedDate, selectedShowtime, navigate]);

  const handleProceed = () => {
    // Prepare data to pass to the payment page
    const paymentData = {
      movieTitle, theaterName, theaterLocation, selectedDate, selectedShowtime, selectedSeats,
      screenName, selectedLanguage, selectedFormat, convenienceFee, certification, totalAmount, totalSeatsPrice,
    };
    // Navigate to the payment page with the state
    navigate("/payment", { state: paymentData });
  };
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Determine if the date is "Today"
  const getDateLabel = (date) => {
    const today = new Date(); const inputDate = new Date(date);
    return inputDate.toDateString() === today.toDateString()
      ? `Today, ${formatDate(date)}` : `${formatDate(date)}`;
  };
  const formattedDate = selectedDate ? getDateLabel(selectedDate) : "";
  // Function to calculate the seat price based on the row
  const getSeatPrice = (seat) => {
    const row = seat[0]; // The first character is the row letter (e.g., 'A', 'B', etc.)
    let price = ticketPrices.Standard; // Default price
    if (['F', 'G', 'H', 'I', 'J'].includes(row)) {
      price = ticketPrices.VIP; // VIP pricing for specific rows
    } else if (['K', 'L', 'M', 'N'].includes(row)) {
      price = ticketPrices.Premium; // Premium pricing for other rows
    }
    return price;
  };
  // Helper function to assign the screen based on showtime
  const getScreenForShowtime = (time) => {
    const [hours, minutes, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
    // Convert the given time (in "hh:mm AM/PM" format) into total minutes past midnight for easier comparison
    const timeInMinutes = (period.toUpperCase() === "PM" && hours !== "12" ? parseInt(hours) + 12 : parseInt(hours)) * 60 + parseInt(minutes);
    if (timeInMinutes >= 0 && timeInMinutes < 720) {
      return "Screen 01"; // Morning 12:00 AM - 11:59 AM
    } else if (timeInMinutes >= 720 && timeInMinutes < 960) {
      return "Screen 02"; // Afternoon 12:00 PM - 3:59 PM
    } else if (timeInMinutes >= 960 && timeInMinutes < 1140) {
      return "Screen 03"; // Evening 4:00 PM - 6:59 PM
    } else if (timeInMinutes >= 1140 && timeInMinutes <= 1439) {
      return "Screen 04"; // Night 7:00 PM - 11:59 PM
    }
    return "Unknown Screen"; // Fallback
  };
  const screenName = getScreenForShowtime(selectedShowtime);
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat), 0);
  };
  const totalSeatsPrice = calculateTotalPrice();
  const seatPrice = selectedSeats.length > 0 ? getSeatPrice(selectedSeats[0]) : 0;


  return (
    <>
      <div className="d-flex align-items-center justify-content-center border-bottom p-3 bg-white">
        <GrPrevious className="text-secondary fs-4 cursor-pointer" onClick={() => navigate(-1)} />
        <div className="flex-grow-1 ms-3">
          <div className="d-flex flex-wrap gap-2">
            <h6 className="fs-5 text-muted d-flex align-items-center justify-content-center ">{movieTitle}</h6>
            <button id="badge" style={{ width: '25px', height: '25px', cursor: 'text' }} className="btn border-secondary rounded-circle d-flex align-items-center justify-content-center">
              <small className="badge text-secondary">{certification}</small>
            </button>
          </div>
          <p className="text-muted fw-bold">{theaterName},{theaterLocation} | {formattedDate}, {selectedShowtime}</p>
        </div>
      </div>
      {/* Booking Summary Section */}
      <div className="container mt-3">
        <h4 className="mb-2 mx-2 text-danger">Booking Summary</h4>
        {/* Booking Details Ticket Fare and Payment Details */}
        <div className="card p-4 mb-4" style={{ backgroundColor: 'ButtonShadow' }}>
          <div className="d-flex justify-content-start mb-1">
            <div className='col-6'><strong>Screen</strong></div>
            :&nbsp; <span className="text-muted">{screenName}</span>
          </div>
          <div className="d-flex justify-content-start mb-1">
            <div className='col-6'><strong>Theater</strong></div>
            :&nbsp; <span className="text-muted"> {theaterName}, {theaterLocation}</span>
          </div>
          <div className="d-flex justify-content-start mb-1">
            <div className='col-6'><strong>Seats ({selectedSeats.length} tickets)</strong></div>
            :&nbsp; <span className="text-muted">{selectedSeats.join(', ')}</span>
          </div>
          <div className="d-flex justify-content-start mb-1">
            <div className='col-6'><strong>Ticket Fare (each)</strong></div>
            :&nbsp; <span className="text-muted">Rs. {seatPrice}</span>
          </div>
          <div className="d-flex justify-content-start mb-1">
            <div className='col-6'><strong>Subtotal</strong></div>
            :&nbsp; <span className="text-muted">Rs. {totalSeatsPrice}</span>
          </div>
          <div className="d-flex justify-content-start mb-1">
            <div className='col-6'><strong>Convenience Fee (10%)</strong></div>
            :&nbsp; <span className="text-muted">Rs. {convenienceFee.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-start mb-1">
            <div className='col-6'><strong>Amount Payable</strong></div>
            :&nbsp; <span className="text-muted">Rs. {(totalSeatsPrice + convenienceFee).toFixed(2)}</span>
          </div>
          {/* Proceed Button */}
          <div className="text-center">
            <small className='text-muted'>By proceeding, you agree to our Terms and Conditions.</small> <br />
            <button className="btn btn-danger btn-sm-100 mt-3 " disabled={isDisabled} onClick={handleProceed}>TOTAL: Rs.{(totalSeatsPrice + convenienceFee).toFixed(2)}&nbsp;Proceed</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default BookingSummary;

