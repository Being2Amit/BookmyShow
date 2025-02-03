import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GrPrevious } from "react-icons/gr";
import { FaPen } from "react-icons/fa";
import SeatsModal from "../movieShow/SeatsModal";
import { ToastContainer, toast } from "react-toastify";
import PayPopup from "./PayPopup";

function SeatBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [seatsInfo, setSeatsInfo] = useState({ seats: "", category: "", date: '' });
  const { movieTitle, selectedDate, certification, selectedShowtime, seats, selectedLanguage, selectedFormat, theaterName, theaterLocation, movieId, category } = location.state || {};
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const ticketPrices = { Silver: 100, Gold: 200, Premium: 350 };
  const [manualSelection, setManualSelection] = useState({active: false,remaining: 0,row: null,});
  const selectedTicketPrice = ticketPrices[category] || ticketPrices.Silver;
  const sessionTimeout = 10* 60 * 1000; // 10 minutes in milliseconds
  
  useEffect(() => {
    // Set up a timeout to navigate back when session expires
    const timer = setTimeout(() => {
      toast.error("Session Expired. Redirecting to Movie Show...");
      setTimeout(() => navigate(-1), 2000); // Navigate back to the movie show page
    }, sessionTimeout);
    
    // Cleanup the timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Function to handle seat selection confirmation
  const handleSeatsConfirm = (selection) => {setSeatsInfo(selection); setSelectedSeats([]); };
  const handleModalClose = () => setShowModal(false);
  const handleModalOpen = () => setShowModal(true);
  // Helper function to format date and Determine if the date is "Today"
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const getDateLabel = (date) => {
    const today = new Date(); const inputDate = new Date(date);
    return inputDate.toDateString() === today.toDateString()
      ? `Today, ${formatDate(date)}` : `${formatDate(date)}`;
  };
  const formattedDate = selectedDate ? getDateLabel(selectedDate) : "";
  const initialSeatsConfig = {
    N: [1, 19, [10, 12]], M: [1, 19, []], L: [1, 19, [1]], K: [1, 19, []], J: [1, 19, []],
    I: [1, 19, [10, 12]], H: [1, 19, []], G: [1, 19, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18]], 
    F: [1, 19, [1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 16, 18]], E: [1, 19, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18]],
    D: [1, 19, []], C: [1, 19, []], B: [1, 19, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18]], A: [1, 19, [1]],
  };
  // Utility function to get available seats in a row.
  const getAvailableSeatsInRow = (row) => {
    const [start, end, unavailableSeats] = initialSeatsConfig[row];
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(
      (seat) => !unavailableSeats.includes(seat)
    );
  };
  // Function to toggle seat selection
  const toggleSeatSelection = (row, seatNumber) => {
    const seatId = `${row}${seatNumber}`;
    setSelectedSeats((prevSeats) => {
      const maxSeats = seatsInfo && seatsInfo.seats ? parseInt(seatsInfo.seats) : seats;
      if (prevSeats.includes(seatId)) {
        return prevSeats.filter((seat) => seat !== seatId); // Deselect if the seat is already selected.
      }
      // Handle manual seat selection logic
      if (manualSelection.active) {
        const updatedSeats = [...prevSeats, seatId];
        const remainingSeats = maxSeats - updatedSeats.length;
        if (remainingSeats < 0) {// If the user exceeds the limit, reset the previous selection.
          setManualSelection({ active: true, remaining: maxSeats, row });
          return [seatId];
        }if (remainingSeats === 0) {
          return updatedSeats;
        }// Update the remaining count for manual selection.
        setManualSelection({ ...manualSelection, remaining: remainingSeats });
        return updatedSeats;
      }// Automatic seat selection logic.
      const newSelectedSeats = [];
      let seatsRemaining = maxSeats;
      const selectSeatsInRow = (row, clickedSeat) => {
        const availableSeats = getAvailableSeatsInRow(row);
        const forwardSeats = availableSeats.filter((seat) => seat >= clickedSeat);
        const backwardSeats = availableSeats.filter((seat) => seat < clickedSeat).reverse();
        for (const seat of [...forwardSeats, ...backwardSeats]) {
          const seatId = `${row}${seat}`;
          if (!newSelectedSeats.includes(seatId)) {
            newSelectedSeats.push(seatId);
            seatsRemaining--;
            if (seatsRemaining === 0) return true;
          }
        }return false;
      };
      if (!selectSeatsInRow(row, seatNumber)) {
        triggerManualSelectionPopup(row, maxSeats - newSelectedSeats.length);
        return prevSeats;
      }return newSelectedSeats;
    });
    
  };
  // Function to trigger the manual seat selection popup.
  const triggerManualSelectionPopup = (row, requiredSeats) => {
    const availableSeats = getAvailableSeatsInRow(row);
    setManualSelection({ active: true, remaining: requiredSeats, row });
    showManualSelectionModal(row, requiredSeats);
  };
  // function to show manual selection modal (UI Implementation Placeholder).
  const showManualSelectionModal = (row, remainingSeats) => {
    toast.warn(`Please select Seats Manually `);
  };
  const categories = { premium: ['N', 'M', 'L', 'K'], vip: ['J', 'I', 'H', 'G', 'F'], Silver: ['E', 'D', 'C', 'B', 'A'], };
  const categoryTitles = { premium: '350 Premium', vip: '200 Gold', Silver: '100 Silver', };
  const processedSeatLayout = Object.entries(categories).map(([category, rows]) => {
    return {
      title: categoryTitles[category], rows: rows.map((row) => {
        const [start, end, unavailableSeats] = initialSeatsConfig[row];
        const seats = Array.from({ length: end }, (_, index) => index + 1);
        return {
          row, unavailableSeats,
          leftSeats: seats.slice(0, Math.ceil(seats.length / 2)),
          rightSeats: seats.slice(Math.ceil(seats.length / 2)),
        };
      }),
    };
  });
  const handleProcess = () => {
    const maxSeats = seatsInfo && seatsInfo.seats ? parseInt(seatsInfo.seats) : seats;
    // Check if the number of selected seats is less than the max number of seats
    if (selectedSeats.length < maxSeats) {
      // If seats are not selected fully, show a warning and prevent proceeding to the payment
      toast.warn(`You need to select ${maxSeats - selectedSeats.length} more seat(s) to continue.`);
      return;
    }
    if (selectedSeats.length === 0) {
      toast.warn(`Processing selected seats: ${selectedSeats.join(", ")}`);
      return;
    }
    if (selectedSeats.length === 0) {
      toast.warn(`Processing selected seats: ${selectedSeats.join(", ")}`);
      return;
    }
    const totalPrice = selectedSeats.length * selectedTicketPrice;
    navigate('/bookingSummary', {
      replace: true,
      state: { movieTitle, selectedDate, certification, selectedFormat, selectedLanguage, selectedShowtime, seatsInfo, theaterName, theaterLocation, selectedSeats, categories, totalPrice, ticketPrices: { Standard: 100, VIP: 200, Premium: 350 }, movieId }
    });
  };
  
  return (
    <>
      <div className="d-flex align-items-center justify-content-between border-bottom p-3 bg-white">
        <GrPrevious className="text-secondary fs-4 cursor-pointer" onClick={() => navigate(-1)} />
        <div className="flex-grow-1 ms-3">
          <div className="d-flex flex-wrap gap-2">
            <h6 className="fs-5 fw-bold text-dark d-flex align-items-center justify-content-center ">{movieTitle} </h6>
            <button id="badge" style={{ width: '25px', height: '25px', cursor:'text' }} className="btn border-secondary rounded-circle d-flex align-items-center justify-content-center "> <small className="badge text-secondary">{certification}</small> </button>
          </div>
          <p className="m-0 text-muted fw-bold">{theaterName} , {theaterLocation} | {formattedDate},{selectedShowtime}</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center me-3" onClick={handleModalOpen}>
          {seatsInfo && seatsInfo.seats ? `${seatsInfo.seats} Tickets` : `${seats} Tickets`}<FaPen className="ms-2" />
        </button>
      </div>
      {/* Seat Layout */}
      <div className="container mt-4">
        <div className="seat-layout">
          {processedSeatLayout.map((category) => (
            <div key={category.title}>{/* Category Title */}
              <div className="row px-5">
                <div className="col-12 mb-2 text-muted">Rs.{category.title}</div>
              </div>
              {/* Rows under the category */}
              {category.rows.map(({ row, leftSeats, rightSeats, unavailableSeats }) => (
                <div className="row mb-2" key={row}>
                  <div className="col-12 d-flex flex-column align-items-center">
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <strong className="me-5 text-uppercase">{row}</strong>
                      {/* Left side seats */}
                      <div className="d-flex flex-wrap  justify-content-end">
                        {leftSeats.map((seatNumber) => {
                          const isUnavailable = unavailableSeats.includes(seatNumber);
                          const isSelected = selectedSeats.includes(`${row}${seatNumber}`);
                          return (<button key={seatNumber} className={`btn seat btn-outline-success me-1 d-flex justify-content-center align-items-center 
                            ${isUnavailable ? 'disabled' : ''} ${isSelected ? 'btn-success' : 'btn-light'}`}
                            onClick={() => !isUnavailable && toggleSeatSelection(row, seatNumber)} disabled={isUnavailable}>{seatNumber}</button>
                          );
                        })}
                      </div>
                      <div style={{ width: '10px' }}></div>{/* Space between left and right */}
                      {/* Right side seats */}
                      <div className="d-flex flex-wrap justify-content-start">
                        {rightSeats.map((seatNumber) => {
                          const isUnavailable = unavailableSeats.includes(seatNumber);
                          const isSelected = selectedSeats.includes(`${row}${seatNumber}`);
                          return (
                            <button key={seatNumber} className={`btn seat btn-outline-success me-1 d-flex justify-content-center align-items-center 
                              ${isUnavailable ? 'disabled' : ''} ${isSelected ? 'btn-success' : 'btn-light'}`}
                              onClick={() => !isUnavailable && toggleSeatSelection(row, seatNumber)} disabled={isUnavailable}>{seatNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {/* Screen Indicator */}
          <div className="screen-icon-container text-center mt-5 mb-5">
            <div className="screen-icon mx-auto border-outline-black"></div>
            <p className="text-muted mb-5">All eyes this way please!</p>
          </div>
        </div>
      </div>

      {/* Process Button */}
      <div className="card bg-light position-fixed bottom-0 start-0 w-100 text-center shadow">
        {selectedSeats.length > 0 ? (
          <div className="text-center p-2">
            <button className="btn btn-danger btn-md px-5 fs-5"
              onClick={() => selectedSeats.length < (seatsInfo && seatsInfo.seats ? parseInt(seatsInfo.seats) : seats)
                ? handleProcess() : handleShow() }>Pay Rs.{selectedSeats.reduce((total, seat) => {
                const row = seat[0];
                let price = ticketPrices.Silver; // Default to Silver price
                if (['F', 'G', 'H', 'I', 'J'].includes(row)) { price = ticketPrices.Gold; }
                else if (['K', 'L', 'M', 'N'].includes(row)) { price = ticketPrices.Premium; }
                return total + price;
              }, 0)}
            </button>
            
          </div>)
          : (<div className="col-12 d-flex justify-content-center gap-2 p-3">
            <span className="status-box available"></span><small>Available</small>
            <span className="status-box selected"></span><small>Selected</small>
            <span className="status-box sold"></span><small>Sold</small></div>
          )
        }
      </div>
      <style>{`
        .seat-layout {font-family: Arial, sans-serif;}
        .seat {width: 35px; height: 35px; text-align: center; line-height: 35px; font-size: 14px;}
        .btn-light {background-color: white;}
        .btn-success {background-color: #19a745;color: white;}
        .btn-outline-disabled {border: 1px solid #6c757d;}
        .screen-icon-container {display: flex;flex-direction: column;align-items: center;}
        .screen-icon { width: 80%; max-width: 600px; height: 70px; border-radius: 6px; border: 1px solid #d0e8ff;background: linear-gradient(to bottom, #e0f0ff, #c0e0ff);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6), -2px -2px 2px rgba(255, 255, 255, 0.8) inset,0 2px 4px rgba(0, 0, 0, 0.1) inset; transform: perspective(400px) rotateX(50deg);}
        .btn:disabled {cursor: not-allowed;background-color: gray; color: white;border-color: #dcdcdc;}
        .status-box {padding: 6px 9px; font-size: 14px; font-weight: bold; text-transform: uppercase; display: inline-block; margin: 0 5px; border-radius: 3px; }
        .available { background-color: white; border: 2px solid #19a745;color: white}
        .selected {background-color: #19a745; color: white;}
        .sold {background-color: #6c757d; color: white;}`}
      </style>
      <SeatsModal show={showModal} onClose={handleModalClose} onConfirm={handleSeatsConfirm} selectedDate={selectedDate} />
      <PayPopup showModal={show} handleClose={handleClose} handleProcess={handleProcess} />
      < ToastContainer />
    </>
  );
};
export default SeatBooking;