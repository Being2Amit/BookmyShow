import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { GrPrevious } from "react-icons/gr";
const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { movieTitle, theaterName, selectedDate, selectedFormat,selectedShowtime,certification,selectedLanguage,theaterLocation, selectedSeats = [], ticketPrices,  } = location.state || {}; 
  //Calculate price
  useEffect(() => {
    const totalSeatsPrice = selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat), 0);
    const fee = totalSeatsPrice * 0.1;
    const total = totalSeatsPrice + fee;
    setConvenienceFee(fee);
    setTotalAmount(total);
  }, [selectedSeats, ticketPrices]);

  const handleProceed = () => {
    // Prepare data to pass to the payment page
    const paymentData = { movieTitle, theaterName, theaterLocation, selectedDate, selectedShowtime,selectedSeats,
      screenName,selectedLanguage,selectedFormat,convenienceFee,certification,totalAmount,totalSeatsPrice,
    };
    // Navigate to the payment page with the state
    navigate("/payment", { state: paymentData });
  };


  const formatDate = (date) => {const options = { day: "2-digit", month: "short" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Determine if the date is "Today"
  const getDateLabel = (date) => {const today = new Date();const inputDate = new Date(date);
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
      <div className="d-flex align-items-center justify-content-between border-bottom p-3 bg-white">
        <GrPrevious className="text-secondary fs-4 cursor-pointer" onClick={() => navigate(-1)}/>
        <div className="flex-grow-1 ms-3">
          <div className="d-flex flex-wrap gap-2">
            <h6 className="fs-5 text-dark d-flex align-items-center justify-content-center ">{movieTitle}</h6>
            <button id="badge" style={{ width: '25px', height: '25px' }} className="btn border-secondary rounded-circle d-flex align-items-center justify-content-center">
              <small className="badge text-secondary">{certification}</small>
            </button>
          </div>
          <p className="text-muted fw-bold">{theaterName},{theaterLocation} | {formattedDate}, {selectedShowtime}</p>
        </div>
      </div>
      {/* Booking Summary Section */}
      <div className="booking container mt-2">
        <h4 className="mb-2 mx-3 text-danger">Booking Summary</h4>
        {/* Booking Details Ticket Fare and Payment Details */}
        <div className="card p-3 mb-4" style={{backgroundColor:'ButtonShadow'}}>
          <div className="row">
            <div className="col-md-6 px-5">
              <p><strong>Screen</strong></p>
              <p><strong>Theater</strong> </p>
              <p><strong>Seats (for {selectedSeats.length} tickets)</strong> </p>
              <p><strong>Ticket Fare (each)</strong> </p>
              <p><strong>Subtotal</strong></p>
              <p><strong>Convenience Fee (10%)</strong> </p>
              <p><strong>Amount Payable</strong> </p>
            </div>
            <div className="col-md-6 text-start">
              <p><strong>: </strong>  {screenName}</p>
              <p><strong>: </strong>{theaterName} ,{theaterLocation}</p>
              <p> <strong>: </strong>{selectedSeats.join(', ')}</p>
              <p><strong>: </strong> Rs. {seatPrice}</p>
              <p><strong>: </strong> Rs. {totalSeatsPrice}</p>
              <p><strong>: </strong> Rs. {convenienceFee.toFixed(2)}</p>
              <p><strong>: </strong> Rs. {(totalSeatsPrice + convenienceFee).toFixed(2)}</p>
            </div>
            {/* Proceed Button */}
            <div className="text-center">
              <p className='badge text-muted m-0 p-0'>By proceeding, you agree to our Terms and Conditions.</p> <br />
              <button className="btn btn-danger btn-lg" onClick={handleProceed}>TOTAL: Rs.{(totalSeatsPrice + convenienceFee).toFixed(2)}&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Proceed</button>
            </div>
          </div>
        </div>       
      </div>
    </>
  );
};
export default BookingSummary;

