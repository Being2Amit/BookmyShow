import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import axios from "axios";
//import { Link } from "react-router-dom";
function Payment() {
  const [data, setData] = useState({ mobile: '', password: '' }); // 'mobile' will store User_Name, email or phone number
  const [error, setError] = useState('');
  const { mobile, password } = data;  // destructure mobile (either phone or email) and password
  const { login, loggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [poster, setPoster] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null); // Payment status tracker
  //const [showLoginForm, setShowLoginForm] = useState(true);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const Data = location.state;
  const [user, setUser] = useState('');
  const categories = { premium: ['N', 'M', 'L', 'K'], Gold: ['J', 'I', 'H', 'G', 'F'], Silver: ['D', 'C', 'B', 'A'], };
  const getCategory = (seat) => {// Function to determine category based on seat row
    const seatRow = seat.charAt(0); // Get the row (e.g., "M" from "M11")
    for (const [category, rows] of Object.entries(categories)) {// Check each category
      if (rows.includes(seatRow)) { return category; } // Return the category if the row matches
    } return 'Unknown'; // Default if no match is found
  };
  const groupSeatsByCategory = (seats) => {
    const grouped = { premium: [], Gold: [], Silver: [] };// Grouping seats by their category
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setData({ ...data, [name]: value });
  };
  const handleMakePayment = () => {
    if (!loggedIn) {
      toast.error("Please log in to enable payment options.");
      return;
    }
    setShowPaymentOptions(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.mobile.trim() || !data.password.trim()) {
      setError('Please fill out all fields');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/login', data);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        console.log(res.data);
        setUser(res.data.result)
        setError('');
        login();
        setShowLoginForm(false);
      }
      else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
    setIsLoading(false);
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const options = {
        key: "rzp_test_Su4WV4zdBIGTmZ",
        key_secret: 'EmH6eToe5CvCfAfgfADREv3C',
        amount: Data.totalAmount * 100,
        currency: "INR",
        name: "MovieHive.com",
        description: "Movie Ticket Payment",
        image: "logo.png",
        handler: (response) => {// Only proceed if paymentStatus is not set (avoiding duplicate processing)
          if (!paymentStatus) {
            console.log(response);
            toast.success("Payment Successful! Redirecting to Order Summary in 5sec.");
            setPaymentStatus("success");
            setTimeout(() => {
              navigate("/order-summary", { state: { ...Data, paymentId: response.razorpay_payment_id, }, });// Pass all relevant data to the OrderSummary page and Add payment details to avoid re-sending data
            }, 5000); // 5-second delay
          }
        },
        prefill: {
          name: user[0]?.fullname || "",
          email: user[0]?.email || "",
          contact: user[0]?.mobile || "",
        },
        theme: { color: "#F37254" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        console.error(response);
        toast.error("Payment Failed! Please try again later.");
        setPaymentStatus("failure");
      });
      razorpay.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    if (paymentStatus) { console.log("Payment Status Changed:", paymentStatus); }
  }, [paymentStatus]);

  // Function to fetch poster using TMDB API
  const fetchPoster = async () => {
    const apiKey = "41c953dc7d1c21d27df7b693e9740a3c"; // TMDB API Key
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          Data.movieTitle
        )}`
      );
      const movies = response.data.results;
      if (movies.length > 0) {
        const latestMovie = movies.reduce((latest, current) => {
          const latestDate = new Date(latest.release_date || "1900-01-01");
          const currentDate = new Date(current.release_date || "1900-01-01");
          return currentDate > latestDate ? current : latest;
        });
        setPoster(`https://image.tmdb.org/t/p/w500${latestMovie.poster_path}`);
      }
    } catch (error) {
      console.error("Error fetching poster:", error);
    }
  };

  useEffect(() => {
    fetchPoster(); // Fetch poster when component mounts
  }, [Data.movieTitle]);
  return (
    <div className="payment container">
      <div className="row mt-4">
        <div className="col-md-6">
          {/* Show Login Form only if not logged in */}
          {!loggedIn && (
            <form className="card text-center m-auto my-5 shadow p-3 bg-light" onSubmit={handleSubmit}>
              <h1 className="fs-2 text-center mb-3">Login</h1>
              <input type="text" className="form-control mb-3" name="mobile" placeholder="Enter your Mobile/Email" value={mobile} onChange={handleChange} />
              <input type="password" className="form-control mb-3" name="password" placeholder="Enter your password" value={password} onChange={handleChange} />
              <div className="button">
                <button type="submit" className="btn btn-danger" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                {error && <p className="text-danger mt-3">{error}</p>}
              </div>
              {/* <div className="mt-2">
                <p className='col-12 text-center'>Forgot password ?<Link to="/forgot" className="text-decoration-none">&nbsp;Reset</Link></p>
                <p className="col-12">Don't have an account?<Link to="/register" className="text-decoration-none">&nbsp;Sign up</Link></p>
              </div> */}
            </form>
          )}
          {/* Payment Options */}
          < div className="accordion mb-3" id="paymentAccordion" >
            <div className="accordion-item ">
              <h2 className="accordion-header" id="headingPayment">
                <button className="accordion-button collapsed bg-light" style={{ paddingLeft: "40%" }} type="button" onClick={handleMakePayment} disabled={!loggedIn}>
                  {showPaymentOptions ? "Payment Options" : "Make Payment"}
                </button>
              </h2>
              {showPaymentOptions && (<div id="collapsePayment" className="accordion-collapse collapse show" aria-labelledby="headingPayment">
                <div className="accordion-body" style={{ paddingLeft: "40%" }}>
                  <button className="btn btn-danger" onClick={handlePayment} disabled={false}>Pay With Razorpay</button>
                </div>
              </div>
              )}
            </div>
          </div >
        </div >
        {/* Right Section: Order Summary */}
        <div className="col-md-6 ">
          < div className="card Order position-relative bg-light" >
            <div className="card-title mt-3 mx-3 text-uppercase text-secondary">Order Summary</div>
            <div className="card-body">
              <div className=" row">
                <div className="col-md-3">
                  {poster && (
                    <img src={poster} alt={`${Data.movieTitle} Poster`} className="img-fluid mb-3"
                    style={{ borderRadius: "10px", width: '150px', height: '150px' }}/>
                  )}
                </div>
                <div className="col">
                  <p className="d-flex justify-content-between align-items-center mb-1">
                    <strong>{Data.movieTitle} ({Data.selectedLanguage}) ({Data.certification})</strong>&nbsp;
                    <span className="badge bg-secondary text-white">{Data.selectedSeats.length} {Data.selectedSeats.length > 1 ? "Tickets" : "Ticket"}</span>
                  </p>
                  <p className="text-muted mb-1">{Data.selectedLanguage}, {Data.selectedFormat}</p>
                  <p className="text-muted mb-1">{Data.theaterName}: {Data.theaterLocation} ({Data.screenName})</p>
                  {Object.entries(groupedSeats).map(([category, seats], index) => {
                    if (seats.length > 0) {
                      return (<p className="text-muted mb-1" key={index}>
                        {category.charAt(0).toUpperCase() + category.slice(1)} - {seats.join(", ")}</p>);
                    } return null;
                  })}
                  <div className="d-flex justify-content-between">
                    <p className="text-muted">{formattedDate} </p >
                    <p className="text-muted">{Data.selectedShowtime} </p>
                  </div>
                </div>
              </div>
              <hr style={{ border: "1px dashed gray" }} />
              <div className="d-flex justify-content-between">
                <p className="mb-1">Sub Total:</p>
                <p className="mb-1">Rs. {Data.totalSeatsPrice}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="mb-1">Convenience fees:</p>
                <p className="mb-1">Rs. {Data.convenienceFee}</p>
              </div>
              <hr style={{ border: "1px dashed gray" }} />
              {/* <div className="bg-light p-2">
            <div className="d-flex justify-content-between align-items-center">
              <label><input type="checkbox" className="form-check-input me-2" />Donate to BookAChange</label>
              <span>Rs. 0</span>
            </div>
            <p className="small text-muted mb-0">(₹1 per ticket will be added)</p>
            <p className="text-primary small mb-0"><a href="">View T&C</a></p>
          </div>
          <hr /> */}
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0"><strong>Amount Payable:</strong></p>
                <p className="mb-0 text-muted"><strong>Rs. {Data.totalAmount}</strong></p>
              </div>
            </div>
          </div >
        </div>
      </div >
      <style>
        {`.Order::before, .Order::after {content: '';position: absolute;width: 20px;height: 20px;background-color: white;border-radius: 50%;border: 1px solid #ccc;top: 62%; transform: translateY(-50%);}
        .Order::before { left: -5px; border-left: 1px solid white; }
        .Order::after { right: -5px; border-right: 1px solid white; }
      `}
      </style>
      <ToastContainer />
    </div >
  );
};

export default Payment;
