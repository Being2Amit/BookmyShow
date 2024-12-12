import React, { useState } from "react";
import { Modal, Button} from "react-bootstrap";

function SeatsModal({ show, onClose,onConfirm,selectedDate}) {
  const [selectedSeats, setSelectedSeats] = useState(2); // Default to 2 seats
  const [selectedCategory, setSelectedCategory] = useState("");
  // const seatCategories = [
  //   { name: "Balcony-2", price: 350, availability: "Almost Full" },
  //   { name: "Balcony-1", price: 350, availability: "Sold Out" },
  //   { name: "Dress Circle", price: 250, availability: "Almost Full" },
  //   { name: "Lower Class", price: 150, availability: "Available" },
  // ];
  const handleSeatCountChange = (count) => {setSelectedSeats(count);};
  const handleCategorySelection = (category) => {setSelectedCategory(category.name);};
  const handleConfirmSeats = () => {
    onConfirm({ seats: selectedSeats, category: selectedCategory, date: selectedDate });
    onClose();
  };
  
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Title className="text-center w-100 mt-3">How Many Seats?</Modal.Title>
      <Modal.Body>
        {/* Scooter Icon */}
        <div className="d-flex justify-content-center mb-4">
          <img src="https://img.freepik.com/premium-vector/vintage-scooter-vector-illustration-cartoon-style_938798-604.jpg"alt="Scooter"style={{ width: "80px", height: "auto" }}/>
        </div>
        {/* Seat Count Buttons */}
        <div className="d-flex justify-content-center mb-4">
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <button key={count} className={`btn rounded-circle me-2 ${
              selectedSeats === count ? "btn-danger " : "btn-outline-light text-muted" }`}
              style={{ width: "45px", height: "45px",fontSize: "16px",}}onClick={() => handleSeatCountChange(count)}>{count}
              </button>
            ))
          }
        </div>
        {/* Seat Categories */}
        {/* <div className="d-flex flex-wrap gap-1">
          {seatCategories.map((category) => (<div key={category.name} className=
            {`badge text-center flex-grow-1 ${selectedCategory === category.name
              ? "badge-light bg-danger" : "badge-secondary"}`} onClick={() => handleCategorySelection(category)} style={{ cursor: "pointer" }}>
            <div className="text-muted">{category.name}</div>
            <div className="text-muted p-2">Rs. {category.price}</div>
            <div className={`${category.availability === "Available" ? "text-success"
              : category.availability === "Almost Full" ? "text-warning"
              : category.availability === "Sold Out" ? "text-danger" : "text-muted"}`}>{category.availability}
            </div>
          </div>
          ))}
        </div> */}
      </Modal.Body>
      <Button variant="danger" className="mx-auto d-block text-center w-25 mb-3" onClick={handleConfirmSeats} >Select Seats</Button>
    </Modal>
  );
}

export default SeatsModal;