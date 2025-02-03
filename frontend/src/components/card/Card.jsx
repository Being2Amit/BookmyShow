import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import SavedCards from "../SavedCard/SavedCard";
const Card = () => {
  const [cards, setCards] = useState([]);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [cardType, setCardType] = useState(""); // To store card type dynamically

  // Card number validation (Luhn algorithm or simple length check can be added)
  const validateCardNumber = (number) => {
    const cleanedNumber = number.replace(/\s/g, ''); // Remove all spaces
    const regex = /^[0-9]{16}$/; // Valid card number length (13-19 digits)
    return regex.test(cleanedNumber);
  };
  // Expiry date validation (MM/YY format and not expired)
  const validateExpiryDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    if (!regex.test(date)) return false;
    const [month, year] = date.split("/").map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
    const currentYear = currentDate.getFullYear() % 100; // Last 2 digits of year
    return year > currentYear || (year === currentYear && month >= currentMonth);
  };
  // CVV validation (3 digits for Visa/MasterCard/rupay)
  const validateCvv = (cvv) => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
  };
  // Determine the card type based on card number
  const getCardType = (number) => {
    if (number.startsWith("4")) { return "Visa"; }
    else if (number.startsWith("5") || number.startsWith("2")) { return "Mastercard"; }
    else if (number.startsWith("6") || number.startsWith("8") || number.startsWith("9")) { return "Rupay"; }
    return "Other";
  };
  const handleExpiryDateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9/]/g, '');
    if (value.length === 2 && value.charAt(1) !== '/' && e.nativeEvent.inputType !== "deleteContentBackward") { value = value + '/'; }
    setExpiryDate(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the fields
    let formErrors = {};
    if (!name) formErrors.name = 'Please enter a valid cardholder name';
    if (!cardNumber || !validateCardNumber(cardNumber)) formErrors.cardNumber = 'Please enter a valid card number';
    if (!expiryDate || !validateExpiryDate(expiryDate)) formErrors.expiryDate = 'Please enter a valid expiry date';
    if (!cvv || !validateCvv(cvv)) formErrors.cvv = 'Please enter a 3 digit CVV';
    // If there are errors, set them and prevent submission
    if (Object.keys(formErrors).length > 0) { setErrors(formErrors); return; }
    // Prepare the card data for the request
    const cardData = { cardNumber, cardholderName: name, expiryDate, cvv };
    try {
      const response = await axios.post('http://localhost:5000/savecard', cardData, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`, },
      });
      if (response.status === 200) {
        toast.success('Card saved successfully!');
        setCards([...cards, { cardNumber, cardholderName: name, expiryDate, cardType }]);
        setCardNumber(''); setExpiryDate(''); setCvv(''); setName(''); setCardType('');
        setErrors({});
        setShowForm(false);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) { toast.error(error.response.data.error); }
        else if (error.response.status === 500) { toast.error('Server error. Please try again later.'); }
        else { toast.error('Please Login then try again.'); }
      }
      else { toast.error('Error: Unable to reach the server.'); }
    }
  };
  const showCardForm = () => { setShowForm(true); };
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
    setCardType(getCardType(value)); // Update card type dynamically as user types
  };

  // Dynamically set the background image based on the card type
  const getCardBackground = () => {
    switch (cardType) {
      case 'Visa':
        return 'url(https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-512.png)';
      case 'Mastercard':
        return 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCh6Wx6nJ-dsryg_GQMfYy7STmrwy7DtaaXw&s)';
      case 'Rupay':
        return 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_2sJUDYVBvs23wfC5pPsVPsBgxDZfCtW-ww&s)';
      default:
        return '';
    }
  };
  const handleCancel = () => {
    setShowForm(false);
  }
  return (
    <>
      <h5 className="m-4">Add Cards Information:</h5>
      {/* Initially show only the Add Card button */}
      {!showForm ? (
        <>
          <button onClick={showCardForm} className="btn btn-outline-danger mx-4">Add Card </button>
          < SavedCards />
        </>) : (
        <div className="card mx-4 bg-light">
          <h5 className="mx-2 px-2 mt-2">Add a new card</h5>
          <form onSubmit={handleSubmit} className="container">
            <div className="form-group mb-2">
              <input type="text" id="cardName" className="form-control" placeholder="Enter cardholder's name" value={name} onChange={(e) => setName(e.target.value.replace(/[^A-Za-z\s]/g, '').toUpperCase())}
                style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
              {errors.name && <small className="text-danger"><i class="bi bi-exclamation-circle"></i> {errors.name}</small>}
            </div>
            <div className="form-group mb-2">
              <input className="form-control" type="text" id="cardNumber" placeholder="Enter card number" value={cardNumber} maxLength={19} onChange={handleCardNumberChange}
                style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat', paddingRight: '60px', backgroundSize: '50px', backgroundImage: getCardBackground(), }}
              />
              {errors.cardNumber && <small className="text-danger"><i class="bi bi-exclamation-circle"></i> {errors.cardNumber}</small>}
            </div>
            <div className="form-group">
              <div className="d-flex gap-2">
                <input type="text" id="expiryDate" className="form-control" maxLength={5} placeholder="MM/YY" value={expiryDate} onChange={handleExpiryDateChange}
                  style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
                <input type="text" id="cvv" maxLength={3} className="form-control" placeholder="Enter CVV" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
              </div>
              <div className="d-flex gap-1">
                {errors.expiryDate && <small className="text-danger col-md-6"><i className="bi bi-exclamation-circle"></i> {errors.expiryDate}</small>}
                {errors.cvv && <small className="text-danger col-md-6"><i className="bi bi-exclamation-circle"></i> {errors.cvv}</small>}
              </div>
            </div>
            <div className="text-muted mt-3">
              <p><strong>Note:</strong> This card will be saved according to the RBI guidelines on secure storage of payment card data.</p>
            </div>
            <div className='d-flex gap-3'>
              <button type="submit" className="btn btn-outline-secondary w-100 mb-3">Continue</button>
              <button type="button" className="btn btn-outline-danger w-100 mb-3"onClick={handleCancel}>Cancel</button>
            </div>
          </form>

        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Card;
