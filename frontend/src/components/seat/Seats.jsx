import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GrPrevious } from "react-icons/gr";
import { FaPen } from "react-icons/fa";
import SeatsModal from "../movieShow/SeatsModal";
import { ToastContainer, toast } from "react-toastify";
import PayPopup from "./PayPopup";

const SeatBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [seatsInfo, setSeatsInfo] = useState({ seats: "", category: "", date: '' });
  const { movieTitle,selectedDate,certification,selectedShowtime,seats,selectedLanguage,selectedFormat,theaterName, theaterLocation, movieId, category } = location.state || {};
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const ticketPrices = { Silver: 100, Gold: 200, Premium: 350 };
  const selectedTicketPrice = ticketPrices[category] || ticketPrices.Silver;
  // Function to handle seat selection confirmation
  const handleSeatsConfirm = (selection) => {setSeatsInfo(selection);setSelectedSeats([]);};
  const handleModalClose = () => setShowModal(false);
  const handleModalOpen = () => setShowModal(true);
  // Helper function to format date and Determine if the date is "Today"
  const formatDate = (date) => { const options = { day: "2-digit", month: "short" }; return new Date(date).toLocaleDateString("en-US", options); };
  const getDateLabel = (date) => {
    const today = new Date(); const inputDate = new Date(date);
    return inputDate.toDateString() === today.toDateString()
      ? `Today, ${formatDate(date)}` : `${formatDate(date)}`;
  };
  const formattedDate = selectedDate ? getDateLabel(selectedDate) : "";
  const initialSeatsConfig = {
    N: [1, 19, [10, 12]], 
    M: [1, 19, []], 
    L: [1, 19, [1]], 
    K: [1, 19, []], 
    J: [1, 19, []], 
    I: [1, 19, [10, 14, 12]], 
    H: [1, 19, []],
    G: [1, 19, []], 
    F: [1, 19, []], 
    E: [1, 19, [8, 9, 10, 11, 12]], 
    D: [1, 19, []], 
    C: [1, 19, []], B: [1, 19, []], A: [1, 19, [1]],
  };
  const toggleSeatSelection = (row, seatNumber) => {
    const seatId = `${row}${seatNumber}`; // Create a unique seat ID (e.g., "A1")
    setSelectedSeats((prevSeats) => {
      const maxSeats = seatsInfo && seatsInfo.seats ? parseInt(seatsInfo.seats) : seats; // Get the seat selection limit
      if (prevSeats.includes(seatId)) { return []; } // If the clicked seat is already selected, reset the selection
      const newSelectedSeats = []; // Start auto-selecting seats
      let seatsRemaining = maxSeats; // Seats left to select
      let startFromCurrentRow = false; // Flag to indicate if the current row is being processed
      for (const currentRow of Object.keys(initialSeatsConfig)) {
        const [start, end, unavailableSeats] = initialSeatsConfig[currentRow];// Iterate through rows
        if (currentRow === row) { startFromCurrentRow = true; } // If we are in the clicked row, begin from the clicked seat onward
        if (!startFromCurrentRow) { continue; } // If not in the row to start selection, skip the row
        for (let seat = start; seat <= end; seat++) {
          const currentSeatId = `${currentRow}${seat}`; // Iterate through the seats in the current row
          if (unavailableSeats.includes(seat)) { continue; } // Skip unavailable seats
          if (currentRow === row && seat < seatNumber) { continue; } // For the clicked row, only consider seats from the clicked seat onward
          newSelectedSeats.push(currentSeatId); seatsRemaining--; // Add the seat to the selection
          if (seatsRemaining === 0) { return newSelectedSeats; } // Stop selecting once we reach the required number of seats
        }
      }
      return newSelectedSeats; // Return all selected seats (may be less than requested if unavailable)
    });
  };
  const categories = { premium: ['N', 'M', 'L', 'K'], vip: ['J', 'I', 'H', 'G', 'F'], Silver: ['D', 'C', 'B', 'A'], };
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
    if (selectedSeats.length === 0) {
      alert(`Processing selected seats: ${selectedSeats.join(", ")}`);
      return;
    }
    const totalPrice = selectedSeats.length * selectedTicketPrice;
    navigate('/bookingSummary', {
      state: { movieTitle, selectedDate, certification,selectedFormat,selectedLanguage, selectedShowtime,seatsInfo, theaterName, theaterLocation, selectedSeats,categories, totalPrice, ticketPrices: { Standard: 100, VIP: 200, Premium: 350 }, movieId }
    });
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-between border-bottom p-3 bg-white">
        <GrPrevious className="text-secondary fs-4 cursor-pointer" onClick={() => navigate(-1)} />
        <div className="flex-grow-1 ms-3">
          <div className="d-flex flex-wrap gap-2">
            <h6 className="fs-5 fw-bold text-dark d-flex align-items-center justify-content-center ">{movieTitle} </h6>
            <button id="badge" style={{ width: '25px', height: '25px' }} className="btn border-secondary rounded-circle d-flex align-items-center justify-content-center "> <small className="badge text-secondary">{certification}</small> </button>
          </div>
          <p className="m-0 text-muted fw-bold">{theaterName} , {theaterLocation} | {formattedDate},{selectedShowtime}</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center me-3" onClick={handleModalOpen}>
          {seatsInfo && seatsInfo.seats ? `${seatsInfo.seats} Tickets` : `${seats} Tickets`}<FaPen className="ms-2" />
        </button>
      </div>
      <div><button>{}</button></div>
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
                    <div className="d-flex justify-content-center align-items-center gap-5">
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
                      <div className="d-flex flex-wrap gap-2 justify-content-start">
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
        {selectedSeats.length > 0 ? (<div className="text-center p-2">
          <button className="btn btn-danger btn-md px-5 fs-5" onClick={handleShow}>Pay Rs.{selectedSeats.reduce((total, seat) => {
            const row = seat[0];
            let price = ticketPrices.Silver; // Default to Silver price
            if (['F', 'G', 'H', 'I', 'J'].includes(row)) { price = ticketPrices.Gold; }
            else if (['K', 'L', 'M', 'N'].includes(row)) { price = ticketPrices.Premium; }
            return total + price;
          }, 0)}</button></div>)
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


