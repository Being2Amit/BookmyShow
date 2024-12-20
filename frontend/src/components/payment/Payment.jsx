import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
//import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
const Payment = () => {
  const [data, setData] = useState({ mobile: '', password: '' }); // 'mobile' will store User_Name, email or phone number
  const [error, setError] = useState('');
  const { mobile, password } = data;  // destructure mobile (either phone or email) and password
  const { login,loggedIn} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Payment status tracker
  const [showLoginForm, setShowLoginForm] = useState(true);
  const location = useLocation();
  const Data = location.state;
  const categories = { premium: ['N', 'M', 'L', 'K'], vip: ['J', 'I', 'H', 'G', 'F'], Silver: ['D', 'C', 'B', 'A'], };
  const getCategory = (seat) => {// Function to determine category based on seat row
    const seatRow = seat.charAt(0); // Get the row (e.g., "M" from "M11")
    for (const [category, rows] of Object.entries(categories)) {// Check each category
      if (rows.includes(seatRow)) {return category;} // Return the category if the row matches
    }return 'Unknown'; // Default if no match is found
  };
  const groupSeatsByCategory = (seats) => {const grouped = { premium: [], vip: [], Silver: [] };// Grouping seats by their category
    seats.forEach((seat) => {const category = getCategory(seat);
      if (grouped[category]) {grouped[category].push(seat);} // Add seat to the corresponding category group
    });return grouped;
  };
  const groupedSeats = groupSeatsByCategory(Data.selectedSeats);// Get the grouped seats
  // Helper function to format date and determine if the date is "Today"
  const formatDate = (date) => {const options = {weekday: "short", day: "2-digit", month: "short", year: "numeric", };
  return new Date(date).toLocaleDateString("en-US", options);};
  const getDateLabel = (date) => {
  const today = new Date();
  const inputDate = new Date(date);
  return inputDate.toDateString() === today.toDateString()
  ? `Today, ${formatDate(date)}` : formatDate(date);    
  };
  const formattedDate = Data.selectedDate ? getDateLabel(Data.selectedDate) : "";
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setData({ ...data, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.mobile.trim() || !data.password.trim()) {setError('Please fill out all fields');return;}
    setIsLoading(true);
    try {const res = await axios.post('http://localhost:5000/login', data);
      if (res.data.success) {localStorage.setItem('token', res.data.token);setError('');login();setShowLoginForm(false);} 
      else {setError(res.data.message || 'Invalid credentials');}
    } catch (err) {setError('An error occurred. Please try again later.');}
    setIsLoading(false);
  };
  const handlePayment = () => {
    console.log("Routing to RazorPay...");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5; // Simulate success or failure
      setPaymentStatus(isSuccess ? "success" : "failure");
    }, 3000);
  };
  const handleStartAgain = () => {
    console.log("Redirecting to Homepage...");
    window.location.href = "/";
  };
  useEffect(() => {
    if (paymentStatus === "success") {
      setTimeout(() => {
        window.location.href = "/order"; // Redirect to Order 
      }, 10000);
    }
  }, [paymentStatus]);
  return (
    <div className="payment container">
      <div className="row  mt-4">
        <div className="col-md-7">{/* Left Section */}
          <div className="accordion mb-3" id="offersAccordion">{/* Offers Section */}
            {loggedIn ? (<p className="card py-3 px-3 text-center">You are already logged in</p>) : ( // If logged in, show this message instead of the dropdown
              <div className="accordion-item ">
                <h2 className="accordion-header" id="headingOffers">
                  <button className="accordion-button collapsed" style={{paddingLeft:'40%'}} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOffers"
                    aria-expanded="false" aria-controls="collapseOffers">Please log in to continue
                  </button>
                </h2>
                <div id="collapseOffers" className="accordion-collapse collapse" aria-labelledby="headingOffers" data-bs-parent="#offersAccordion">
                  <div className="accordion-body">
                    {showLoginForm && (
                      <form className="card text-center m-auto my-5 shadow p-3 " onSubmit={handleSubmit}>
                        <h1 className="fs-2 text-center mb-3">Login</h1>
                        <input type="text" className="form-control border-outline-none mb-3" name="mobile" placeholder="Enter your Mobile/Email" value={mobile} onChange={handleChange} />
                        <input type="password" className="form-control border-outline-none mb-3" name="password" placeholder="Enter your password" value={password} onChange={handleChange} />
                        <div className="d-flex justify-content-center">
                          <button type="submit" className="btn btn-success" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                        </div>
                        {error && <p className="text-danger mt-3">{error}</p>}
                        {/* <div className="mt-2">
                      <p className='col-12 text-center'>Forgot password ?<Link to="/forgot" className="text-decoration-none">&nbsp;Reset</Link></p>
                      <p className="col-12">Don't have an account?<Link to="/register" className="text-decoration-none">&nbsp;Sign up</Link></p>
                    </div> */}
                      </form>
                    )}
                  </div>
                </div>
              </div>
             )}
          </div>
          {/* Payment Options */}
          <div className="accordion mb-3" id="paymentAccordion">
            <div className="accordion-item ">
              <h2 className="accordion-header" id="headingPayment">
                <button className="accordion-button collapsed" style={{paddingLeft:'40%'}} type="button" data-bs-toggle="collapse" data-bs-target="#collapsePayment"
                  aria-expanded="false" aria-controls="collapsePayment">Payment Options
                </button>
              </h2>
              <div id="collapsePayment" className="accordion-collapse collapse" aria-labelledby="headingPayment" data-bs-parent="#paymentAccordion">
                <div className="accordion-body">
                  <ul>
                    <li>UPI</li>
                    <li>Credit/Debit Cards</li>
                    <li>Netbanking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-danger btn-lg" onClick={handlePayment} disabled={paymentStatus !== null}> Make Payment</button>
            </div>
        </div>
        {/* Right Section: Order Summary */}
        <div className="card col-md-5">
          <div className="card-title mt-3 mx-3 text-uppercase text-secondary">Order Summary</div>
          <div className="card-body">
            <p className="d-flex justify-content-between align-items-center mb-1">
              <strong>{Data.movieTitle} ({Data.selectedLanguage}) ({Data.certification})</strong>&nbsp;
              <span className="badge bg-secondary text-white">{Data.selectedSeats.length} {Data.selectedSeats.length > 1 ? "Tickets" : "Ticket"}</span>
            </p>
            <p className="text-muted mb-1">{Data.selectedLanguage}, {Data.selectedFormat}</p>
            <p className="text-muted mb-1">{Data.theaterName}: {Data.theaterLocation} ({Data.screenName})</p>
            {Object.entries(groupedSeats).map(([category, seats], index) => {
              if (seats.length > 0) {return (<p className="text-muted mb-1" key={index}>
                  <strong>{category.charAt(0).toUpperCase() + category.slice(1)} - {seats.join(", ")}</strong></p>);
              } return null;
            })}
            <p className="text-muted">{formattedDate} <br />
            <span className="text-muted">{Data.selectedShowtime}</span> </p>
            <hr />
            <div className="d-flex justify-content-between">
              <p className="mb-1">Sub Total:</p>
              <p className="mb-1">Rs. {Data.totalSeatsPrice}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-1">+ Convenience fees:</p>
              <p className="mb-1">Rs. {Data.convenienceFee}</p>
            </div>
            <hr />
            {/* <div className="bg-light p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label><input type="checkbox" className="form-check-input me-2" />
                    Donate to BookAChange
                  </label>
                  <span>Rs. 0</span>
                </div>
                <p className="small text-muted mb-0">
                  (₹1 per ticket will be added)
                </p>
                <p className="text-primary small mb-0">
                  <a href="#">View T&C</a>
                </p>
              </div>
              <hr /> */}
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">
                <small>Amount Payable:</small>
              </p>
              <p className="mb-0 text-danger">
                <strong>Rs. {Data.totalAmount}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Messages */}
      {paymentStatus === "success" && (
        <div className="alert alert-success mt-4" role="alert">
          Payment Successful! Redirecting to Order ...
        </div>
      )}
      {paymentStatus === "failure" && (
        <div className="alert alert-danger mt-4" role="alert">
          Payment Failed!
          <button
            className="btn btn-danger mt-3"
            onClick={handleStartAgain}
          >
            Start Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
