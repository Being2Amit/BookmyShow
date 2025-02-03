import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Newpassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const userEmail = Cookies.get("email");
  const data = { password, userEmail };

  const checkPassword = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter the password");
      setSuccess("");
    } else if (!confirmpassword) {
      setError("Confirm Password is required!");
      setSuccess("");
    } else if (password !== confirmpassword) {
      setError("Passwords do not match!");
      setSuccess("");
    } else {
      setError("");
      setSuccess("Password updated successfully");
      axios.post("http://localhost:5000/update_password", data)
        .then((res) => { console.log(res);
          navigate("/login");
        })
        .catch((err) => { console.log(err);});
      clearFields();
    }
  };
  const clearFields = () => {
    setEmail("");
    setPassword("");
    setConfirmpassword("");
  };
  // password 
  const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
  const handlePasswordChange = (e) => { 
    setPassword(e.target.value);
    setError(""); 
    setSuccess(""); 
  };
  //confirm password
  const toggleConfirmPasswordVisibility = () => { setShowConfirmPassword(!showConfirmPassword); };
  const handleConfirmPasswordChange = (e) => {
    setConfirmpassword(e.target.value);
    setError(""); // Clear error message
    setSuccess(""); // Clear success message
  };
  const onSubmitHandler = (e) => {e.preventDefault();};
  const handleClose = () => {navigate("/login");}; // Redirect to home page

  return (
    <div className="container mt-5 text-center">
      <div className="row justify-content-center">
        <div className="card p-0 col-12 col-md-8 col-lg-5">
          <form className="shadow p-4 rounded position-relative" onSubmit={onSubmitHandler}>
            <button type="button" onClick={handleClose} className="btn btn-sm btn-outline-muted position-absolute top-0 end-0 mx-3 mt-3">X</button>
            <h2>Reset Password</h2>
            <div className="input-group mb-2">
              <input className="form-control" type="email" placeholder="Enter Email Id" value={userEmail} onChange={(e) => setEmail(e.target.value)} disabled
              required style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da' }}/>
            </div>
            <div className="input-group mb-2">
              <input className="form-control" type={showPassword ? "text" : "password"} placeholder="Enter New password"value={password}
              required onChange={handlePasswordChange} style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da' }}/>
              {password && (
              <button type="button" onClick={togglePasswordVisibility} className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ zIndex: 1 }}>
                <i className={`bi my-2 ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} style={{ fontSize: '1.2rem' }}></i>
              </button>)}
            </div>
            <div className="input-group mb-2">
              <input className="form-control" type={showConfirmPassword ? "text" : "password"}placeholder="Confirm New password"
              value={confirmpassword} required onChange={handleConfirmPasswordChange} style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da' }}/>
              {confirmpassword && (
              <button type="button" onClick={toggleConfirmPasswordVisibility} className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ zIndex: 1 }}>
                <i className={`bi my-2 ${showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} style={{ fontSize: '1.2rem' }}></i>
              </button>)}
            </div>
            <button onClick={checkPassword} className="btn btn-outline-secondary">Submit</button>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            <p className="mt-1"> Back to <Link to="/login" className="text-decoration-none">login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Newpassword;
