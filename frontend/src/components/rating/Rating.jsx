import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

function Rating({ show, onClose}) {
  const [selectedRating, setSelectedRating] = useState(0);

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (selectedRating > 0) {
      // alert(`Rating ${selectedRating} submitted for movie ID: ${movieId}`);
      onClose();
    } else {
      alert("Please select a rating before submitting!");
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rate the Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Select your rating:</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={30}
              onClick={() => handleStarClick(star)}
              color={star <= selectedRating ? "gold" : "gray"}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Rating;