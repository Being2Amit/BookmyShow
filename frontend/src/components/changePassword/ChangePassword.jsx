import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false); // For toggling password visibility
  const [passwordStrength, setPasswordStrength] = useState(""); // For password strength feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentPassword") setCurrentPassword(value);
    if (name === "newPassword") { setNewPassword(value); checkPasswordStrength(value); } // Check password strength as the user types
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if new password and confirm password match
    if (currentPassword === newPassword) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    // Prepare data for password change
    const password = { currentPassword, newPassword };
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    try {
      const response = await axios.put('http://localhost:5000/changepass', password, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response)
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsEditing(false); // Exit editing mode after successful password change
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); // Reset password fields after successful change
      }
    }
    catch (error) {
      console.log(error.response)
      if (error.response.status === 401) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error changing password:", error);
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className="d-flex justify-content-center mt-5 pt-5">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "500px" }}>
          <h4 className="card-title mb-3 text-center">Change Password</h4>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input type={showPasswords ? "text" : "password"} className="form-control" placeholder="Current Password" name="currentPassword"
                value={currentPassword} onChange={handleChange} disabled={!isEditing}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text"> <i className="bi bi-lock-fill"></i></span>
              <input type={showPasswords ? "text" : "password"} className="form-control" placeholder="New Password" name="newPassword"
                value={newPassword} onChange={handleChange} disabled={!isEditing}
              />
            </div>
            {isEditing && newPassword && (
              <div className="mb-3">
                <small>Password Strength:{" "}
                  <span className={`fw-bold ${passwordStrength ? `text-${passwordStrength === "Strong" ? "success" : passwordStrength === "Medium" ? "warning" : "danger"}` : ""}`}>{passwordStrength || "N/A"}</span>
                </small>
              </div>
            )}
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input type={showPasswords ? "text" : "password"} className="form-control" placeholder="Confirm New Password" name="confirmPassword" value={confirmPassword}
                onChange={handleChange} disabled={!isEditing}
              />
            </div>
            <div className="mb-3">
              <input type="checkbox" id="togglePasswordVisibility" className="form-check-input" checked={showPasswords} onChange={togglePasswordVisibility} />
              <label htmlFor="togglePasswordVisibility" className="form-check-label ms-2">Show Passwords</label>
            </div>
            <div className="text-center">
              {isEditing ? (<button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>)
                : (<button type="button" className="btn btn-secondary " onClick={() => setIsEditing(true)}>Edit Password</button>)}
            </div>
          </form>
        </div>
      <ToastContainer />
    </div>
  );
}

export default ChangePassword;
