import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {ToastContainer,toast } from "react-toastify";
function ForgotPassword() {
 
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError({}); // Clear errors when typing
    setSuccess(""); // Clear success message when typing
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError({ email: "Please enter your Email address" });
      return;
    }

    // Make the API request using `then` and `catch`
    axios.post("http://localhost:5000/forgot-password", { email })
      .then((response) => {
        if (response.data.success) {
          setSuccess("Instructions for resetting your password have been sent to your email.");
          setEmail(""); // Clear the email field
          setError({}); // Clear any existing error messages
        } else {
          setError({ email: response.data.message || "Email is not registered" });
          setSuccess(""); // Clear success message
        }
      })
      .catch((err) => {
        setError({ email: "An error occurred. Please try again later." });
        setSuccess(""); // Clear success message
      });
  };

  const changemail = async (e) => {
    e.preventDefault();
    console.log(email);
    axios
      .get(`http://localhost:5000/checkemail?email=${email}`)
      .then((res) => {
        console.log(res);
        Cookies.set("email", email);
        toast.success("Email sent successfully");
        setEmail("");
        setTimeout(() => {
          navigate("/login");  
        }, 2000); 
      })
      .catch((err) => {
        console.log(err);
        toast.error("Please sign up, email does not registered.");
        setError({ email: "Please enter a valid email." });
        setEmail("");
      });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: "450px" }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-3">Forgot Password</h2>
          <small className="text-muted text-start">Please enter your email address and we'll send you instructions on how to reset your password.</small>
          <form className="mt-3" onSubmit={changemail}>
            <div className="mb-3">
              <input className="form-control" type="email"value={email} placeholder="Enter email address" onChange={handleChange}
              style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da' }}/>
              {error.email && (<div className="text-danger text-start mb-3"><small>{error.email}</small></div>)}
            </div>
            {success && <div className="alert alert-success">{success}</div>}
            <div className="text-center">
              <button type="submit" className="btn btn-outline-danger"> Submit </button>
            </div>
            <div className="text-center mt-2">Back to <Link to="/login" className="text-decoration-none">Login</Link></div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
