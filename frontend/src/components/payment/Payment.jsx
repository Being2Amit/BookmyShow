import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { TbPasswordUser} from "react-icons/tb";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Payment() {
  const [data, setData] = useState({ mobile: '', password: '' }); // 'mobile' will store User_Name, email or phone number
  const [error, setError] = useState('');
  const { mobile, password } = data;  // destructure mobile (either phone or email) and password
  const { login, loggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [poster, setPoster] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null); // Payment status tracker
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const Data = location.state;
  const [user, setUser] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    setError({ ...error, [name]: '', server: '' });
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
      setError({
        ...error,
        mobile: !data.mobile.trim() ? 'Please enter your mobile/email' : '',
        password: !data.password.trim() ? 'Please enter your password' : '',
      });
      return;
    }
    if (!validateEmail(data.mobile) && !/^\d+$/.test(data.mobile)) {
      setError({ ...error, mobile: 'Please enter a valid email or mobile number' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/login', data);
      if (res.data.success) {
        const token = res.data.token;
        const name = res.data.result[0].fullname;
        // Store in both cookies and localStorage
        Cookies.set('token', token, { expires: 7 }); // Set cookie for token
        localStorage.setItem('token', token); // Optional: Keep token in localStorage
        localStorage.setItem('name', name); // Store user name or other non-sensitive info in localStorage
        setError({ mobile: '', password: '', server: '' });
        setUser(res.data.result[0]);
        login(token); // Pass the token to the context's login function
        toast.success('Login successful!');
      } else {
        if (res.data.message === 'User not found') {
          setError({ ...error, mobile: 'Invalid email or mobile' });
        } else if (res.data.message === 'Invalid password') {
          setError({ ...error, password: 'Invalid password' });
        } else {
          setError({ ...error, server: res.data.message || 'Invalid credentials' });
        }
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      if (err.response?.status === 404) {
        setError({ ...error, mobile: 'User not found' });
      } else if (err.response?.status === 401) {
        setError({ ...error, password: `Passwords don't match` });
      } else {
        setError({ ...error, server: 'An unexpected error occurred in Server. Please try again later.' });
      }
    }
    setIsLoading(false);
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const options = {
        key: "rzp_test_Su4WV4zdBIGTmZ",
        key_secret: 'EmH6eToe5CvCfAfgfADREv3C',
        amount: Data.totalAmount * 100,
        currency: "INR",
        name: "BookAnyTickets.com",
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
          name: user.fullname || "",
          email: user.email || "",
          contact: user.mobile || "",
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
          const latestDate = new Date(latest.release_date || "2000-01-01");
          const currentDate = new Date(current.release_date || "2000-01-01");
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
            <form className="card shadow p-4 rounded position-relative text-center" onSubmit={handleSubmit}>
              <h1 className="fs-4 text-center mb-3">Login</h1>
              <div className='input-group mb-2'>
                <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                <input type="text" className="form-control border-outline-none" name="mobile" placeholder="Enter your Mobile/Email" value={mobile} onChange={handleChange}
                  style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
              </div>
              {error.mobile && <div className="text-danger text-start mb-3"><small>{error.mobile}</small></div>}
              <div className='input-group mb-2 position-relative '>
                <span className="input-group-text"><TbPasswordUser /></span>
                <input type={isPasswordVisible ? "text" : "password"} className="form-control border-outline-none" name="password"
                  placeholder="Enter your password" value={password} onChange={handleChange} style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
                <button type="button" onClick={togglePasswordVisibility} className="position-absolute top-50 end-0 translate-middle-y me-2" style={{ zIndex: 1 }} >
                  <i className={`bi ${isPasswordVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} style={{ fontSize: '1.2rem' }}></i>
                </button>
              </div>
              {error.password && <div className="text-danger text-start mb-3"><small>{error.password}</small></div>}
              <div className="login">
                <button type="submit" className="btn btn-danger" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                {error.server && <div className="text-danger text-center mb-3"><small>{error.server}</small></div>}
              </div>
              <div className="mt-2 text-center">
                {/* <p className='col-12'>Forgot password? <Link to="/forgot" className="text-decoration-none">Reset</Link></p> */}
                <p className="col-12">Don't have an account? <Link to="/register" className="text-decoration-none">Sign up</Link></p>
              </div>
            </form>
          )}
          {/* Payment Options */}
          < div className="accordion mt-3 mb-3" id="paymentAccordion" >
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
                    style={{ borderRadius: "10px", width: '150px', height: '150px' }} />
                  )}
                </div>
                <div className="col">
                  <p className="d-flex justify-content-between align-items-center mb-1">
                    <strong>{Data.movieTitle} ({Data.selectedLanguage})</strong>&nbsp;
                    <span className="badge bg-secondary text-white">{Data.selectedSeats.length} {Data.selectedSeats.length > 1 ? "Tickets" : "Ticket"}</span>
                  </p>
                  <p className="text-muted mb-1">{Data.selectedLanguage}, {Data.selectedFormat} ({Data.certification})</p>
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
