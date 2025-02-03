import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

const SavedCards = () => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [cardToDelete, setCardToDelete] = useState(null);
  // Determine the card type based on card number
  const getCardType = (number) => {
    if (number.startsWith("4")) {
      return "Visa";
    } else if (number.startsWith("5") || number.startsWith("2")) {
      return "Mastercard";
    } else if (number.startsWith("6") || number.startsWith("8") || number.startsWith("9")) {
      return "Rupay";
    }
    return "Other";
  };
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getcards', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 200) {
          // Add card type dynamically based on card number
          const cardsWithType = response.data.cards.map(card => ({
            ...card,
            cardType: getCardType(card.cardNumber),
          }));
          setCards(cardsWithType);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error || 'No saved cards found.');
        } else {
          toast.error('Error: Failed to fetch saved cards or Unable to reach the server.');
        }
      }
    };
    fetchCards();
  }, []);
  // Function to delete card
  // Function to delete card
  const deleteCard = async (cardId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deletecard/${cardId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.status === 200) {
        // Remove the deleted card from the UI
        setCards(cards.filter(card => card.id !== cardId));
        toast.success('Card deleted successfully');
        setShowModal(false); // Close the modal after deletion
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || 'Failed to delete card.');
      } else {
        toast.error('Error: Unable to delete the card.');
      }
    }
  };
  // Open the modal and set the card to delete
  const handleCardClick = (card) => {
    setCardToDelete(card);
    setShowModal(true); // Show the modal
  };

  return (
    <>
      {cards.length === 0 ? (<p className="px-4 my-4">No cards saved. </p>) : (
        <div className="container">
        <h5 className="px-3 my-4">Card Details:</h5>
        <div className="row">
          {cards.map((card, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mx-3 mb-3 d-flex flex-wrap justify-content-center" onClick={() => handleCardClick(card)}>
              <div className="card text-white" style={{ width: "400px", height: "180px", borderRadius: "15px", position: "relative", background: "linear-gradient(15deg,rgb(2, 2, 2), #ff758c,rgb(126, 35, 245))rgb(236, 10, 10)", }}>
                {/* Chip */}
                <div className="position-absolute bg-warning" style={{ width: "30px", height: "30px", borderRadius: "5px", top: "20px", left: "20px" }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/9334/9334639.png" alt="chip" width="30px" height="30px" />
                </div>
                {/* Contactless Icon */}
                <div className="position-absolute" style={{ top: "20px", right: "100px", fontSize: "1rem" }}>
                  <strong>Bank Details</strong>
                </div>
                <div className="position-absolute" style={{ top: "20px", right: "20px", fontSize: "1.2rem", transform: "rotate(90deg)" }}>
                  <i className="fs-3 bi bi-wifi"></i>
                </div>
                <div className="mt-5 pt-3 px-3"><strong>Card Number</strong>
                  <p className="m-0" style={{ fontSize: "1.2rem" }}>**** **** **** {card.cardNumber.slice(-4)}</p>
                </div>
                <div className="position-absolute" style={{ bottom: "10px", left: "20px", fontSize: "0.9rem" }}>
                  <strong>Card Holder</strong><p className="m-0">{card.cardholderName}</p>
                </div>
                {/* Expiry Date */}
                <div className="position-absolute" style={{ bottom: "10px", right: "30px", fontSize: "0.9rem" }}>
                  <strong>Expiry</strong><p className="m-0">{card.expiryDate}</p>
                </div>
                {/* Card Type Icon */}
                <div className="position-absolute" style={{ bottom: "60px", right: "30px", fontSize: "0.9rem" }}>
                  <img className="img-fluid" alt={card.cardType} style={{ width: "50px", height: "50px", backgroundColor: 'transparent' }}
                    src={card.cardType === "Visa" ? "https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-512.png"
                      : card.cardType === "Mastercard" ? "https://static-00.iconduck.com/assets.00/mastercard-old-icon-512x307-k8uhnws0.png"
                      : card.cardType === "Rupay" ? "https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png"
                      : "https://ccbankonline.com/wp-content/uploads/2023/05/Universal_Contactless_Card_Symbol-blue.png"
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title >Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove card?</Modal.Body>
        <Modal.Footer  className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}> Cancel</Button>
          <Button variant="danger" onClick={() => {deleteCard(cardToDelete.id);}}> Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SavedCards;
