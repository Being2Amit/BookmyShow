import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("email", email);
  
    fetch("https://formspree.io/f/your_form_id", {  // Replace with your Formspree endpoint
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      },
    })
    .then((response) => {
      if (response.ok) {
        setMessage("Password reset link has been sent to your email!");
      } else {
        setMessage("Oops! Something went wrong. Please try again.");
      }
      setLoading(false);
    })
    .catch((error) => {
      setMessage("Error: Unable to send email. Please try again later.");
      setLoading(false);
    });
  };
  

  return (
    <div className="container m-5 text-center">
      <form
        className="card shadow mx-auto max-w-lg p-4"
        onSubmit={handleSubmit}
      >
        <h4 className="pt-2">Forgot Password</h4>
        <label className="col-12 pb-3 fs-6">
          Remember your password? &nbsp;
          <a href="/" className="text-decoration-none">Login here</a>
        </label>
        <div className="container mx-auto max-w-md rounded-lg">
          <label className="row fw-bold fs-6">
            Email address:
            <input
              className="col-12 p-2 border-1"
              type="email"
              placeholder="Enter Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button className="col-4 mt-3 btn btn-info" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </button>
          {message && <p className="col-12 mt-3">{message}</p>}
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
