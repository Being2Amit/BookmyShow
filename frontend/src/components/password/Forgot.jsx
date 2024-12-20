import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error
    setSuccess(""); // Clear success
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your Email address");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/checkemail?email=${email}`);
      Cookies.set("email", email);
      setSuccess("Instructions for resetting your password have been sent to your email.");
      setEmail(""); // Clear the email field
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Email does not exist. Please sign up.");
      }
      setEmail("");
    }
  };

  return (
    <div className="container m-5 text-center ">
      <form
        className="card shadow mx-auto max-w-lg p-4  bg-dark text-light"
        onSubmit={handleSubmit}
      >
        <h4 className="pt-2">Forgot Password</h4>
        
        <div className="container mx-auto max-w-md rounded-lg">
          <label className="row fw-bold fs-6">
            Email address:
            <input
              className={`form-control mt-2 p-2 border-1 ${error ? "is-invalid" : ""}`}
              type="email"  
              placeholder="Enter Email"
              value={email}
              onChange={handleChange}
              required
              style={{outline: 'none', boxShadow: 'none', border: '1px solid #ced4da',}}
              
            />
            {error && <div id="email-error" className="invalid-feedback">{error}</div>}
          </label>
          <button className="col-4 mt-3 btn btn-success" type="submit">
            Reset Password
          </button>
          {success && <div className="mt-3 text-success">{success}</div>}
        </div>
        <div className="mt-3">
          <p><Link to="/newpassword" className="text-decoration-none">Create New Password</Link></p>
          <label className="col-12 pb-3 fs-6">
          Remember your password? &nbsp;
          <Link to="/login" className="text-decoration-none">Login here</Link>
        </label>
        </div>
      </form>
    </div>
  );
}

export default Forgot;
